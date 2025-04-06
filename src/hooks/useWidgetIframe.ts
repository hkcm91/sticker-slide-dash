
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
        console.log(`Loading HTML content for widget ${widgetId}`);
        
        // Get the HTML content from storage
        const html = await getWidgetHtml(widgetId);
        
        if (!html || !iframeRef.current) {
          console.error('Failed to load widget content or iframe is not available', { 
            htmlExists: !!html, 
            iframeExists: !!iframeRef.current 
          });
          return;
        }
        
        console.log(`Setting HTML content to iframe for widget ${widgetId}`);
        console.log(`HTML length: ${html.length} characters`);
        
        // Debug the HTML content first few characters
        console.log(`HTML content preview: ${html.substring(0, 100)}...`);
        
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
      try {
        console.log(`Sending initial state to iframe for widget ${widgetId}`);
        
        // Get the current state from storage
        const state = await getWidgetState(widgetId);
        setWidgetState(state);
        
        console.log(`Initial state for iframe widget ${widgetId}:`, state);
        
        // Wait for iframe to be fully loaded
        if (iframeRef.current?.contentWindow) {
          console.log('Iframe contentWindow is available, sending INIT_STATE message');
          
          // Send the initial state to the iframe
          iframeRef.current.contentWindow.postMessage({
            type: 'INIT_STATE',
            payload: state
          }, '*');
        } else {
          console.error('Iframe contentWindow is not available, cannot send initial state');
        }
      } catch (error) {
        console.error('Error sending initial state to iframe:', error);
      }
    };
    
    // Set up message event listener for communication from the iframe
    const handleMessage = async (event: MessageEvent) => {
      try {
        // Make sure the message is from our iframe
        if (event.source !== iframeRef.current?.contentWindow) return;
        
        console.log(`Received message from iframe for widget ${widgetId}:`, event.data);
        
        const { type, payload } = event.data;
        
        if (type === 'UPDATE_STATE') {
          console.log(`Updating state for widget ${widgetId} from iframe:`, payload);
          
          // Save the new state
          await updateWidgetState(widgetId, payload);
          
          // Update our local state
          setWidgetState(payload);
        } else if (type === 'GET_STATE') {
          console.log(`Iframe requested current state for widget ${widgetId}`);
          
          const currentState = await getWidgetState(widgetId);
          
          if (iframeRef.current?.contentWindow) {
            console.log(`Sending current state to iframe for widget ${widgetId}:`, currentState);
            
            iframeRef.current.contentWindow.postMessage({
              type: 'CURRENT_STATE',
              payload: currentState
            }, '*');
          } else {
            console.error('Iframe contentWindow is not available, cannot send current state');
          }
        }
      } catch (error) {
        console.error('Error handling iframe message:', error);
      }
    };
    
    console.log(`Setting up message listener for iframe widget ${widgetId}`);
    
    // Save the handler so we can remove it later
    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage);
    
    // Send initial state once iframe is loaded
    iframeRef.current.onload = () => {
      console.log(`Iframe for widget ${widgetId} is now loaded, sending initial state`);
      sendInitialState();
    };
    
    return () => {
      console.log(`Cleaning up message listener for iframe widget ${widgetId}`);
      
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
