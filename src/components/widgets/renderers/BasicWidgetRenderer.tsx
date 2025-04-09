
import React from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import GenericWidget from '../GenericWidget';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { validateLottieAnimation } from '@/utils/lottieUtils';
import { FileJson } from 'lucide-react';

interface BasicWidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
  hideHeader?: boolean;
}

const BasicWidgetRenderer: React.FC<BasicWidgetRendererProps> = ({ 
  sticker, 
  widgetData, 
  className,
  hideHeader = false
}) => {
  const [lottieError, setLottieError] = React.useState(false);
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);
  
  const hasLottieAnimation = sticker.animationType === 'lottie' && sticker.animation;
  const hasCustomData = sticker.widgetData !== undefined;
  
  // Handle Lottie animation widgets
  if (hasLottieAnimation && !lottieError) {
    const { isValid: isValidLottie, data: lottieData } = validateLottieAnimation(sticker.animation);
    
    if (isValidLottie && lottieData) {
      return (
        <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md p-4 ${className}`}>
          {!hideHeader && (
            <h3 className="text-md font-semibold mb-2">{widgetData.title}</h3>
          )}
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
          {!hideHeader && (
            <p className="text-sm mt-2 text-muted-foreground">{widgetData.content}</p>
          )}
        </div>
      );
    }
  }
  
  // Handle widgets with custom JSON data
  if (hasCustomData) {
    return (
      <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md p-4 ${className}`}>
        {!hideHeader && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold">{widgetData.title || sticker.name}</h3>
            <FileJson className="h-4 w-4 text-blue-500" />
          </div>
        )}
        
        <div className="bg-black/10 p-3 rounded overflow-auto max-h-[200px]">
          <pre className="text-xs font-mono">
            {JSON.stringify(sticker.widgetData, null, 2)}
          </pre>
        </div>
        
        {!hideHeader && (
          <p className="text-sm mt-3 text-muted-foreground">
            {widgetData.content || "Custom data widget"}
          </p>
        )}
      </div>
    );
  }
  
  // Fallback to generic widget
  return (
    <GenericWidget 
      title={hideHeader ? undefined : widgetData.title} 
      content={hideHeader ? undefined : widgetData.content} 
      className={`shadow-md backdrop-blur-md ${className}`}
    />
  );
};

export default BasicWidgetRenderer;
