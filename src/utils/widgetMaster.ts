
import { v4 as uuidv4 } from 'uuid';
import { Sticker } from '@/types/stickers';
import { WidgetAPI, registerWidget } from '@/lib/widgetAPI';

/**
 * Creates a new widget with the given options and returns a sticker.
 * This is a simplified way to create widgets for novice users.
 */
export const createSimpleWidget = (options: {
  name: string;
  title: string;
  description: string;
  icon: string;
  backgroundColor?: string;
  initialState?: Record<string, any>;
  actions?: Record<string, (state: any, payload?: any) => any>;
}) => {
  const {
    name,
    title,
    description,
    icon,
    backgroundColor = '#4CAF50',
    initialState = {},
    actions = {}
  } = options;
  
  // Create a simple widget implementation
  let state = { ...initialState };
  
  const widget: WidgetAPI = {
    init() {
      console.log(`${name} widget initialized`);
    },
    
    getState() {
      return state;
    },
    
    setState(newState) {
      state = { ...state, ...newState };
    },
    
    trigger(action, payload) {
      // Check if this action is defined in the actions map
      if (actions[action]) {
        state = actions[action](state, payload);
        return true;
      } else {
        console.warn(`Action '${action}' not defined for widget '${name}'`);
        return false;
      }
    }
  };
  
  // Register the widget
  registerWidget(name, widget);
  
  // Create and return the sticker
  const sticker: Sticker = {
    id: uuidv4(),
    name,
    icon,
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    widgetType: name
  };
  
  // Add the widget to the dashboard's widget data map
  import('@/utils/widgetHelpers').then(({ addWidget }) => {
    addWidget(name, title, description);
  });
  
  return sticker;
};

/**
 * Creates a simple icon for a widget using an emoji or text.
 */
export const createSimpleIcon = (
  content: string,
  backgroundColor: string = '#4CAF50',
  textColor: string = 'white'
) => {
  // Create a canvas to generate the icon
  const canvas = document.createElement('canvas');
  canvas.width = 60;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(30, 30, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw text/emoji
    ctx.fillStyle = textColor;
    ctx.font = content.length === 1 || content.match(/\p{Emoji}/u) ? '32px Arial' : '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, 30, 30);
  }
  
  return canvas.toDataURL('image/png');
};

/**
 * Processes a widget package ZIP file
 * This is a placeholder implementation that would normally extract and process ZIP contents
 */
export const processWidgetPackage = async (zipFile: File, widgetName: string): Promise<Sticker | null> => {
  try {
    console.log(`Processing widget package: ${zipFile.name}`);
    
    // In a real implementation, we would:
    // 1. Extract the ZIP file
    // 2. Load the manifest.json
    // 3. Process the widget code
    // 4. Register the widget with the system
    
    // For now, just return a placeholder widget
    return createSimpleWidget({
      name: widgetName,
      title: `${widgetName} from Package`,
      description: `This widget was loaded from the ${zipFile.name} package.`,
      icon: createSimpleIcon('📦', '#6200EA'),
      initialState: { status: 'installed' }
    });
  } catch (error) {
    console.error("Error processing widget package:", error);
    return null;
  }
};
