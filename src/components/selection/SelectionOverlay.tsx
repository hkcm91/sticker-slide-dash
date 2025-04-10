
import React, { useRef } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';
import SelectionBoundingBox from './components/SelectionBoundingBox';
import SelectionToolbar from './components/SelectionToolbar';
import { 
  useSelectionBoundingBox,
  useSelectionDragAndResize,
  useGroupOperations,
  useStickerState
} from './hooks';

interface SelectionOverlayProps {
  placedStickers: StickerType[];
  onMultiMove: (stickerIds: string[], deltaX: number, deltaY: number) => void;
  onMultiResize: (stickerIds: string[], scaleRatio: number) => void;
  onGroupStickers?: (stickerIds: string[]) => void;
  onUngroupStickers?: (groupId: string) => void;
}

const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  placedStickers,
  onMultiMove,
  onMultiResize,
  onGroupStickers,
  onUngroupStickers
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { selectedStickers, isMultiSelectMode } = useSelection();
  
  // Log selected stickers for debugging
  console.log('[SelectionOverlay] selectedStickers from context:', [...selectedStickers]);
  console.log('[SelectionOverlay] placedStickers before hook:', placedStickers.length, 'stickers');
  
  const { 
    boundingBox,
    showTools 
  } = useSelectionBoundingBox(placedStickers, overlayRef);
  
  const { 
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  } = useSelectionDragAndResize(selectedStickers, onMultiMove, onMultiResize);
  
  const {
    handleGroupClick,
    handleUngroupClick,
    hasSelectedGroup,
    isAllSameGroup
  } = useGroupOperations(placedStickers, onGroupStickers, onUngroupStickers);
  
  // Get the boolean for whether all selected stickers are locked
  const { areAllLocked } = useStickerState(placedStickers);
  
  // Convert areAllLocked to a guaranteed boolean value to fix type error
  const isAllLocked = Boolean(areAllLocked);
  
  if (selectedStickers.size === 0 || !isMultiSelectMode || !showTools) {
    console.log('[SelectionOverlay] Hiding overlay. Conditions:', {
      size: selectedStickers.size, 
      isMultiSelectMode, 
      showTools
    });
    return null;
  }
  
  return (
    <SelectionBoundingBox
      isDragging={isDragging}
      boundingBox={boundingBox}
      areAllLocked={isAllLocked} // Use isAllLocked which is guaranteed to be a boolean
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      selectedCount={selectedStickers.size}
      overlayRef={overlayRef}
    >
      <SelectionToolbar
        onGroupClick={handleGroupClick}
        onUngroupClick={handleUngroupClick}
        canGroup={selectedStickers.size > 1}
        hasSelectedGroup={hasSelectedGroup}
        isAllSameGroup={isAllSameGroup}
      />
    </SelectionBoundingBox>
  );
};

export default SelectionOverlay;
