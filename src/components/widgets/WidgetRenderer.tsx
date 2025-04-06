
import React from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './PomodoroWidget';
import IframeWidget from './IframeWidget';
import GenericWidget from './GenericWidget';

interface WidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ sticker, widgetData }) => {
  // Handle built-in widget types
  if (sticker.widgetType === 'Pomodoro') {
    return (
      <div className="bg-background rounded-lg overflow-hidden">
        <PomodoroWidgetUI widgetName="Pomodoro" />
      </div>
    );
  }
  
  // Handle iframe-based widgets (ZIP packages)
  if (sticker.packageUrl) {
    return (
      <div className="bg-background rounded-lg overflow-hidden" style={{ height: '300px', width: '100%' }}>
        <IframeWidget widgetId={sticker.widgetType} />
      </div>
    );
  }
  
  // Fallback for other widget types
  return (
    <GenericWidget 
      title={widgetData.title} 
      content={widgetData.content} 
    />
  );
};

export default WidgetRenderer;
