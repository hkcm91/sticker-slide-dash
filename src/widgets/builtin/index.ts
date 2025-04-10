
import { initializeWeatherWidget } from './WeatherWidget';
import { initializeStockWidget } from './StockWidget';
import { initializeDebuggingWidget } from '../DebuggingWidget';

/**
 * Initialize all built-in widgets
 */
export const initializeWidgets = () => {
  console.log('Initializing built-in widgets...');
  
  // Initialize the basic widgets
  initializeWeatherWidget();
  initializeStockWidget();
  
  // Initialize the debugging widget
  initializeDebuggingWidget();
};
