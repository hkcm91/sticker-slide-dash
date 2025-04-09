
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from '@/components/Sticker';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StickersListProps {
  stickers: StickerType[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
}

const StickersList: React.FC<StickersListProps> = ({
  stickers,
  onDragStart,
  onStickerClick
}) => {
  const availableStickers = stickers.filter(sticker => !sticker.placed);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-2 mb-2 bg-purple-100/30 backdrop-blur-sm">
        <h3 className="text-sm font-medium px-2 py-1 text-sticker-purple">All Stickers</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 grid grid-cols-3 gap-3">
          {availableStickers.map((sticker) => (
            <div key={sticker.id} className="relative group flex flex-col items-center">
              <div className="relative">
                <Sticker
                  sticker={sticker}
                  onDragStart={onDragStart}
                  onClick={() => onStickerClick(sticker)}
                  isDraggable={true}
                  className="mx-auto sticker-in-tray hover:scale-110 transition-transform duration-200"
                />
              </div>
              <p className="text-xs text-center mt-1 truncate w-full">{sticker.name}</p>
            </div>
          ))}
          {availableStickers.length === 0 && (
            <div className="col-span-3 text-center text-purple-500 text-xs mt-4">
              No stickers available.
              <br />
              Create one using the button above!
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StickersList;
