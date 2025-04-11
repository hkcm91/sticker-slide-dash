
import { registerWidgetData, getWidgetData } from '@/utils/widgetRegistry';
import { WidgetData } from '@/types/stickers';

// Initialize widget data map with default widgets
export const initializeWidgetDataMap = () => {
  // Register basic widgets
  registerWidgetData('Heart', 'Heart Widget', 'Track your favorites and loved items.');
  registerWidgetData('Home', 'Home Widget', 'Control your smart home devices.');
  registerWidgetData('Coffee', 'Coffee Widget', 'Find the best coffee shops nearby.');
  registerWidgetData('Sun', 'Sun Widget', 'Check today\'s sunrise and sunset times.');
  registerWidgetData('Star', 'Star Widget', 'View your starred and favorite items.');
  registerWidgetData('Book', 'Book Widget', 'Access your reading list and book notes.');
  registerWidgetData('Pomodoro', 'Pomodoro Timer', 'A simple Pomodoro timer to help you stay focused.');
  registerWidgetData('ToDoList', 'To Do List', 'Keep track of your tasks and to-dos.');
  registerWidgetData('WeatherWidget', 'Weather', 'Check the current weather conditions for your location.');
  registerWidgetData('StockWidget', 'Stock Tracker', 'Monitor stock prices and market trends.');
};

export const addCustomWidget = (name: string, title: string, content: string) => {
  registerWidgetData(name, title, content);
};

// Add the missing function to get widget data by ID
export const getWidgetDataById = (widgetId: string): WidgetData | null => {
  return getWidgetData(widgetId);
};
