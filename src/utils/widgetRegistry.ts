
/**
 * Widget registry to store widget data without circular dependencies
 */

// Registry to store widget data
const widgetDataRegistry: Record<string, { title: string; content: string }> = {};

/**
 * Registers a widget in the system
 */
export const registerWidgetData = (name: string, title: string, content: string): void => {
  widgetDataRegistry[name] = { title, content };
  console.log(`Widget data '${name}' registered successfully!`);
};

/**
 * Gets widget data by name
 */
export const getWidgetData = (name: string): { title: string; content: string } | undefined => {
  return widgetDataRegistry[name];
};

/**
 * Gets all registered widget data
 */
export const getAllWidgetData = (): Record<string, { title: string; content: string }> => {
  return { ...widgetDataRegistry };
};
