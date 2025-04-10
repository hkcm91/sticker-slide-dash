
import React from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import { 
  PomodoroRenderer, 
  WeatherRenderer, 
  StockRenderer, 
  EventLogRenderer,
  DebuggingRenderer
} from './builtin';

interface BuiltinWidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
}

const BuiltinWidgetRenderer: React.FC<BuiltinWidgetRendererProps> = ({ 
  sticker, 
  className 
}) => {
  // Handle built-in widgets using type map pattern
  const widgetTypeMap: Record<string, React.ReactNode> = {
    'Pomodoro': <PomodoroRenderer className={className} />,
    'WeatherWidget': <WeatherRenderer className={className} />,
    'StockWidget': <StockRenderer className={className} />,
    'EventLog': <EventLogRenderer className={className} />,
    'DebuggingWidget': <DebuggingRenderer className={className} />
  };
  
  // Return the appropriate widget renderer based on widget type
  return widgetTypeMap[sticker.widgetType] || null;
};

export default BuiltinWidgetRenderer;
