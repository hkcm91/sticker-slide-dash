
import React, { useRef } from 'react';
import useWidgetIframe from '@/hooks/useWidgetIframe';

interface IframeWidgetProps {
  widgetId: string;
  height?: number | string;
  width?: number | string;
}

const IframeWidget: React.FC<IframeWidgetProps> = ({ 
  widgetId,
  height = '100%',
  width = '100%'
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isLoaded } = useWidgetIframe({
    widgetId,
    iframeRef
  });

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="animate-pulse text-sm text-muted-foreground">Loading widget...</div>
        </div>
      )}
      <iframe 
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0"
        title={`Widget ${widgetId}`}
        style={{ 
          height, 
          width,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};

export default IframeWidget;
