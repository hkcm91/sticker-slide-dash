
import { v4 as uuidv4 } from 'uuid';
import { Sticker } from '@/types/stickers';
import { createIcon } from './widgetHelpers';
import { registerWidget, WidgetAPI } from '@/lib/widgetAPI';

interface WidgetStickerOptions {
  name: string;
  letter: string;
  backgroundColor?: string;
  widgetAPI?: WidgetAPI;
  title?: string;
  description?: string;
}

export const createWidgetSticker = ({
  name,
  letter,
  backgroundColor = '#4CAF50',
  widgetAPI,
  title,
  description
}: WidgetStickerOptions): Sticker => {
  // Register the widget API if provided
  if (widgetAPI) {
    registerWidget(name, widgetAPI);
  }
  
  // Create the icon for the sticker
  const icon = createIcon(letter, backgroundColor);
  
  // Add the widget content and metadata
  if (title && description) {
    import('@/utils/widgetHelpers').then(({ addWidget }) => {
      addWidget(name, title, description);
    });
  }
  
  // Create and return a new sticker
  return {
    id: uuidv4(),
    name,
    icon,
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    widgetType: name
  };
};
