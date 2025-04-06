
import React from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './PomodoroWidget';
import IframeWidget from './IframeWidget';
import GenericWidget from './GenericWidget';

interface WidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ sticker, widgetData, className }) => {
  // Handle built-in widget types
  if (sticker.widgetType === 'Pomodoro') {
    return (
      <div className={`bg-background rounded-lg overflow-hidden shadow-md ${className}`}>
        <PomodoroWidgetUI widgetName="Pomodoro" />
      </div>
    );
  }
  
  // Handle iframe-based widgets (ZIP packages)
  if (sticker.packageUrl) {
    return (
      <div className={`bg-background rounded-lg overflow-hidden shadow-md ${className}`} style={{ height: '300px', width: '100%', minWidth: '300px' }}>
        <IframeWidget widgetId={sticker.widgetType} />
      </div>
    );
  }
  
  // Fallback for other widget types
  return (
    <GenericWidget 
      title={widgetData.title} 
      content={widgetData.content} 
      className={`shadow-md ${className}`}
    />
  );
};

export default WidgetRenderer;
