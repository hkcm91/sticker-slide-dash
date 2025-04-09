
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { getWidgetData } from '@/utils/widgetRegistry';
import WidgetModal from '../WidgetModal';

interface WidgetModalsProps {
  openWidgets: Map<string, { sticker: StickerType, isOpen: boolean }>;
  onCloseModal: (stickerId: string) => void;
  onDockWidget?: (sticker: StickerType) => void;
}

const WidgetModals: React.FC<WidgetModalsProps> = ({ 
  openWidgets, 
  onCloseModal,
  onDockWidget
}) => {
  return (
    <>
      {Array.from(openWidgets.entries()).map(([id, { sticker, isOpen }]) => {
        const widgetData = getWidgetData(sticker.name);
        if (!widgetData) return null;
        
        // Customize the title based on sticker type (widget, image, video, etc.)
        let title = widgetData.title || sticker.name;
        
        // If there's custom widget data, add it to the title
        if (sticker.widgetData) {
          title = `${title} (with JSON Data)`;
        }
        
        // Handle different sticker types
        if (sticker.type === 'image') {
          title = `Image: ${title}`;
        } else if (sticker.type === 'video') {
          title = `Video: ${title}`;
        } else if (sticker.type === 'media') {
          title = `Media: ${title}`;
        }
        
        // Update the widget data with the customized title
        const updatedWidgetData = {
          ...widgetData,
          title
        };
        
        return (
          <WidgetModal 
            key={id}
            isOpen={isOpen}
            onClose={() => onCloseModal(id)}
            sticker={sticker}
            widgetData={updatedWidgetData}
            onDock={onDockWidget}
          />
        );
      })}
    </>
  );
};

export default WidgetModals;
