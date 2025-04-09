
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
        
        // If there's custom widget data, add it to the title
        if (sticker.widgetData) {
          widgetData.title = `${widgetData.title || sticker.name} (with JSON Data)`;
        }
        
        return (
          <WidgetModal 
            key={id}
            isOpen={isOpen}
            onClose={() => onCloseModal(id)}
            sticker={sticker}
            widgetData={widgetData}
            onDock={onDockWidget}
          />
        );
      })}
    </>
  );
};

export default WidgetModals;
