import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import type { Event, EventType, EventCallback, EventSubscription } from './types';

export class EventBus {
  private static instance: EventBus;
  private subscriptions: Map<EventType, EventSubscription[]>;
  private eventHistory: Event[];
  private readonly maxHistorySize: number;

  private constructor() {
    this.subscriptions = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 1000; // Keep last 1000 events
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to events of a specific type
   */
  subscribe(
    eventType: EventType,
    callback: EventCallback,
    filter?: (event: Event) => boolean
  ): string {
    const subscription: EventSubscription = {
      id: uuidv4(),
      eventType,
      callback,
      filter,
    };

    const existingSubscriptions = this.subscriptions.get(eventType) || [];
    this.subscriptions.set(eventType, [...existingSubscriptions, subscription]);

    logger.debug('EventBus', `New subscription added for ${eventType}`, {
      subscriptionId: subscription.id,
    });

    return subscription.id;
  }

  /**
   * Unsubscribe from events using the subscription ID
   */
  unsubscribe(subscriptionId: string): boolean {
    let removed = false;

    this.subscriptions.forEach((subs, eventType) => {
      const filteredSubs = subs.filter((sub) => sub.id !== subscriptionId);
      if (filteredSubs.length !== subs.length) {
        this.subscriptions.set(eventType, filteredSubs);
        removed = true;
        logger.debug('EventBus', `Subscription removed: ${subscriptionId}`);
      }
    });

    return removed;
  }

  /**
   * Publish an event to all subscribers
   */
  async publish(event: Event): Promise<void> {
    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    logger.debug('EventBus', `Publishing event: ${event.type}`, { event });

    const subscribers = this.subscriptions.get(event.type) || [];
    const promises = subscribers
      .filter((sub) => !sub.filter || sub.filter(event))
      .map(async (sub) => {
        try {
          await sub.callback(event);
        } catch (error) {
          logger.error('EventBus', `Error in subscriber callback: ${sub.id}`, {
            error,
            event,
          });
        }
      });

    await Promise.all(promises);
  }

  /**
   * Get event history with optional filtering
   */
  getHistory(
    options: {
      eventType?: EventType;
      source?: string;
      target?: string;
      limit?: number;
    } = {}
  ): Event[] {
    let filtered = this.eventHistory;

    if (options.eventType) {
      filtered = filtered.filter((event) => event.type === options.eventType);
    }

    if (options.source) {
      filtered = filtered.filter((event) => event.source === options.source);
    }

    if (options.target) {
      filtered = filtered.filter((event) => event.target === options.target);
    }

    const limit = options.limit || this.maxHistorySize;
    return filtered.slice(-limit);
  }

  /**
   * Clear all subscriptions and history
   */
  clear(): void {
    this.subscriptions.clear();
    this.eventHistory = [];
    logger.info('EventBus', 'Event bus cleared');
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();

// Re-export types
export * from './types'; 