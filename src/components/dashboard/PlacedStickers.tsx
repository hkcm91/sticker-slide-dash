
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from '@/components/Sticker';

interface PlacedStickersProps {
  stickers: StickerType[];
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onStickerClick?: (sticker: StickerType) => void;
  onStickerDelete?: (sticker: StickerType) => void;
  onStickerUpdate?: (sticker: StickerType) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onChangeZIndex?: (sticker: StickerType, change: number) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
  readOnly?: boolean;
}

const PlacedStickers: React.FC<PlacedStickersProps> = ({ 
  stickers,
  onDragStart,
  onStickerClick,
  onStickerDelete,
  onStickerUpdate,
  onToggleLock,
  onChangeZIndex,
  onToggleVisibility,
  readOnly = false
}) => {
  // When in read-only mode, create stub functions that do nothing
  const handleDragStart = readOnly 
    ? (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => { e.preventDefault(); }
    : onDragStart;
    
  const handleStickerClick = readOnly
    ? (sticker: StickerType) => {}
    : onStickerClick;
  
  return (
    <div>
      {stickers
        .filter(sticker => !sticker.hidden)
        .map(sticker => (
          <Sticker
            key={sticker.id}
            sticker={sticker}
            onDragStart={handleDragStart || (() => {})}
            onClick={handleStickerClick || (() => {})}
            isDraggable={!readOnly && !sticker.locked}
            className={readOnly ? 'pointer-events-none' : ''}
            onDelete={!readOnly && onStickerDelete ? (s) => onStickerDelete(s) : undefined}
            onUpdate={!readOnly && onStickerUpdate ? (s) => onStickerUpdate(s) : undefined}
            onToggleLock={!readOnly && onToggleLock ? (s) => onToggleLock(s) : undefined}
            onChangeZIndex={!readOnly && onChangeZIndex ? (s, change) => onChangeZIndex(s, change) : undefined}
            onToggleVisibility={!readOnly && onToggleVisibility ? (s) => onToggleVisibility(s) : undefined}
          />
        ))}
    </div>
  );
};

export default PlacedStickers;
