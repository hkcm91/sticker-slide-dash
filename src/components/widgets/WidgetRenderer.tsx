
import React from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import BuiltinWidgetRenderer from './renderers/BuiltinWidgetRenderer';
import IframeWidgetRenderer from './renderers/IframeWidgetRenderer';
import BasicWidgetRenderer from './renderers/BasicWidgetRenderer';
import DebuggingRenderer from './renderers/builtin/DebuggingRenderer';

interface WidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
  hideHeader?: boolean;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ 
  sticker, 
  widgetData, 
  className,
  hideHeader = false
}) => {
  // Handle the debugging widget specifically
  if (sticker.widgetType === 'DebuggingWidget') {
    return (
      <DebuggingRenderer
        className={className}
        widgetId={sticker.id}
      />
    );
  }
  
  // Handle built-in widgets
  if (sticker.widgetType === 'Pomodoro' || 
      sticker.widgetType === 'WeatherWidget' || 
      sticker.widgetType === 'StockWidget') {
    return (
      <BuiltinWidgetRenderer 
        sticker={sticker} 
        widgetData={widgetData} 
        className={className}
      />
    );
  }
  
  // Handle iframe-based widgets (for uploaded widget packages)
  if (sticker.packageUrl) {
    return (
      <IframeWidgetRenderer 
        sticker={sticker} 
        widgetData={widgetData} 
        className={className}
        hideHeader={hideHeader}
      />
    );
  }
  
  // Handle basic widgets (lottie animations, custom JSON data, or generic fallback)
  return (
    <BasicWidgetRenderer 
      sticker={sticker} 
      widgetData={widgetData} 
      className={className}
      hideHeader={hideHeader}
    />
  );
};

export default WidgetRenderer;
