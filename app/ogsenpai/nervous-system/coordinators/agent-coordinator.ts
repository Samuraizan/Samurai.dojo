import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import { eventBus, EventType } from '../event-bus';
import type { AgentEvent } from '../event-bus';

interface SubAgent {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'error';
  capabilities: string[];
  lastActive: number;
}

export class AgentCoordinator {
  private static instance: AgentCoordinator;
  private agents: Map<string, SubAgent>;
  private maxConcurrentTasks: number;

  private constructor() {
    this.agents = new Map();
    this.maxConcurrentTasks = 3; // Default max concurrent tasks
    this.setupEventListeners();
  }

  static getInstance(): AgentCoordinator {
    if (!AgentCoordinator.instance) {
      AgentCoordinator.instance = new AgentCoordinator();
    }
    return AgentCoordinator.instance;
  }

  private setupEventListeners(): void {
    // Listen for agent status changes
    eventBus.subscribe(
      EventType.AGENT_READY,
      async (event) => {
        const agentEvent = event as AgentEvent;
        this.updateAgentStatus(agentEvent.data.agentId, 'idle');
      }
    );

    eventBus.subscribe(
      EventType.AGENT_BUSY,
      async (event) => {
        const agentEvent = event as AgentEvent;
        this.updateAgentStatus(agentEvent.data.agentId, 'busy');
      }
    );

    eventBus.subscribe(
      EventType.AGENT_ERROR,
      async (event) => {
        const agentEvent = event as AgentEvent;
        this.updateAgentStatus(agentEvent.data.agentId, 'error');
      }
    );
  }

  /**
   * Register a new sub-agent
   */
  registerAgent(name: string, capabilities: string[]): string {
    const id = uuidv4();
    const agent: SubAgent = {
      id,
      name,
      status: 'idle',
      capabilities,
      lastActive: Date.now()
    };

    this.agents.set(id, agent);
    
    logger.info('AgentCoordinator', `New agent registered: ${name}`, { agent });

    // Publish agent initialized event
    eventBus.publish({
      id: uuidv4(),
      type: EventType.AGENT_INITIALIZED,
      timestamp: Date.now(),
      source: 'AgentCoordinator',
      data: {
        agentId: id,
        status: 'idle',
        metadata: {
          name,
          capabilities
        }
      }
    });

    return id;
  }

  /**
   * Update an agent's status
   */
  private updateAgentStatus(agentId: string, status: 'idle' | 'busy' | 'error'): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastActive = Date.now();
      this.agents.set(agentId, agent);
      
      logger.debug('AgentCoordinator', `Agent status updated: ${agent.name}`, {
        agentId,
        status
      });
    }
  }

  /**
   * Find available agents with specific capabilities
   */
  findAvailableAgents(requiredCapabilities: string[]): SubAgent[] {
    return Array.from(this.agents.values()).filter(agent => 
      agent.status === 'idle' &&
      requiredCapabilities.every(cap => agent.capabilities.includes(cap))
    );
  }

  /**
   * Get all registered agents
   */
  getAgents(): SubAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Remove an agent
   */
  removeAgent(agentId: string): boolean {
    const removed = this.agents.delete(agentId);
    if (removed) {
      logger.info('AgentCoordinator', `Agent removed: ${agentId}`);
    }
    return removed;
  }

  /**
   * Set maximum number of concurrent tasks
   */
  setMaxConcurrentTasks(max: number): void {
    this.maxConcurrentTasks = max;
    logger.info('AgentCoordinator', `Max concurrent tasks set to: ${max}`);
  }

  /**
   * Get number of currently busy agents
   */
  getBusyAgentCount(): number {
    return Array.from(this.agents.values()).filter(
      agent => agent.status === 'busy'
    ).length;
  }

  /**
   * Check if system can handle more tasks
   */
  canHandleMoreTasks(): boolean {
    return this.getBusyAgentCount() < this.maxConcurrentTasks;
  }
}

// Export singleton instance
export const agentCoordinator = AgentCoordinator.getInstance(); 