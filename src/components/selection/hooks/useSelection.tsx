
import { useState, useCallback } from 'react';

interface SelectionPoint {
  x: number;
  y: number;
}

export function useSelection() {
  const [selection, setSelection] = useState<string[]>([]);
  const [selectionStart, setSelectionStart] = useState<SelectionPoint | null>(null);

  const startSelection = useCallback((point: SelectionPoint) => {
    setSelectionStart(point);
  }, []);

  const endSelection = useCallback((point: SelectionPoint) => {
    setSelectionStart(null);
    // Actual selection logic would happen here, for now it's a placeholder
  }, []);

  const clearSelection = useCallback(() => {
    setSelection([]);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelection(prev => {
      if (prev.includes(id)) {
        return prev.filter(stickerId => stickerId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  return {
    selection,
    startSelection,
    endSelection,
    clearSelection,
    toggleSelect
  };
}
