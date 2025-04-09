
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from '../Sticker';

interface PlacedStickersProps {
  stickers: StickerType[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick: (sticker: StickerType) => void;
  onStickerDelete: (sticker: StickerType) => void;
  onStickerUpdate: (sticker: StickerType) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onChangeZIndex?: (sticker: StickerType, change: number) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
}

const PlacedStickers: React.FC<PlacedStickersProps> = ({
  stickers,
  onDragStart,
  onStickerClick,
  onStickerDelete,
  onStickerUpdate,
  onToggleLock,
  onChangeZIndex,
  onToggleVisibility
}) => {
  return (
    <>
      {stickers.filter(sticker => !sticker.hidden).map(sticker => (
        <Sticker
          key={sticker.id}
          sticker={sticker}
          onDragStart={onDragStart}
          onClick={onStickerClick}
          isDraggable={true}
          onDelete={onStickerDelete}
          onUpdate={onStickerUpdate}
          onToggleLock={onToggleLock}
          onChangeZIndex={onChangeZIndex}
          onToggleVisibility={onToggleVisibility}
        />
      ))}
    </>
  );
};

export default PlacedStickers;
