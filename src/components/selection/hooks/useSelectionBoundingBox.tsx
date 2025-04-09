
import { useState, useEffect, RefObject } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

export function useSelectionBoundingBox(
  placedStickers: StickerType[],
  overlayRef: RefObject<HTMLDivElement>
) {
  const { selectedStickers, isMultiSelectMode } = useSelection();
  const [boundingBox, setBoundingBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showTools, setShowTools] = useState(false);
  
  // Calculate bounding box for selected stickers
  useEffect(() => {
    if (selectedStickers.size === 0) {
      setShowTools(false);
      return;
    }
    
    const selectedStickerObjs = placedStickers.filter(s => 
      selectedStickers.has(s.id) && !s.hidden
    );
    
    if (selectedStickerObjs.length === 0) {
      setShowTools(false);
      return;
    }
    
    setShowTools(true);
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    selectedStickerObjs.forEach(sticker => {
      const size = sticker.size || 60;
      const x = sticker.position.x;
      const y = sticker.position.y;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + size);
      maxY = Math.max(maxY, y + size);
    });
    
    // Add padding to the bounding box
    setBoundingBox({
      x: minX - 10,
      y: minY - 10,
      width: maxX - minX + 20,
      height: maxY - minY + 20
    });
  }, [selectedStickers, placedStickers]);
  
  return {
    boundingBox,
    showTools,
    selectedStickers,
    isMultiSelectMode
  };
}
