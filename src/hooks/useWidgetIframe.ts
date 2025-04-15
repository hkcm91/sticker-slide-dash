
import { useEffect, useRef, useState } from 'react';
import { getWidgetHtml, getWidgetState, updateWidgetState } from '@/utils/widgetMaster';

interface UseWidgetIframeProps {
  widgetId: string | undefined;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export const useWidgetIframe = ({ widgetId, iframeRef }: UseWidgetIframeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [widgetState, setWidgetState] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [widgetConfig, setWidgetConfig] = useState<any>(null);
  const [widgetPermissions, setWidgetPermissions] = useState<string[]>([]);
  const messageHandlerRef = useRef<any>(null);
  
  // Load the HTML content into the iframe
  useEffect(() => {
    setIsLoaded(false);
    setIsWidgetReady(false);
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
  
  // Set up the message communication between parent app and iframe
  useEffect(() => {
    if (!widgetId || !iframeRef.current || !isLoaded) {
      console.log(`[Parent] Message listener setup skipped for ${widgetId}`, { 
        widgetId, 
        iframeExists: !!iframeRef.current, 
        isLoaded 
      });
      return;
    }
    
    const currentIframe = iframeRef.current;
    
    const handleMessage = async (event: MessageEvent) => {
      try {
        // Make sure the message is from our iframe
        if (!currentIframe || event.source !== currentIframe.contentWindow) {
          return;
        }
        
        console.log(`[Parent] Received message from iframe for widget ${widgetId}:`, event.data);
        
        const { type, payload } = event.data;
        
        // Handle the WIDGET_READY message (handshake step 1)
        if (type === 'WIDGET_READY') {
          console.log(`[Parent] Received WIDGET_READY from widget ${widgetId}. Sending initial state.`);
          setIsWidgetReady(true);
          
          try {
            // Get the current state from storage
            const state = await getWidgetState(widgetId);
            console.log(`[Parent] Initial state fetched for widget ${widgetId}:`, state);
            
            setWidgetState(state || {});
            
            // Get widget configuration and permissions if available
            if (payload && payload.config) {
              setWidgetConfig(payload.config);
              setWidgetPermissions(payload.config.permissions || []);
            }
            
            // Send the initial state to the iframe
            if (currentIframe.contentWindow) {
              currentIframe.contentWindow.postMessage({
                type: 'INIT_STATE',
                payload: {
                  state: state || {},
                  config: widgetConfig,
                  permissions: widgetPermissions
                }
              }, '*');
              console.log(`[Parent] Sent INIT_STATE to widget ${widgetId}`);
            } else {
              console.error(`[Parent] Iframe contentWindow lost before sending INIT_STATE to ${widgetId}`);
            }
          } catch (error) {
            console.error(`[Parent] Error fetching/sending initial state for ${widgetId}:`, error);
            setWidgetState({});
          }
        }
        else if (type === 'UPDATE_STATE') {
          console.log(`[Parent] Updating state for widget ${widgetId} from iframe:`, payload);
          
          // Save the new state
          await updateWidgetState(widgetId, payload);
          
          // Update our local state
          setWidgetState(payload || {});
        }
        else if (type === 'GET_STATE') {
          console.log(`[Parent] Iframe requested current state for widget ${widgetId}`);
          
          const currentState = await getWidgetState(widgetId);
          setWidgetState(currentState || {});
          
          if (currentIframe.contentWindow) {
            console.log(`[Parent] Sending current state to iframe for widget ${widgetId}:`, currentState);
            
            currentIframe.contentWindow.postMessage({
              type: 'CURRENT_STATE',
              payload: currentState || {}
            }, '*');
          } else {
            console.error(`[Parent] Iframe contentWindow lost before sending CURRENT_STATE to ${widgetId}`);
          }
        }
        else if (type === 'UPDATE_CONFIG') {
          console.log(`[Parent] Updating config for widget ${widgetId}:`, payload);
          
          setWidgetConfig(payload || {});
        }
        else if (type === 'PERMISSION_REQUEST') {
          console.log(`[Parent] Widget ${widgetId} requesting permission:`, payload);
          
          // Here we would typically show a permission request dialog to the user
          // For this example, we'll auto-approve if it's a known permission
          const knownPermissions = ['storage', 'network', 'notifications'];
          const permission = payload.permission;
          
          if (knownPermissions.includes(permission)) {
            // Auto-approve known permissions
            const updatedPermissions = [...widgetPermissions, permission];
            setWidgetPermissions(updatedPermissions);
            
            // Notify the widget of permission granted
            if (currentIframe.contentWindow) {
              currentIframe.contentWindow.postMessage({
                type: 'PERMISSION_RESPONSE',
                payload: {
                  permission,
                  granted: true
                }
              }, '*');
            }
          } else {
            // Deny unknown permissions
            if (currentIframe.contentWindow) {
              currentIframe.contentWindow.postMessage({
                type: 'PERMISSION_RESPONSE',
                payload: {
                  permission,
                  granted: false,
                  reason: 'Unknown permission type'
                }
              }, '*');
            }
          }
        }
        else if (type === 'WIDGET_ERROR') {
          console.error(`[Parent] Widget ${widgetId} reported an error:`, payload);
          setError(payload.message || 'Widget error');
        }
      } catch (error) {
        console.error('[Parent] Error handling iframe message:', error);
      }
    };
    
    console.log(`[Parent] Setting up message listener for iframe widget ${widgetId}`);
    
    // Save the handler so we can remove it later
    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage);
    
    return () => {
      console.log(`[Parent] Cleaning up message listener for iframe widget ${widgetId}`);
      
      // Clean up the event listener
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
        messageHandlerRef.current = null;
      }
      
      setIsWidgetReady(false);
    };
  }, [widgetId, iframeRef, isLoaded, widgetConfig, widgetPermissions]);
  
  return {
    isLoaded: isLoaded && isWidgetReady,
    widgetState,
    error,
    widgetConfig,
    widgetPermissions
  };
};

export default useWidgetIframe;
