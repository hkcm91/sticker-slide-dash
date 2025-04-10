
import { useState, useEffect } from 'react';
import { getWidgetHtml } from '@/utils/widgetMaster';
import { UseWidgetIframeProps } from './types';

/**
 * Hook for loading widget HTML content into the iframe
 */
export const useIframeLoader = ({ widgetId, iframeRef }: UseWidgetIframeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoaded(false);
    setError(null);
    
    if (!widgetId || !iframeRef.current) return;
    
    const loadWidgetContent = async () => {
      try {
        console.log(`[Parent] Loading HTML content for widget ${widgetId}`);
        
        // Get the HTML content from storage
        const html = await getWidgetHtml(widgetId);
        
        if (!html || !iframeRef.current) {
          console.error('[Parent] Failed to load widget content or iframe is not available', { 
            htmlExists: !!html, 
            iframeExists: !!iframeRef.current 
          });
          setError('Failed to load widget content');
          return;
        }
        
        console.log(`[Parent] HTML content for widget ${widgetId} retrieved (${html.length} bytes)`);
        
        // Set the content into the iframe
        iframeRef.current.srcdoc = html;
        setIsLoaded(true);
        console.log(`[Parent] Set srcdoc for iframe widget ${widgetId}. Waiting for WIDGET_READY signal.`);
      } catch (error) {
        console.error('[Parent] Error loading widget iframe content:', error);
        setError('Error loading widget content');
      }
    };
    
    loadWidgetContent();
  }, [widgetId, iframeRef]);
  
  return {
    isLoaded,
    error,
    setIsLoaded,
    setError
  };
};
