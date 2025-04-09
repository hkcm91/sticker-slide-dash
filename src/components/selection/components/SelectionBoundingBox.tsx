import React from 'react';
import { Lock, MoveHorizontal, ArrowUpDown } from 'lucide-react';

interface SelectionBoundingBoxProps {
  isDragging: boolean;
  boundingBox: { x: number; y: number; width: number; height: number };
  areAllLocked: boolean; // Explicitly typed as boolean
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
  selectedCount: number;
  overlayRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

const SelectionBoundingBox: React.FC<SelectionBoundingBoxProps> = ({
  isDragging,
  boundingBox,
  areAllLocked,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
  selectedCount,
  overlayRef,
  children
}) => {
  return (
    <div 
      ref={overlayRef}
      className={`absolute border-2 border-dashed ${isDragging ? 'border-blue-600 bg-blue-400/20' : 'border-blue-500 bg-blue-400/10'} z-50 ${areAllLocked ? 'cursor-not-allowed' : 'cursor-move'}`}
      style={{
        left: `${boundingBox.x}px`,
        top: `${boundingBox.y}px`,
        width: `${boundingBox.width}px`,
        height: `${boundingBox.height}px`,
        pointerEvents: 'all',
        backdropFilter: 'blur(2px)'
      }}
      onMouseDown={areAllLocked ? undefined : onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={areAllLocked ? undefined : onWheel}
    >
      {/* Selection count badge */}
      <div className="absolute -top-9 left-0 bg-black/85 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2">
        <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          {selectedCount}
        </span>
        <span>selected</span>
        
        {areAllLocked && (
          <span className="flex items-center ml-1">
            <Lock className="w-3.5 h-3.5 ml-1 text-red-400" />
          </span>
        )}
      </div>
      
      {/* Move indicators */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-30 pointer-events-none">
        {!areAllLocked ? (
          <>
            <MoveHorizontal className="w-6 h-6 text-blue-500" />
            <ArrowUpDown className="w-6 h-6 text-blue-500 mt-1" />
          </>
        ) : (
          <Lock className="w-8 h-8 text-red-500" />
        )}
      </div>
      
      {/* Resize handle */}
      {!areAllLocked && (
        <div 
          className="absolute -right-3 -bottom-3 w-6 h-6 bg-blue-500 rounded-full cursor-se-resize flex items-center justify-center shadow-md"
          title="Drag to resize or use mouse wheel"
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default SelectionBoundingBox;
