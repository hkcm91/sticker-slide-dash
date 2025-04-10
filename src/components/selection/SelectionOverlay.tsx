import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useDashboardStore } from '@/store/dashboard';
import { useSelection } from './hooks/useSelection';
import { useDrag } from './hooks/useDrag';
import { useResize } from './hooks/useResize';
import SelectionBoundingBox from './SelectionBoundingBox';
import { useStickerState } from './hooks/useStickerState';

interface SelectionOverlayProps {
  placedStickers: StickerType[];
  onMultiMove: (stickerIds: string[], deltaX: number, deltaY: number) => void;
  onMultiResize: (stickerIds: string[], scaleRatio: number) => void;
  onGroupStickers: (stickerIds: string[]) => void;
  onUngroupStickers: (groupId: string) => void;
}

const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  placedStickers,
  onMultiMove,
  onMultiResize,
  onGroupStickers,
  onUngroupStickers,
}) => {
  const { selection, startSelection, endSelection, clearSelection, toggleSelect } = useSelection();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  const [lockedState, setLockedState] = useState<boolean | string>(false);
  const { ungroupSticker } = useDashboardStore();
  const dragRef = useRef({ startX: 0, startY: 0 });
  const resizeRef = useRef({ startWidth: 0, startHeight: 0 });
  const groupId = useMemo(() => {
    if (selection.length === 1) {
      const selectedSticker = placedStickers.find(sticker => sticker.id === selection[0]);
      return selectedSticker?.groupId || null;
    }
    return null;
  }, [selection, placedStickers]);

  const { isLocked } = useStickerState();

  useEffect(() => {
    if (selection.length > 0) {
      const allLocked = selection.every(stickerId => {
        const sticker = placedStickers.find(s => s.id === stickerId);
        return sticker ? isLocked(sticker) : false;
      });
      setLockedState(allLocked);
    } else {
      setLockedState(false);
    }
  }, [selection, placedStickers, isLocked]);

  const handleCanvasClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  useEffect(() => {
    document.addEventListener('click', handleCanvasClick);
    return () => {
      document.removeEventListener('click', handleCanvasClick);
    };
  }, [handleCanvasClick]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    startSelection({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    endSelection({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.buttons === 1) {
      if ((e.target as HTMLElement).id === 'dashboard-container') {
        endSelection({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleStickerClick = (e: React.MouseEvent, sticker: StickerType) => {
    e.stopPropagation();
    toggleSelect(sticker.id);
  };

  const { handleDragStart, handleDragMove, handleDragEnd } = useDrag({
    selection,
    placedStickers,
    onMultiMove,
    setIsDragging,
    setInitialMousePosition,
    dragRef,
  });

  const { handleResizeStart, handleResizeMove, handleResizeEnd } = useResize({
    selection,
    placedStickers,
    onMultiResize,
    setIsResizing,
    setInitialMousePosition,
    resizeRef
  });

  const boundingBox = useMemo(() => {
    if (selection.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selection.forEach(stickerId => {
      const sticker = placedStickers.find(s => s.id === stickerId);
      if (sticker) {
        minX = Math.min(minX, sticker.position.x);
        minY = Math.min(minY, sticker.position.y);
        maxX = Math.max(maxX, sticker.position.x + sticker.size);
        maxY = Math.max(maxY, sticker.position.y + sticker.size);
      }
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [selection, placedStickers]);

  const isLockedValue = useMemo(() => {
    if (lockedState === true || lockedState === "true") {
      return true;
    }
    return false;
  }, [lockedState]);

  return (
    <>
      <div
        id="selection-layer"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 99 }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {placedStickers.map(sticker => (
          <div
            key={sticker.id}
            style={{
              position: 'absolute',
              left: sticker.position.x,
              top: sticker.position.y,
              width: sticker.size,
              height: sticker.size,
              border: selection.includes(sticker.id) ? '2px dashed blue' : 'none',
              boxSizing: 'border-box',
              pointerEvents: 'auto',
              zIndex: selection.includes(sticker.id) ? 100 : 'auto',
            }}
            onClick={(e) => handleStickerClick(e, sticker)}
          />
        ))}
      </div>
      {selection.length > 1 && !isLockedValue && (
        <div className="absolute top-2 left-2 z-50">
          {groupId ? (
            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => onUngroupStickers(groupId)}>
              Ungroup
            </button>
          ) : (
            <button className="bg-green-500 text-white p-2 rounded" onClick={() => onGroupStickers(selection)}>
              Group
            </button>
          )}
        </div>
      )}
      {selection.length > 0 && boundingBox && (
        <SelectionBoundingBox
          boundingBox={boundingBox}
          isDragging={isDragging}
          isResizing={isResizing}
          locked={isLockedValue}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onResizeStart={handleResizeStart}
          onResizeMove={handleResizeMove}
          onResizeEnd={handleResizeEnd}
        />
      )}
    </>
  );
};

export default SelectionOverlay;
