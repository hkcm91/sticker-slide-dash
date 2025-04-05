
export interface Sticker {
  id: string;
  name: string;
  icon: string; // URL/data URL for static images
  animation?: string; // Lottie animation JSON string or URL
  animationType?: 'lottie' | 'gif'; // Type of animation
  position: { x: number; y: number };
  placed: boolean;
  size?: number;
  rotation?: number;
  widgetType?: string; // Maps to a registered widget name
  isCustom?: boolean; // Flag for user-uploaded stickers
}

export interface WidgetData {
  title: string;
  content: string;
  component?: React.ComponentType<any>;
}

export interface WidgetManifest {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  icon: string;
  entry?: string;
  size?: {
    width: number;
    height: number;
    resizable?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}
