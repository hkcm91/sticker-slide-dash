
import React from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from '../PomodoroWidget';
import WeatherWidget from '../WeatherWidget';
import StockWidget from '../StockWidget';
import EventLogWidget from '../EventLogWidget';

interface BuiltinWidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
}

const BuiltinWidgetRenderer: React.FC<BuiltinWidgetRendererProps> = ({ 
  sticker, 
  className 
}) => {
  // Handle built-in widgets
  if (sticker.widgetType === 'Pomodoro') {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
        <PomodoroWidgetUI widgetName="Pomodoro" />
      </div>
    );
  }
  
  if (sticker.widgetType === 'WeatherWidget') {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
        <WeatherWidget widgetName="WeatherWidget" />
      </div>
    );
  }
  
  if (sticker.widgetType === 'StockWidget') {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
        <StockWidget widgetName="StockWidget" />
      </div>
    );
  }
  
  if (sticker.widgetType === 'EventLog') {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
        <EventLogWidget maxEvents={20} />
      </div>
    );
  }
  
  return null;
};

export default BuiltinWidgetRenderer;
