
import React, { useRef } from 'react';
import useWidgetIframe from '@/hooks/useWidgetIframe';

interface IframeWidgetProps {
  widgetId: string;
  height?: number | string;
  width?: number | string;
  className?: string;
  onError?: (error: string) => void;
}

const IframeWidget: React.FC<IframeWidgetProps> = ({ 
  widgetId,
  height = 300,
  width = '100%',
  className,
  onError
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isLoaded, error, widgetConfig } = useWidgetIframe({
    widgetId,
    iframeRef
  });

  // Forward error to parent component if needed
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="animate-pulse text-sm text-muted-foreground">Loading widget...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-sm text-red-500 p-4">
            <div className="font-semibold mb-1">Widget Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="w-full h-full border-0"
        title={`Widget ${widgetId}`}
        style={{ 
          height: height || (widgetConfig?.size?.height || 300), 
          width: width || (widgetConfig?.size?.width || '100%'),
          opacity: isLoaded && !error ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};

export default IframeWidget;
