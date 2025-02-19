import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import type { Message, MessageType } from '../../core/types';
import { eventBus } from '../event-bus';
import type { EventType, MessageEvent } from '../event-bus';

export class MessageRouter {
  private static instance: MessageRouter;
  private routes: Map<string, (message: Message) => Promise<void>>;

  private constructor() {
    this.routes = new Map();
    this.setupEventListeners();
  }

  static getInstance(): MessageRouter {
    if (!MessageRouter.instance) {
      MessageRouter.instance = new MessageRouter();
    }
    return MessageRouter.instance;
  }

  private setupEventListeners(): void {
    eventBus.subscribe(
      EventType.MESSAGE_RECEIVED,
      async (event) => {
        const messageEvent = event as MessageEvent;
        await this.routeMessage(messageEvent.data.message);
      }
    );
  }

  /**
   * Register a route handler for a specific path
   */
  registerRoute(
    path: string,
    handler: (message: Message) => Promise<void>
  ): void {
    this.routes.set(path, handler);
    logger.debug('MessageRouter', `Route registered: ${path}`);
  }

  /**
   * Remove a route handler
   */
  removeRoute(path: string): boolean {
    const removed = this.routes.delete(path);
    if (removed) {
      logger.debug('MessageRouter', `Route removed: ${path}`);
    }
    return removed;
  }

  /**
   * Route a message to its handler
   */
  private async routeMessage(message: Message): Promise<void> {
    try {
      // Find matching route handler
      const handler = this.routes.get(message.type);
      
      if (!handler) {
        logger.warn('MessageRouter', `No handler found for message type: ${message.type}`);
        return;
      }

      // Process the message
      await handler(message);

      // Publish message processed event
      await eventBus.publish({
        id: uuidv4(),
        type: EventType.MESSAGE_PROCESSED,
        timestamp: Date.now(),
        source: 'MessageRouter',
        data: {
          message,
          metadata: {
            processedAt: Date.now()
          }
        }
      });

    } catch (error) {
      logger.error('MessageRouter', 'Error routing message', { error, message });
      
      // Publish error event
      await eventBus.publish({
        id: uuidv4(),
        type: EventType.SYSTEM_ERROR,
        timestamp: Date.now(),
        source: 'MessageRouter',
        data: {
          code: 'MESSAGE_ROUTING_ERROR',
          message: 'Error routing message',
          details: {
            error,
            message
          }
        }
      });
    }
  }

  /**
   * Send a message through the router
   */
  async sendMessage(message: Message): Promise<void> {
    await eventBus.publish({
      id: uuidv4(),
      type: EventType.MESSAGE_RECEIVED,
      timestamp: Date.now(),
      source: 'MessageRouter',
      data: {
        message,
        metadata: {
          receivedAt: Date.now()
        }
      }
    });
  }
}

// Export singleton instance
export const messageRouter = MessageRouter.getInstance(); 