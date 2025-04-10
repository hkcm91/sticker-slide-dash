
import { Sticker as StickerType } from '@/types/stickers';

export function useStickerEffects(sticker: StickerType, size: number, rotation: number, zIndex: number, opacity: number, isVisuallyHidden: boolean) {
  /**
   * Helper function to calculate CSS styles for a sticker
   * Handles positioning, sizing, rotation, and special effects
   * 
   * @returns React CSS properties object for the sticker
   */
  const getStickerStyle = (): React.CSSProperties => {
    if (!sticker.placed) {
      return {};
    }
    
    const styles: React.CSSProperties = {
      position: 'absolute', 
      left: `${sticker.position.x}px`,
      top: `${sticker.position.y}px`,
      width: `${size}px`,
      height: `${size}px`,
      transform: `rotate(${rotation}deg)${sticker.transformStyle ? ' ' + sticker.transformStyle : ''}`,
      transformOrigin: sticker.transformOrigin || 'center',
      zIndex: zIndex || 10,
      opacity: isVisuallyHidden ? 0.3 : opacity,
      transition: 'transform 0.2s ease, opacity 0.3s ease, box-shadow 0.3s ease',
      pointerEvents: 'auto'
    };

    // Add special effects to the sticker if needed
    if (sticker.placed && sticker.effects) {
      if (sticker.effects.shadow) {
        styles.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }
      
      if (sticker.effects.glow) {
        styles.boxShadow = `0 0 15px 5px rgba(255, 255, 255, 0.3)${styles.boxShadow ? ', ' + styles.boxShadow : ''}`;
      }
      
      if (sticker.effects.blur) {
        styles.filter = `blur(${sticker.effects.blur}px)`;
      }
      
      if (sticker.effects.grayscale) {
        styles.filter = `${styles.filter ? styles.filter + ' ' : ''}grayscale(1)`;
      }
    }
    
    return styles;
  };

  /**
   * Helper function to get CSS classes based on sticker type
   * Different sticker types get different visual styles
   * 
   * @param className - Optional additional classes
   * @returns The appropriate CSS classes for the sticker type
   */
  const getStickerTypeClasses = (className?: string) => {
    switch(sticker.type) {
      case 'image':
        return 'bg-transparent';
      case 'video':
        return 'bg-black/20';
      case 'media':
        return 'bg-blue-50/20';
      case 'custom':
        return 'bg-purple-50/20';
      default:
        return className?.includes('sticker-in-tray') && !sticker.placed ? 
          'border-4 border-white/80 shadow-md hover:shadow-lg transition-all duration-200 bg-white/90' : '';
    }
  };

  return {
    getStickerStyle,
    getStickerTypeClasses
  };
}
