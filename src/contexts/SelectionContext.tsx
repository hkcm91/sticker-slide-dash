
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';

interface SelectionContextType {
  selectedStickers: Set<string>;
  isMultiSelectMode: boolean;
  toggleSelection: (stickerId: string, isShiftKey: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  toggleMultiSelectMode: () => void;
  isSelected: (stickerId: string) => boolean;
}

const SelectionContext = createContext<SelectionContextType>({
  selectedStickers: new Set(),
  isMultiSelectMode: false,
  toggleSelection: () => {},
  selectAll: () => {},
  clearSelection: () => {},
  toggleMultiSelectMode: () => {},
  isSelected: () => false,
});

export const useSelection = () => useContext(SelectionContext);

interface SelectionProviderProps {
  children: React.ReactNode;
  stickers: StickerType[];
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ 
  children, 
  stickers 
}) => {
  const [selectedStickers, setSelectedStickers] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const { toast } = useToast();

  const toggleSelection = useCallback((stickerId: string, isShiftKey: boolean) => {
    setSelectedStickers(prev => {
      const newSelection = new Set(prev);
      
      if (!isShiftKey && !isMultiSelectMode) {
        // If not using shift key or multi-select mode, clear and select only this one
        newSelection.clear();
        newSelection.add(stickerId);
      } else {
        // Toggle the selection
        if (newSelection.has(stickerId)) {
          newSelection.delete(stickerId);
        } else {
          newSelection.add(stickerId);
        }
      }
      
      return newSelection;
    });
  }, [isMultiSelectMode]);

  const selectAll = useCallback(() => {
    const allStickerIds = stickers
      .filter(sticker => sticker.placed && !sticker.docked && !sticker.hidden)
      .map(sticker => sticker.id);
    
    setSelectedStickers(new Set(allStickerIds));
    
    toast({
      title: `Selected ${allStickerIds.length} stickers`,
      description: "All visible stickers are now selected",
      duration: 2000,
    });
  }, [stickers, toast]);

  const clearSelection = useCallback(() => {
    setSelectedStickers(new Set());
  }, []);

  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => {
      const newMode = !prev;
      if (!newMode) {
        // When exiting multi-select mode, clear the selection
        setSelectedStickers(new Set());
      } else {
        // When entering multi-select mode, provide feedback
        toast({
          title: "Multi-select mode activated",
          description: "Click on stickers to select multiple items",
          duration: 3000,
        });
      }
      return newMode;
    });
  }, [toast]);

  const isSelected = useCallback((stickerId: string) => {
    return selectedStickers.has(stickerId);
  }, [selectedStickers]);

  return (
    <SelectionContext.Provider
      value={{
        selectedStickers,
        isMultiSelectMode,
        toggleSelection,
        selectAll,
        clearSelection,
        toggleMultiSelectMode,
        isSelected
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};
