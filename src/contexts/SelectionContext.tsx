
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

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
      .filter(sticker => sticker.placed && !sticker.docked)
      .map(sticker => sticker.id);
    
    setSelectedStickers(new Set(allStickerIds));
  }, [stickers]);

  const clearSelection = useCallback(() => {
    setSelectedStickers(new Set());
  }, []);

  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => !prev);
    if (!isMultiSelectMode) {
      // When entering multi-select mode, clear the selection
      setSelectedStickers(new Set());
    }
  }, [isMultiSelectMode]);

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
