
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
