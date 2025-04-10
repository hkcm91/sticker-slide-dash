
import { useState } from 'react';
import { useIframeLoader } from './useIframeLoader';
import { useWidgetMessageHandler } from './useWidgetMessageHandler';
import { UseWidgetIframeProps, WidgetIframeState } from './types';

/**
 * Hook for managing iframe-based widgets with messaging capabilities
 */
export const useWidgetIframe = ({ widgetId, iframeRef }: UseWidgetIframeProps): WidgetIframeState => {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  
  // Load the iframe HTML content
  const { 
    isLoaded, 
    error: loaderError,
    setError 
  } = useIframeLoader({ 
    widgetId, 
    iframeRef 
  });
  
  // Set up message communication
  const {
    widgetState,
    widgetConfig,
    widgetPermissions,
    error: messageError
  } = useWidgetMessageHandler({
    widgetId,
    iframeRef,
    isLoaded,
    setIsWidgetReady
  });
  
  // Combine errors from both hooks
  const error = loaderError || messageError;
  
  return {
    isLoaded: isLoaded && isWidgetReady,
    isWidgetReady,
    widgetState,
    error,
    widgetConfig,
    widgetPermissions
  };
};

export default useWidgetIframe;
export * from './types';
