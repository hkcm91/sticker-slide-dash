
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { getWidgetData } from '@/utils/widgetRegistry';
import WidgetModal from '../WidgetModal';

interface WidgetModalsProps {
  openWidgets: Map<string, { sticker: StickerType, isOpen: boolean }>;
  onCloseModal: (stickerId: string) => void;
}

const WidgetModals: React.FC<WidgetModalsProps> = ({ openWidgets, onCloseModal }) => {
  return (
    <>
      {Array.from(openWidgets.entries()).map(([id, { sticker, isOpen }]) => {
        const widgetData = getWidgetData(sticker.name);
        if (!widgetData) return null;
        
        return (
          <WidgetModal 
            key={id}
            isOpen={isOpen}
            onClose={() => onCloseModal(id)}
            sticker={sticker}
            widgetData={widgetData}
          />
        );
      })}
    </>
  );
};

export default WidgetModals;
