
import React from 'react';
import { addWidget, createIcon } from '@/utils/widgetHelpers';
import { registerWidget, WidgetAPI } from '@/lib/widgetAPI';

/**
 * This is an example file showing how to create your own custom widget
 * 
 * You can copy this pattern to create your own widgets!
 */

// 1. Create a custom icon for your widget
const weatherIcon = createIcon('W', '#2196F3'); // 'W' for Weather, with blue background

// 2. Create your widget logic
const weatherWidgetLogic: WidgetAPI = {
  init() {
    console.log('Weather widget initialized');
  },
  
  getState() {
    return {
      temperature: 72,
      condition: 'Sunny',
      lastUpdated: new Date().toLocaleTimeString()
    };
  },
  
  setState(newState) {
    // In a real widget, you would update your state here
    console.log('Setting new state:', newState);
  },
  
  trigger(action, payload) {
    console.log(`Weather widget action: ${action}`, payload);
    // In a real widget, you would handle actions here
    // Now we return true to indicate the action was handled
    return true;
  }
};

// 3. Register your widget with the system
registerWidget('Weather', weatherWidgetLogic);

// 4. Add your widget to the dashboard
// This makes it available in the dashboard's widget system
addWidget('Weather', 'Weather Widget', 'Check the current weather in your area.');

// 5. Create your custom widget component if you need more advanced functionality
const WeatherWidget = () => {
  const state = weatherWidgetLogic.getState();
  
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Current Weather</h3>
      <p>{state.condition}, {state.temperature}°F</p>
      <p className="text-sm text-gray-600 mt-2">Last updated: {state.lastUpdated}</p>
    </div>
  );
};

export default WeatherWidget;

/**
 * How to use:
 * 
 * 1. Create a file like this for your own widget
 * 2. Define your widget logic using the WidgetAPI interface
 * 3. Register your widget with the system
 * 4. Add your widget to the dashboard
 * 5. Create a UI component for your widget (optional)
 * 
 * The widget will automatically be available in the dashboard!
 */
