
import { Sticker as StickerType } from '@/types/stickers';
import { useSafeSelection } from '@/hooks/useSafeSelection';
import { useToast } from '@/hooks/use-toast';

interface UseStickerClickHandlersProps {
  sticker: StickerType;
  onClick: (sticker: StickerType) => void;
}

export function useStickerClickHandlers({ sticker, onClick }: UseStickerClickHandlersProps) {
  const { isMultiSelectMode, toggleSelection, isSelected } = useSafeSelection();
  const { toast } = useToast();

  /**
   * Handles click events on the sticker
   * In multi-select mode, toggles selection
   * Otherwise, triggers the onClick handler WITHOUT modifying sticker
   */
  const handleStickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isMultiSelectMode) {
      toggleSelection(sticker.id, e.shiftKey);
      
      if (!isSelected(sticker.id)) {
        toast({
          title: "Sticker selected",
          description: `${sticker.name || 'Sticker'} added to selection`,
          duration: 1500,
        });
      }
    } else {
      // Simply pass the sticker to onClick without any state modifications
      onClick(sticker);
    }
  };

  return {
    handleStickerClick,
  };
}
