
import React from 'react';

interface BoundingBoxProps {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isDragging: boolean;
  isResizing: boolean;
  locked: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onDragMove: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
  onResizeStart: (e: React.MouseEvent) => void;
  onResizeMove: (e: React.MouseEvent) => void;
  onResizeEnd: () => void;
}

const SelectionBoundingBox: React.FC<BoundingBoxProps> = ({
  boundingBox,
  isDragging,
  isResizing,
  locked,
  onDragStart,
  onDragMove,
  onDragEnd,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: boundingBox.x,
        top: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
        border: '2px dashed blue',
        backgroundColor: isDragging ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
        cursor: locked ? 'not-allowed' : 'move',
        pointerEvents: 'all',
        zIndex: 100,
      }}
      onMouseDown={locked ? undefined : onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      {!locked && (
        <div
          style={{
            position: 'absolute',
            right: -10,
            bottom: -10,
            width: 20,
            height: 20,
            backgroundColor: 'blue',
            borderRadius: '50%',
            cursor: 'nwse-resize',
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(e);
          }}
          onMouseMove={onResizeMove}
          onMouseUp={onResizeEnd}
          onMouseLeave={onResizeEnd}
        />
      )}
    </div>
  );
};

export default SelectionBoundingBox;
