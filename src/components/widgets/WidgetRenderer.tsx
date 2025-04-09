
import React from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './PomodoroWidget';
import IframeWidget from './IframeWidget';
import GenericWidget from './GenericWidget';
import Lottie from 'lottie-react';

interface WidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ sticker, widgetData, className }) => {
  // Check if widget has a Lottie animation to display
  const hasLottieAnimation = sticker.animationType === 'lottie' && sticker.animation;
  
  // Handle built-in widget types
  if (sticker.widgetType === 'Pomodoro') {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
        <PomodoroWidgetUI widgetName="Pomodoro" />
      </div>
    );
  }
  
  // Handle iframe-based widgets (ZIP packages)
  if (sticker.packageUrl) {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`} style={{ height: '300px', width: '100%', minWidth: '300px' }}>
        <IframeWidget widgetId={sticker.widgetType} />
      </div>
    );
  }
  
  // Handle widgets with lottie animations
  if (hasLottieAnimation) {
    let lottieData = null;
    try {
      if (typeof sticker.animation === 'string') {
        // Check if it's a valid JSON string
        if (sticker.animation.trim().startsWith('{')) {
          try {
            const parsedData = JSON.parse(sticker.animation);
            // Validate that the parsed data has required Lottie properties
            if (parsedData && typeof parsedData === 'object') {
              lottieData = parsedData;
            }
          } catch (e) {
            console.error('Failed to parse Lottie animation JSON:', e);
          }
        } else {
          // It's a URL or other string format
          lottieData = sticker.animation;
        }
      } else if (sticker.animation && typeof sticker.animation === 'object') {
        // It's already an object
        lottieData = sticker.animation;
      }
    } catch (e) {
      console.error('Failed to parse Lottie animation:', e);
      lottieData = null;
    }
    
    if (lottieData) {
      return (
        <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md p-4 ${className}`}>
          <h3 className="text-md font-semibold mb-2">{widgetData.title}</h3>
          <div className="lottie-container" style={{ width: '100%', height: '200px' }}>
            <Lottie animationData={lottieData} loop={true} />
          </div>
          <p className="text-sm mt-2 text-muted-foreground">{widgetData.content}</p>
        </div>
      );
    }
  }
  
  // Fallback for other widget types
  return (
    <GenericWidget 
      title={widgetData.title} 
      content={widgetData.content} 
      className={`shadow-md backdrop-blur-md ${className}`}
    />
  );
};

export default WidgetRenderer;
