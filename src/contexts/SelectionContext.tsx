
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
        selectMultiple
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
