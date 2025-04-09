
import React, { useState } from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './PomodoroWidget';
import IframeWidget from './IframeWidget';
import GenericWidget from './GenericWidget';
import Lottie from 'lottie-react';
import { AlertTriangle } from 'lucide-react';

interface WidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
}

// Define an interface for Lottie animation data
interface LottieAnimationData {
  v: string | number;
  layers: any[];
  [key: string]: any;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ sticker, widgetData, className }) => {
  const [lottieError, setLottieError] = useState(false);
  
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
  if (hasLottieAnimation && !lottieError) {
    let lottieData: LottieAnimationData | null = null;
    let isValidLottie = false;
    
    try {
      if (typeof sticker.animation === 'string') {
        // Check if it's a valid JSON string
        if (sticker.animation.trim().startsWith('{')) {
          try {
            const parsedData = JSON.parse(sticker.animation);
            // Validate that the parsed data has required Lottie properties
            if (parsedData && typeof parsedData === 'object' && 
                'v' in parsedData && // Version
                'layers' in parsedData && // Layers
                Array.isArray(parsedData.layers) && 
                parsedData.layers.length > 0) { // Make sure layers array is not empty
              lottieData = parsedData;
              isValidLottie = true;
            } else {
              console.error('Invalid Lottie animation data structure, missing required properties');
              isValidLottie = false;
            }
          } catch (e) {
            console.error('Failed to parse Lottie animation JSON:', e);
            isValidLottie = false;
          }
        } else if (sticker.animation.trim().startsWith('http')) {
          // It's a URL, we'll need to return a fallback until we can implement proper URL fetching
          console.log('Lottie animation URL detected, using fallback');
          isValidLottie = false;
        } else {
          console.error('Invalid Lottie animation format');
          isValidLottie = false;
        }
      } else if (sticker.animation && typeof sticker.animation === 'object' &&
                'v' in sticker.animation && 
                'layers' in sticker.animation &&
                Array.isArray(sticker.animation.layers) &&
                sticker.animation.layers.length > 0) {
        // It's already an object, validate basic Lottie structure with non-empty layers
        lottieData = sticker.animation as LottieAnimationData;
        isValidLottie = true;
      } else {
        console.error('Invalid Lottie animation object structure');
        isValidLottie = false;
      }
    } catch (e) {
      console.error('Failed to process Lottie animation:', e);
      lottieData = null;
      isValidLottie = false;
    }
    
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
              lottieRef={(ref) => {
                if (ref) {
                  ref.addEventListener('error', () => {
                    console.error("Lottie animation error event");
                    setLottieError(true);
                  });
                }
              }}
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
  
  // Fallback for other widget types or when Lottie fails
  return (
    <GenericWidget 
      title={widgetData.title} 
      content={widgetData.content} 
      className={`shadow-md backdrop-blur-md ${className}`}
    />
  );
};

export default WidgetRenderer;
