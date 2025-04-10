
/**
 * Widget Event Bus - Enables communication between widgets
 * 
 * This module provides a simple event bus that allows widgets to communicate with each other
 * without direct dependencies or tight coupling.
 */

export type WidgetEvent = {
  type: string;
  payload?: any;
  source?: string; // Optional source widget identifier
  timestamp?: number;
};

type EventCallback = (payload: any) => void;

class WidgetEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private history: WidgetEvent[] = [];
  private maxHistoryLength: number = 50;
  private debug: boolean = false;

  /**
   * Enable or disable debug mode
   */
  setDebug(enabled: boolean) {
    this.debug = enabled;
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugEnabled(): boolean {
    return this.debug;
  }

  /**
   * Emit an event to all listeners
   */
  emit(event: WidgetEvent) {
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Store in history
    this.history.unshift(event);
    if (this.history.length > this.maxHistoryLength) {
      this.history.pop();
    }

    // Log if debug mode is enabled
    if (this.debug) {
      console.log(`[WidgetEventBus] Emitting event: ${event.type}`, event);
    }

    // Notify listeners
    const listenersForEvent = this.listeners.get(event.type);
    if (listenersForEvent) {
      listenersForEvent.forEach(callback => {
        try {
          callback(event.payload);
        } catch (error) {
          console.error(`[WidgetEventBus] Error in event listener for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Register a listener for an event type
   * @returns A function to unsubscribe the listener
   */
  on(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const listenersForEvent = this.listeners.get(eventType)!;
    listenersForEvent.add(callback);

    if (this.debug) {
      console.log(`[WidgetEventBus] Registered listener for event: ${eventType}`);
    }

    // Return an unsubscribe function
    return () => {
      if (this.listeners.has(eventType)) {
        const listeners = this.listeners.get(eventType)!;
        listeners.delete(callback);
        
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
        
        if (this.debug) {
          console.log(`[WidgetEventBus] Unregistered listener for event: ${eventType}`);
        }
      }
    };
  }

  /**
   * Get the event history
   */
  getHistory(): WidgetEvent[] {
    return [...this.history];
  }

  /**
   * Clear the event history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Set the maximum history length
   */
  setMaxHistoryLength(length: number): void {
    this.maxHistoryLength = length;
    if (this.history.length > length) {
      this.history = this.history.slice(0, length);
    }
  }
}

// Create a singleton instance
export const widgetEventBus = new WidgetEventBus();

// Export the class for testing or advanced use cases
export default WidgetEventBus;
