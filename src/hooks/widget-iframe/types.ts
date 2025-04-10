
/**
 * Types for the widget iframe communication system
 */

export interface WidgetIframeState {
  isLoaded: boolean;
  isWidgetReady: boolean;
  widgetState: any;
  error: string | null;
  widgetConfig: any;
  widgetPermissions: string[];
}

export interface UseWidgetIframeProps {
  widgetId: string | undefined;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export interface WidgetMessage {
  type: string;
  payload: any;
}
