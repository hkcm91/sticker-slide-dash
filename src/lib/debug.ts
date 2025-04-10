/**
 * Debug utility functions for the application
 */

import { widgetEventBus } from './widgetEventBus';

/**
 * Emit a debug event with the specified type and payload
 */
export const emitDebugEvent = (type: string, payload?: any) => {
  widgetEventBus.emit({
    type,
    payload,
    source: 'debug-util',
    timestamp: Date.now()
  });
};

/**
 * Capture a state snapshot for the debugging widget
 */
export const captureState = (name: string, data: any) => {
  if (typeof window !== 'undefined' && (window as any).captureDebugState) {
    (window as any).captureDebugState(name, data);
  }
};

/**
 * Enable or disable debug mode
 */
export const setDebugMode = (enabled: boolean) => {
  if (widgetEventBus.setDebug) {
    widgetEventBus.setDebug(enabled);
  }
  console.log(`[Debug] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
};

/**
 * Log an error with additional context
 */
export const logError = (message: string, error?: Error | unknown, context?: Record<string, any>) => {
  console.error(`[ERROR] ${message}`, error, context);
  
  // Emit event for debugging widget
  emitDebugEvent('error', { message, error: error instanceof Error ? error.message : String(error), context });
};

/**
 * Log a warning with additional context
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  console.warn(`[WARN] ${message}`, context);
  
  // Emit event for debugging widget
  emitDebugEvent('warning', { message, context });
};

/**
 * Log information with additional context
 */
export const logInfo = (message: string, context?: Record<string, any>) => {
  console.log(`[INFO] ${message}`, context);
  
  // Emit event for debugging widget
  emitDebugEvent('info', { message, context });
};

/**
 * Capture current sticker state
 */
export const captureStickersState = (stickers: any[]) => {
  captureState('stickers', stickers);
};

/**
 * Log sticker action with before/after state
 */
export const logStickerAction = (action: string, stickerId: string, before: any, after: any) => {
  console.log(`[Sticker] Action: ${action}, ID: ${stickerId}`);
  
  const isDebug = widgetEventBus.isDebugEnabled();
  if (isDebug) {
    console.log(`[Sticker] Before:`, before);
    console.log(`[Sticker] After:`, after);
  }
  
  // Emit event for debugging widget
  emitDebugEvent('sticker-action', { 
    action, 
    stickerId,
    before: isDebug ? before : undefined,
    after: isDebug ? after : undefined 
  });
};

// Make debug utilities available globally for console usage
if (typeof window !== 'undefined') {
  (window as any).debugUtils = {
    emitDebugEvent,
    captureState,
    setDebugMode,
    logError,
    logWarning,
    logInfo,
    captureStickersState
  };
}
