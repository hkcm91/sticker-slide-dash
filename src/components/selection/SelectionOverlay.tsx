
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
  
  // Custom hooks for managing selection state and interactions
  const { boundingBox, showTools } = useSelectionBoundingBox(placedStickers, overlayRef);
  
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
  
  const { areAllLocked } = useStickerState(placedStickers);
  
  // Don't render anything if no selection or not in multi-select mode
  if (selectedStickers.size === 0 || !isMultiSelectMode || !showTools) return null;
  
  return (
    <SelectionBoundingBox
      isDragging={isDragging}
      boundingBox={boundingBox}
      areAllLocked={areAllLocked} // Now properly typed as boolean
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
