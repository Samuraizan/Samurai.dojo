import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import { memoryManager } from '../memory';
import { skillManager } from '../skills/skill-manager';
import { eventBus, EventType } from '../../nervous-system/event-bus';
import { MemoryType } from '../memory/types';
import type { Skill, SkillCategory } from '../skills/types';

interface RepositoryState {
  version: string;
  lastUpdated: number;
  activeModules: string[];
  pendingChanges: boolean;
}

interface DeploymentState {
  environment: 'development' | 'production';
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  lastDeployed: number;
}

interface CapabilityState {
  skills: Map<SkillCategory, Skill[]>;
  knowledgeDomains: string[];
  activeLearningTasks: string[];
  performanceMetrics: {
    successRate: number;
    responseTime: number;
    accuracyScore: number;
  };
}

export class SelfAwareness {
  private static instance: SelfAwareness;
  private repository: RepositoryState;
  private deployment: DeploymentState;
  private capabilities: CapabilityState;
  private lastIntrospection: number;

  private constructor() {
    this.repository = {
      version: '0.1.0',
      lastUpdated: Date.now(),
      activeModules: ['core', 'mind', 'nervous-system', 'body'],
      pendingChanges: false
    };

    this.deployment = {
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      status: 'online',
      uptime: 0,
      lastDeployed: Date.now()
    };

    this.capabilities = {
      skills: new Map(),
      knowledgeDomains: [],
      activeLearningTasks: [],
      performanceMetrics: {
        successRate: 0,
        responseTime: 0,
        accuracyScore: 0
      }
    };

    this.lastIntrospection = Date.now();
    this.setupEventListeners();
    this.startIntrospectionLoop();
  }

  static getInstance(): SelfAwareness {
    if (!SelfAwareness.instance) {
      SelfAwareness.instance = new SelfAwareness();
    }
    return SelfAwareness.instance;
  }

  private setupEventListeners(): void {
    eventBus.subscribe(EventType.AGENT_INITIALIZED, async () => {
      await this.updateCapabilities();
    });

    eventBus.subscribe(EventType.MEMORY_UPDATED, async () => {
      await this.updateKnowledgeDomains();
    });

    eventBus.subscribe(EventType.TASK_UPDATED, async () => {
      await this.updatePerformanceMetrics();
    });
  }

  private async startIntrospectionLoop(): Promise<void> {
    setInterval(async () => {
      await this.performIntrospection();
    }, 300000); // Perform introspection every 5 minutes
  }

  private async performIntrospection(): Promise<void> {
    this.lastIntrospection = Date.now();
    
    await Promise.all([
      this.updateCapabilities(),
      this.updateKnowledgeDomains(),
      this.updatePerformanceMetrics()
    ]);

    // Store introspection results in memory
    await this.storeIntrospectionResults();
  }

  private async updateCapabilities(): Promise<void> {
    // Update skills from skill manager
    const allSkills = skillManager.getAllSkills();
    this.capabilities.skills.clear();
    
    allSkills.forEach(skill => {
      const category = skill.category;
      if (!this.capabilities.skills.has(category)) {
        this.capabilities.skills.set(category, []);
      }
      this.capabilities.skills.get(category)?.push(skill);
    });
  }

  private async updateKnowledgeDomains(): Promise<void> {
    const memories = memoryManager.query({ type: MemoryType.KNOWLEDGE });
    const domains = new Set<string>();
    
    memories.forEach(memory => {
      if (memory.metadata.context) {
        domains.add(memory.metadata.context);
      }
    });

    this.capabilities.knowledgeDomains = Array.from(domains);
  }

  private async updatePerformanceMetrics(): Promise<void> {
    // Calculate success rate from recent tasks
    const recentMemories = memoryManager.query({
      type: MemoryType.TASK,
      timeRange: {
        start: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
        end: Date.now()
      }
    });

    const successfulTasks = recentMemories.filter(memory => 
      memory.content && (memory.content as any).status === 'completed'
    );

    this.capabilities.performanceMetrics = {
      successRate: successfulTasks.length / recentMemories.length || 0,
      responseTime: this.calculateAverageResponseTime(recentMemories),
      accuracyScore: this.calculateAccuracyScore(recentMemories)
    };
  }

  private calculateAverageResponseTime(memories: any[]): number {
    const responseTimes = memories
      .filter(m => m.content && m.content.startTime && m.content.endTime)
      .map(m => m.content.endTime - m.content.startTime);

    return responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;
  }

  private calculateAccuracyScore(memories: any[]): number {
    const scoredMemories = memories.filter(m => m.content && m.content.accuracy);
    return scoredMemories.reduce((sum, m) => sum + m.content.accuracy, 0) / scoredMemories.length || 0;
  }

  private async storeIntrospectionResults(): Promise<void> {
    const introspectionData = {
      timestamp: Date.now(),
      repository: this.repository,
      deployment: this.deployment,
      capabilities: {
        skillCount: Array.from(this.capabilities.skills.values()).flat().length,
        knowledgeDomains: this.capabilities.knowledgeDomains,
        performanceMetrics: this.capabilities.performanceMetrics
      }
    };

    await memoryManager.store(
      MemoryType.WORKING_STATE,
      introspectionData,
      {
        importance: 0.8,
        context: 'self-awareness',
        associations: ['introspection', 'capabilities', 'performance']
      }
    );
  }

  // Public methods for querying self-awareness state
  async getCapabilitiesSummary(): Promise<string> {
    const skills = Array.from(this.capabilities.skills.entries());
    const summary = [
      `Current Capabilities Summary:`,
      `\nSkills:`,
      ...skills.map(([category, skillList]) => 
        `- ${category}: ${skillList.length} skills (${skillList.map(s => s.name).join(', ')})`
      ),
      `\nKnowledge Domains: ${this.capabilities.knowledgeDomains.join(', ')}`,
      `\nPerformance Metrics:`,
      `- Success Rate: ${(this.capabilities.performanceMetrics.successRate * 100).toFixed(1)}%`,
      `- Average Response Time: ${this.capabilities.performanceMetrics.responseTime.toFixed(2)}ms`,
      `- Accuracy Score: ${(this.capabilities.performanceMetrics.accuracyScore * 100).toFixed(1)}%`
    ].join('\n');

    return summary;
  }

  async getSystemState(): Promise<string> {
    const uptime = Date.now() - this.deployment.lastDeployed;
    const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(1);

    return [
      `System State:`,
      `\nRepository:`,
      `- Version: ${this.repository.version}`,
      `- Last Updated: ${new Date(this.repository.lastUpdated).toISOString()}`,
      `- Active Modules: ${this.repository.activeModules.join(', ')}`,
      `\nDeployment:`,
      `- Environment: ${this.deployment.environment}`,
      `- Status: ${this.deployment.status}`,
      `- Uptime: ${uptimeHours} hours`,
      `- Last Deployed: ${new Date(this.deployment.lastDeployed).toISOString()}`
    ].join('\n');
  }

  async updateRepositoryState(state: Partial<RepositoryState>): Promise<void> {
    this.repository = { ...this.repository, ...state };
    await this.storeIntrospectionResults();
  }

  async updateDeploymentState(state: Partial<DeploymentState>): Promise<void> {
    this.deployment = { ...this.deployment, ...state };
    await this.storeIntrospectionResults();
  }
}

// Export singleton instance
export const selfAwareness = SelfAwareness.getInstance(); 