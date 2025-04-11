
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';

interface UseStickerControlHandlersProps {
  sticker: StickerType;
  onDelete?: (sticker: StickerType) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onChangeZIndex?: (sticker: StickerType, change: number) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
}

export function useStickerControlHandlers({
  sticker,
  onDelete,
  onToggleLock,
  onChangeZIndex,
  onToggleVisibility
}: UseStickerControlHandlersProps) {
  const { toast } = useToast();

  // Handler functions for various sticker controls
  const handleDelete = () => onDelete?.(sticker);
  
  const handleToggleLock = () => {
    if (onToggleLock) {
      onToggleLock(sticker);
    }
  };
  
  const handleChangeZIndex = (change: number) => {
    if (onChangeZIndex) {
      onChangeZIndex(sticker, change);
    }
  };
  
  const handleToggleVisibility = () => {
    if (onToggleVisibility) {
      onToggleVisibility(sticker);
    }
  };

  return {
    handleDelete,
    handleToggleLock,
    handleChangeZIndex,
    handleToggleVisibility
  };
}
