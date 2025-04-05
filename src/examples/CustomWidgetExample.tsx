
import React from 'react';
import { addWidget, createIcon } from '@/utils/widgetHelpers';

/**
 * This is an example file showing how to create your own custom widget
 * 
 * You can copy this pattern to create your own widgets!
 */

// 1. Create a custom icon for your widget
const weatherIcon = createIcon('W', '#2196F3'); // 'W' for Weather, with blue background

// 2. Add your widget to the dashboard
// This makes it available in the dashboard's widget system
addWidget('Weather', 'Weather Widget', 'Check the current weather in your area.');

// 3. Create your custom widget component if you need more advanced functionality
const WeatherWidget = () => {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Current Weather</h3>
      <p>Sunny, 72°F</p>
      <p className="text-sm text-gray-600 mt-2">Last updated: just now</p>
    </div>
  );
};

export default WeatherWidget;

/**
 * How to use:
 * 
 * 1. Create a file like this for your own widget
 * 2. Customize the icon, name, title, and content
 * 3. The widget will automatically be available in the dashboard
 * 
 * That's it! No need to modify any other files.
 */
