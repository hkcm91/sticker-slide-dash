
import React, { useState, useRef } from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './PomodoroWidget';
import IframeWidget from './IframeWidget';
import GenericWidget from './GenericWidget';
import WeatherWidget from './WeatherWidget';
import StockWidget from './StockWidget';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { validateLottieAnimation } from '@/utils/lottieUtils';

interface WidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ sticker, widgetData, className }) => {
  const [lottieError, setLottieError] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  
  const hasLottieAnimation = sticker.animationType === 'lottie' && sticker.animation;
  
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
  
  // Handle iframe-based widgets (for uploaded widget packages)
  if (sticker.packageUrl) {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`} style={{ height: '300px', width: '100%', minWidth: '300px' }}>
        <IframeWidget widgetId={sticker.widgetType} />
      </div>
    );
  }
  
  // Handle Lottie animation widgets
  if (hasLottieAnimation && !lottieError) {
    const { isValid: isValidLottie, data: lottieData } = validateLottieAnimation(sticker.animation);
    
    if (isValidLottie && lottieData) {
      return (
        <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md p-4 ${className}`}>
          <h3 className="text-md font-semibold mb-2">{widgetData.title}</h3>
          <div className="lottie-container relative" style={{ width: '100%', height: '200px' }}>
            <Lottie 
              animationData={lottieData} 
              loop={true}
              onError={(e) => {
                console.error("Lottie animation failed to render:", e);
                setLottieError(true);
              }}
              lottieRef={lottieRef}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice',
                progressiveLoad: true,
                hideOnTransparent: false,
              }}
            />
          </div>
          <p className="text-sm mt-2 text-muted-foreground">{widgetData.content}</p>
        </div>
      );
    }
  }
  
  // Fallback to generic widget
  return (
    <GenericWidget 
      title={widgetData.title} 
      content={widgetData.content} 
      className={`shadow-md backdrop-blur-md ${className}`}
    />
  );
};

export default WidgetRenderer;
