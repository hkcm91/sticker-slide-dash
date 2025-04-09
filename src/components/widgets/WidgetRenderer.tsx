
import React, { useState, useRef } from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './PomodoroWidget';
import IframeWidget from './IframeWidget';
import GenericWidget from './GenericWidget';
import WeatherWidget from './WeatherWidget';
import StockWidget from './StockWidget';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { validateLottieAnimation } from '@/utils/lottieUtils';
import { Code, FileJson, ShieldAlert, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ sticker, widgetData, className }) => {
  const [lottieError, setLottieError] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  
  const hasLottieAnimation = sticker.animationType === 'lottie' && sticker.animation;
  const hasCustomData = sticker.widgetData !== undefined;
  const isAdvancedWidget = sticker.widgetConfig !== undefined;
  
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
        <div className="widget-header p-2 border-b border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{widgetData.title}</h3>
            
            {isAdvancedWidget && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-purple-50 border-purple-200 text-purple-700">Advanced</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">This is an advanced widget with extended capabilities</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="flex gap-1">
            {sticker.permissions?.includes('storage') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4">
                      <Database className="h-3 w-3 text-blue-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Storage access</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {sticker.permissions?.includes('network') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4">
                      <ShieldAlert className="h-3 w-3 text-orange-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Network access</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <IframeWidget 
          widgetId={sticker.widgetType} 
          onError={(error) => setWidgetError(error)}
        />
        
        {widgetError && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border-t border-red-200">
            Error: {widgetError}
          </div>
        )}
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
  
  // Handle widgets with custom JSON data
  if (hasCustomData) {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">{widgetData.title || sticker.name}</h3>
          <FileJson className="h-4 w-4 text-blue-500" />
        </div>
        
        <div className="bg-black/10 p-3 rounded overflow-auto max-h-[200px]">
          <pre className="text-xs font-mono">
            {JSON.stringify(sticker.widgetData, null, 2)}
          </pre>
        </div>
        
        <p className="text-sm mt-3 text-muted-foreground">
          {widgetData.content || "Custom data widget"}
        </p>
      </div>
    );
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
