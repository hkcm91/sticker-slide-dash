
import { v4 as uuidv4 } from 'uuid';
import { Sticker } from '@/types/stickers';
import { WidgetAPI, registerWidget } from '@/lib/widgetAPI';
import { registerWidgetData } from '@/utils/widgetRegistry';

// Interface for widget configuration
export interface WidgetConfig {
  id?: string;
  name: string;
  displayName: string;
  description: string;
  category?: string;
  version?: string;
  author?: string;
  icon: string;
  isPremium?: boolean;
  price?: number;
  state?: Record<string, any>;
  actions?: Record<string, (state: any, payload?: any) => any>;
  render?: (props: any) => JSX.Element;
  
  // Advanced configuration options
  dependencies?: string[];
  permissions?: string[];
  settings?: Record<string, any>;
  configSchema?: Record<string, any>;
  capabilities?: string[];
  dataSource?: {
    type: string;
    config: Record<string, any>;
  };
}

// Interface for a complete widget
export interface Widget extends WidgetConfig {
  id: string;
  api: WidgetAPI;
  sticker: Sticker;
}

// Registry of all available widgets
const widgetRegistry: Record<string, Widget> = {};

/**
 * Registers a widget in the system
 */
export function registerWidgetModule(config: WidgetConfig): Widget {
  const id = config.id || uuidv4();
  const name = config.name;
  
  // Create the widget API
  const widgetAPI: WidgetAPI = {
    init() {
      console.log(`Widget ${name} initialized`);
    },
    
    getState() {
      return { ...(config.state || {}) };
    },
    
    setState(newState) {
      if (widgetRegistry[id]) {
        widgetRegistry[id].state = { ...widgetRegistry[id].state, ...newState };
      }
    },
    
    trigger(action, payload) {
      if (config.actions && config.actions[action]) {
        const newState = config.actions[action](this.getState(), payload);
        this.setState(newState);
        return true;
      }
      return false;
    },
    
    // Add advanced API methods for more complex widgets
    getConfig() {
      return {
        settings: config.settings || {},
        permissions: config.permissions || [],
        dependencies: config.dependencies || [],
        capabilities: config.capabilities || []
      };
    },
    
    updateConfig(newConfig: Partial<{
      settings: Record<string, any>,
      permissions: string[],
      dependencies: string[],
      capabilities: string[]
    }>) {
      if (widgetRegistry[id]) {
        widgetRegistry[id].settings = { ...(widgetRegistry[id].settings || {}), ...(newConfig.settings || {}) };
        widgetRegistry[id].permissions = [...(widgetRegistry[id].permissions || []), ...(newConfig.permissions || [])];
        widgetRegistry[id].dependencies = [...(widgetRegistry[id].dependencies || []), ...(newConfig.dependencies || [])];
        widgetRegistry[id].capabilities = [...(widgetRegistry[id].capabilities || []), ...(newConfig.capabilities || [])];
      }
    }
  };
  
  // Register with the widgetAPI system
  registerWidget(name, widgetAPI);
  
  // Create a sticker for this widget
  const sticker: Sticker = {
    id: uuidv4(),
    name: config.displayName,
    icon: config.icon,
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    widgetType: name,
    description: config.description,
    isCustom: false,
    isPremium: config.isPremium || false,
    price: config.price,
  };
  
  // Register with the widget data registry
  registerWidgetData(name, config.displayName, config.description);
  
  // Create the complete widget object
  const widget: Widget = {
    ...config,
    id,
    api: widgetAPI,
    sticker,
  };
  
  // Add to registry
  widgetRegistry[id] = widget;
  
  return widget;
}

/**
 * Gets a widget by ID
 */
export function getWidget(id: string): Widget | undefined {
  return widgetRegistry[id];
}

/**
 * Gets all registered widgets
 */
export function getAllWidgets(): Widget[] {
  return Object.values(widgetRegistry);
}

/**
 * Gets widgets by category
 */
export function getWidgetsByCategory(category: string): Widget[] {
  return Object.values(widgetRegistry).filter(widget => widget.category === category);
}

/**
 * Gets premium widgets
 */
export function getPremiumWidgets(): Widget[] {
  return Object.values(widgetRegistry).filter(widget => widget.isPremium);
}

/**
 * Gets free widgets
 */
export function getFreeWidgets(): Widget[] {
  return Object.values(widgetRegistry).filter(widget => !widget.isPremium);
}
