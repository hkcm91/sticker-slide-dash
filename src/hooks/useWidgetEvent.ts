
import React, { useEffect, useState, DependencyList } from 'react';
import { widgetEventBus, WidgetEvent } from '@/lib/widgetEventBus';

/**
 * Hook for subscribing to widget events
 * 
 * @param eventType - The event type to listen for
 * @param callback - The callback to be called when the event is emitted
 * @param deps - Dependencies array for the effect (similar to useEffect)
 */
export function useWidgetEvent(
  eventType: string, 
  callback: (payload: any) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    const unsubscribe = widgetEventBus.on(eventType, callback);
    
    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, ...deps]);
}

/**
 * Hook that returns a function to emit widget events
 * 
 * @param sourceId - Optional source identifier for the widget
 * @returns A function to emit events
 */
export function useEmitWidgetEvent(sourceId?: string) {
  return (type: string, payload?: any) => {
    widgetEventBus.emit({
      type,
      payload,
      source: sourceId,
      timestamp: Date.now()
    });
  };
}

/**
 * Hook that returns the current event history
 */
export function useWidgetEventHistory() {
  const [history, setHistory] = useState(widgetEventBus.getHistory());
  
  useEffect(() => {
    // Update history when new events are emitted
    const updateHistory = () => {
      setHistory(widgetEventBus.getHistory());
    };
    
    const unsubscribe = widgetEventBus.on('*', updateHistory);
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  return history;
}
