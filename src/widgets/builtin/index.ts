
import weatherWidget from './WeatherWidget';
import stockWidget from './StockWidget';

// Export all built-in widgets
export const builtInWidgets = [
  weatherWidget,
  stockWidget
];

// Initialize all built-in widgets
export const initializeWidgets = () => {
  console.log('Initializing built-in widgets...');
  builtInWidgets.forEach(widget => {
    if (widget.api) {
      widget.api.init();
    }
  });
};

export default builtInWidgets;
