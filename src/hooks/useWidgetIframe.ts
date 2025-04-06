
import { useEffect, useRef, useState } from 'react';
import { getWidgetHtml, getWidgetState, updateWidgetState } from '@/utils/widgetMaster';

interface UseWidgetIframeProps {
  widgetId: string | undefined;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export const useWidgetIframe = ({ widgetId, iframeRef }: UseWidgetIframeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgetState, setWidgetState] = useState<any>({});
  const messageHandlerRef = useRef<any>(null);
  
  // Initialize the iframe with the widget's HTML content
  useEffect(() => {
    if (!widgetId || !iframeRef.current) return;
    
    const loadWidgetContent = async () => {
      try {
        // Get the HTML content from storage
        const html = await getWidgetHtml(widgetId);
        
        if (!html || !iframeRef.current) {
          console.error('Failed to load widget content or iframe is not available');
          return;
        }
        
        // Set the content into the iframe
        iframeRef.current.srcdoc = html;
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading widget iframe content:', error);
      }
    };
    
    loadWidgetContent();
    
    return () => {
      setIsLoaded(false);
    };
  }, [widgetId, iframeRef]);
  
  // Set up the message passing between the main app and the iframe
  useEffect(() => {
    if (!widgetId || !iframeRef.current || !isLoaded) return;
    
    const sendInitialState = async () => {
      // Get the current state from storage
      const state = await getWidgetState(widgetId);
      setWidgetState(state);
      
      // Wait for iframe to be fully loaded
      if (iframeRef.current?.contentWindow) {
        // Send the initial state to the iframe
        iframeRef.current.contentWindow.postMessage({
          type: 'INIT_STATE',
          payload: state
        }, '*');
      }
    };
    
    // Set up message event listener for communication from the iframe
    const handleMessage = async (event: MessageEvent) => {
      // Make sure the message is from our iframe
      if (event.source !== iframeRef.current?.contentWindow) return;
      
      try {
        const { type, payload } = event.data;
        
        if (type === 'UPDATE_STATE') {
          // Save the new state
          await updateWidgetState(widgetId, payload);
          
          // Update our local state
          setWidgetState(payload);
        } else if (type === 'GET_STATE') {
          const currentState = await getWidgetState(widgetId);
          
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'CURRENT_STATE',
              payload: currentState
            }, '*');
          }
        }
      } catch (error) {
        console.error('Error handling iframe message:', error);
      }
    };
    
    // Save the handler so we can remove it later
    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage);
    
    // Send initial state once iframe is loaded
    iframeRef.current.onload = () => {
      sendInitialState();
    };
    
    return () => {
      // Clean up the event listener
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
      }
    };
  }, [widgetId, iframeRef, isLoaded]);
  
  return {
    isLoaded,
    widgetState
  };
};

export default useWidgetIframe;
