
import React, { useState, useEffect } from 'react';
import { registerWidgetModule } from '@/lib/widgetSystem';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

// Weather widget state
interface WeatherState {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  lastUpdated: string;
}

// Initial state
const initialState: WeatherState = {
  location: 'New York',
  temperature: 72,
  condition: 'sunny',
  lastUpdated: new Date().toISOString()
};

// Weather widget actions
const weatherActions = {
  updateLocation: (state: WeatherState, payload: string) => {
    return { 
      ...state, 
      location: payload,
      lastUpdated: new Date().toISOString()
    };
  },
  
  refreshWeather: (state: WeatherState) => {
    // In a real widget, this would fetch real weather data
    const conditions: Array<'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy'> = 
      ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 40) + 50; // 50-90°F
    
    return {
      ...state,
      temperature: randomTemp,
      condition: randomCondition,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Weather widget UI component
export const WeatherWidgetUI: React.FC<{ widgetState: WeatherState }> = ({ widgetState }) => {
  const getWeatherIcon = () => {
    switch (widgetState.condition) {
      case 'sunny': return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-12 w-12 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-12 w-12 text-blue-500" />;
      case 'snowy': return <CloudSnow className="h-12 w-12 text-blue-200" />;
      case 'stormy': return <CloudLightning className="h-12 w-12 text-purple-500" />;
    }
  };

  return (
    <div className="p-4 rounded-lg bg-white/90 backdrop-blur-sm shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{widgetState.location}</h3>
        {getWeatherIcon()}
      </div>
      
      <div className="text-3xl font-bold mb-2">
        {widgetState.temperature}°F
      </div>
      
      <div className="text-sm text-gray-500">
        {widgetState.condition.charAt(0).toUpperCase() + widgetState.condition.slice(1)}
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        Last updated: {new Date(widgetState.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

// Create and register the Weather widget
const weatherWidgetIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg>');

export const weatherWidget = registerWidgetModule({
  name: 'WeatherWidget',
  displayName: 'Weather',
  description: 'Check the current weather conditions',
  category: 'Utilities',
  version: '1.0.0',
  author: 'Stickers App',
  icon: weatherWidgetIcon,
  isPremium: false,
  state: initialState,
  actions: weatherActions,
});

export default weatherWidget;
