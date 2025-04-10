
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import Sticker from '../Sticker';
import { useSelection } from '@/contexts/SelectionContext';

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
  const { isMultiSelectMode } = useSelection();
  
  // FIXED: Defensive copy to prevent accidental modification
  // Only filter stickers by visibility without modifying them
  const visibleStickers = stickers.filter(sticker => !sticker.hidden);
  
  // Debug info - log sticker count for visibility
  console.log(`Rendering ${visibleStickers.length} placed stickers (of ${stickers.length} total)`);
  
  // Sort stickers by z-index
  const sortedStickers = [...visibleStickers].sort((a, b) => 
    (a.zIndex || 0) - (b.zIndex || 0)
  );

  return (
    <div className={isMultiSelectMode ? "cursor-crosshair" : ""}>
      {sortedStickers.map(sticker => (
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
    </div>
  );
};

export default PlacedStickers;
