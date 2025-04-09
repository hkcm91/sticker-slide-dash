
export interface Sticker {
  id: string;
  name: string;
  icon: string; // URL/data URL for static images
  animation?: string | object; // Lottie animation JSON string/object or URL
  animationType?: 'lottie' | 'gif'; // Type of animation
  position: { x: number; y: number };
  placed: boolean;
  docked?: boolean; // Added for dockable widgets
  size?: number;
  rotation?: number;
  widgetType?: string; // Maps to a registered widget name
  isCustom?: boolean; // Flag for user-uploaded stickers
  packageUrl?: string; // URL to widget package (for remote widgets)
  description?: string; // Description of the sticker
  widgetCode?: string; // Code for widget functionality
  widgetActions?: Record<string, (state: any, payload?: any) => any>; // Actions for the widget
  permanentDelete?: boolean; // Flag to indicate permanent deletion
  isPremium?: boolean; // Flag to indicate if this is a premium widget
  price?: number; // Price of the widget if it's premium
  purchasedOn?: string; // Date when the widget was purchased
  purchaseId?: string; // ID of the purchase transaction
  widgetData?: any; // Custom JSON data for the widget
  widgetConfig?: { // Added for complex widgets
    size?: {
      width: number;
      height: number;
      resizable?: boolean;
      minWidth?: number;
      minHeight?: number;
      maxWidth?: number;
      maxHeight?: number;
    };
    settings?: Record<string, any>;
    permissions?: string[];
    dependencies?: string[];
    capabilities?: string[];
  };
  permissions?: string[]; // Added for widget permissions
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
  permissions?: {
    apis?: Array<{
      path: string;
      methods: string[];
    }>;
    notifications?: boolean;
    storage?: boolean;
  };
  settings?: Record<string, any>;
}

export interface UploadedWidget {
  name: string;
  manifest: WidgetManifest;
  files: {
    [path: string]: string | Blob;
  };
  icon?: string;
  animation?: string | object; // Added Lottie animation support
  animationType?: 'lottie' | 'gif'; // Type of animation
}

export interface LottieAnimationData {
  v: string | number;
  layers: any[];
  [key: string]: any;
}
