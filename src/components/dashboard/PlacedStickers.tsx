
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from '../Sticker';

interface PlacedStickersProps {
  stickers: StickerType[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
  onStickerDelete: (sticker: StickerType) => void;
  onStickerUpdate: (sticker: StickerType) => void;
}

const PlacedStickers: React.FC<PlacedStickersProps> = ({
  stickers,
  onDragStart,
  onStickerClick,
  onStickerDelete,
  onStickerUpdate
}) => {
  return (
    <>
      {stickers.map(sticker => (
        <Sticker
          key={sticker.id}
          sticker={sticker}
          onDragStart={onDragStart}
          onClick={onStickerClick}
          isDraggable={true}
          onDelete={onStickerDelete}
          onUpdate={onStickerUpdate}
        />
      ))}
    </>
  );
};

export default PlacedStickers;
