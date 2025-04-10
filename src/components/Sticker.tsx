
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import StickerBase from './sticker/StickerBase';

interface StickerProps {
  sticker: StickerType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onClick: (sticker: StickerType) => void;
  isDraggable: boolean;
  className?: string;
  onDelete?: (sticker: StickerType) => void;
  onUpdate?: (sticker: StickerType) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onChangeZIndex?: (sticker: StickerType, change: number) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
}

/**
 * Sticker component - a wrapper around StickerBase to maintain backwards compatibility
 */
const Sticker = (props: StickerProps) => {
  return <StickerBase {...props} />;
};

export default Sticker;
