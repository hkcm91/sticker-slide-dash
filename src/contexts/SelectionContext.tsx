
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sticker } from '@/types/stickers';

interface SelectionContextType {
  selectedStickers: Set<string>;
  selection: string[]; // Add this for backward compatibility
  isMultiSelectMode: boolean;
  startSelection: (point: { x: number; y: number }) => void;
  endSelection: (point: { x: number; y: number }) => void;
  clearSelection: () => void;
  toggleSelect: (id: string) => void;
  selectSticker: (id: string) => void;
  deselectSticker: (id: string) => void;
  selectMultiple: (ids: string[]) => void;
  // Added missing properties and methods
  toggleMultiSelectMode: () => void;
  selectAll: () => void;
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string, useShift?: boolean) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode, stickers: Sticker[] }> = ({ 
  children,
  stickers 
}) => {
  const [selectedStickers, setSelectedStickers] = useState<Set<string>>(new Set());
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const startSelection = useCallback((point: { x: number; y: number }) => {
    setSelectionStart(point);
    setIsMultiSelectMode(true);
  }, []);

  const endSelection = useCallback((point: { x: number; y: number }) => {
    setSelectionStart(null);
    setIsMultiSelectMode(false);
    // Actual selection logic would happen here in a full implementation
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedStickers(new Set());
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedStickers(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  }, []);

  const selectSticker = useCallback((id: string) => {
    setSelectedStickers(prev => {
      const newSelection = new Set(prev);
      newSelection.add(id);
      return newSelection;
    });
  }, []);

  const deselectSticker = useCallback((id: string) => {
    setSelectedStickers(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(id);
      return newSelection;
    });
  }, []);

  const selectMultiple = useCallback((ids: string[]) => {
    setSelectedStickers(new Set(ids));
  }, []);

  // Added missing method implementations
  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => !prev);
  }, []);

  const selectAll = useCallback(() => {
    const allIds = stickers.map(sticker => sticker.id);
    setSelectedStickers(new Set(allIds));
  }, [stickers]);

  const isSelected = useCallback((id: string) => {
    return selectedStickers.has(id);
  }, [selectedStickers]);

  const toggleSelection = useCallback((id: string, useShift: boolean = false) => {
    if (useShift) {
      // In a real implementation, this would handle shift-selection
      // for selecting a range of items between the last selected item and this one
      toggleSelect(id);
    } else {
      toggleSelect(id);
    }
  }, [toggleSelect]);

  // Convert Set to array for compatibility with components expecting an array
  const selection = Array.from(selectedStickers);

  return (
    <SelectionContext.Provider 
      value={{
        selectedStickers,
        selection,
        isMultiSelectMode,
        startSelection,
        endSelection,
        clearSelection,
        toggleSelect,
        selectSticker,
        deselectSticker,
        selectMultiple,
        // Added missing properties and methods
        toggleMultiSelectMode,
        selectAll,
        isSelected,
        toggleSelection
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  
  return context;
};
