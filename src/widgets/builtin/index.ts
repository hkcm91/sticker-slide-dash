
import weatherWidget from './WeatherWidget';
import stockWidget from './StockWidget';
import { initializeDebuggingWidget } from '../DebuggingWidget';

// Export the built-in widgets array
export const builtInWidgets = [weatherWidget, stockWidget];

/**
 * Initialize all built-in widgets
 */
export const initializeWidgets = () => {
  console.log('Initializing built-in widgets...');
  
  // Initialize the debugging widget
  initializeDebuggingWidget();
  
  // No need to initialize weather and stock widgets separately
  // as they are registered during import
};

// Export a new function to create a debugging widget sticker
export const createDebuggingWidgetSticker = () => {
  // Call the initialization function to ensure it's registered
  initializeDebuggingWidget();
  
  // Return a sticker configuration
  return {
    name: 'DebuggingWidget',
    displayName: 'Debugging Tools',
    description: 'Monitor system events and debug application state',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzE0YjhhNiIgLz48cGF0aCBkPSJNMTggOGwtMiAyLTQtNC00IDRMNiA4IDEwIDQiIHN0cm9rZT0id2hpdGUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTggMTZsLTItMi00IDQtNC00LTIgMkwxMCAyMCI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIHN0cm9rZT0id2hpdGUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+',
    category: 'utility',
    widgetType: 'DebuggingWidget'
  };
};
