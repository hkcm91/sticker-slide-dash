
export interface WidgetState {
  [key: string]: any;
}

export interface WidgetAPI {
  init(): void;
  getState(): WidgetState;
  setState(state: Partial<WidgetState>): void;
  trigger(action: string, payload?: any): boolean;
  
  // Advanced API methods for complex widgets
  getConfig?: () => {
    settings: Record<string, any>;
    permissions: string[];
    dependencies: string[];
    capabilities: string[];
  };
  
  updateConfig?: (config: Partial<{
    settings: Record<string, any>;
    permissions: string[];
    dependencies: string[];
    capabilities: string[];
  }>) => void;
  
  // Data operations for complex widgets
  fetchData?: (params?: any) => Promise<any>;
  saveData?: (data: any) => Promise<boolean>;
  
  // Event handling
  subscribe?: (event: string, callback: (data: any) => void) => void;
  unsubscribe?: (event: string) => void;
  publish?: (event: string, data: any) => void;
  
  // Helper methods can be added by specific widget implementations
  [key: string]: any;
}

// Registry to keep track of all available widgets
const widgetRegistry: Record<string, WidgetAPI> = {};

// Register a widget with the system
export const registerWidget = (name: string, widget: WidgetAPI): void => {
  widgetRegistry[name] = widget;
  console.log(`Widget '${name}' registered successfully!`);
};

// Get a widget by name
export const getWidget = (name: string): WidgetAPI | undefined => {
  return widgetRegistry[name];
};

// Get all registered widgets
export const getAllWidgets = (): Record<string, WidgetAPI> => {
  return { ...widgetRegistry };
};
