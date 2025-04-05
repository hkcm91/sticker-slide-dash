
import { addCustomWidget } from '@/components/Dashboard';

/**
 * Adds a new custom widget to the dashboard
 * 
 * Example usage:
 * ```
 * import { addWidget } from '@/utils/widgetHelpers';
 * 
 * // Call this function to add your own widget
 * addWidget('MyWidget', 'My Custom Widget', 'This is my custom widget content');
 * ```
 */
export const addWidget = (name: string, title: string, content: string) => {
  addCustomWidget(name, title, content);
  console.log(`Widget '${name}' has been added! You can now create a sticker for it.`);
  return true;
};

/**
 * Creates a simple SVG icon for your custom widget
 * 
 * Example usage:
 * ```
 * import { createIcon } from '@/utils/widgetHelpers';
 * 
 * // Create a custom icon with the letter "A" in it
 * const myIcon = createIcon('A', '#FF5722');
 * ```
 */
export const createIcon = (
  letter: string,
  backgroundColor: string = '#4CAF50',
  textColor: string = 'white'
) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="${backgroundColor}" />
    <text x="12" y="16" font-family="Arial" font-size="12" fill="${textColor}" text-anchor="middle">${letter}</text>
  </svg>`;
  
  return "data:image/svg+xml;base64," + btoa(svg);
};
