
import { useContext } from 'react';
import { SelectionContext } from '@/contexts/SelectionContext';

/**
 * A safe version of useSelection that provides default values when used outside of a SelectionProvider
 * This prevents the "useSelection must be used within a SelectionProvider" error
 */
export function useSafeSelection() {
  const context = useContext(SelectionContext);
  
  if (context === undefined) {
    // Return default values if used outside of a SelectionProvider
    return {
      selectedStickers: new Set<string>(),
      selection: [] as string[],
      isMultiSelectMode: false,
      startSelection: () => {},
      endSelection: () => {},
      clearSelection: () => {},
      toggleSelect: () => {},
      selectSticker: () => {},
      deselectSticker: () => {},
      selectMultiple: () => {},
      toggleMultiSelectMode: () => {},
      selectAll: () => {},
      isSelected: () => false,
      toggleSelection: () => {}
    };
  }
  
  return context;
}
