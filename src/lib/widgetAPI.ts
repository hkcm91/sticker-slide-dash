export interface WidgetState {
  [key: string]: any;
}

export interface WidgetAPI {
  init(): void;
  getState(): WidgetState;
  setState(state: Partial<WidgetState>): void;
  trigger(action: string, payload?: any): void;
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
