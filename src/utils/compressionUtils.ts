import { Sticker } from '@/types/stickers';
import { toast } from '@/hooks/use-toast';

/**
 * Compression levels for sticker data
 */
export enum CompressionLevel {
  LIGHT = 'light',      // Remove only very large data
  MEDIUM = 'medium',    // Remove all animations and large widget data
  HIGH = 'high',        // Keep only essential data for positioning
  CRITICAL = 'critical' // Bare minimum data to prevent data loss
}

/**
 * Compresses sticker data based on the specified compression level
 */
export const compressStickers = (
  stickers: Sticker[], 
  compressionLevel: CompressionLevel = CompressionLevel.LIGHT
): Sticker[] => {
  return stickers.map(sticker => {
    // Create a copy to avoid modifying the original
    const compressedSticker = { ...sticker };
    
    // Flag that this sticker has been compressed for storage
    compressedSticker.storageCompressed = true;

    // Apply compression based on level
    if (compressionLevel === CompressionLevel.LIGHT) {
      // Light compression - only remove large data
      if (typeof compressedSticker.animation === 'object' && 
          JSON.stringify(compressedSticker.animation).length > 10000) {
        compressedSticker.animation = "compressed-animation-data";
      }
      
      if (compressedSticker.widgetData && 
          JSON.stringify(compressedSticker.widgetData).length > 5000) {
        compressedSticker.widgetData = { 
          compressed: true, 
          note: "Large widget data compressed for storage" 
        };
      }
    } 
    else if (compressionLevel === CompressionLevel.MEDIUM) {
      // Medium compression - remove all animations and large data
      compressedSticker.animation = undefined;
      
      if (compressedSticker.widgetData && 
          JSON.stringify(compressedSticker.widgetData).length > 1000) {
        compressedSticker.widgetData = { 
          compressed: true, 
          note: "Widget data compressed for storage" 
        };
      }
    }
    else if (compressionLevel === CompressionLevel.HIGH) {
      // High compression - keep only essential data
      compressedSticker.animation = undefined;
      compressedSticker.widgetData = undefined;
      compressedSticker.widgetCode = undefined;
      compressedSticker.packageUrl = undefined;
      compressedSticker.description = undefined;
    }
    else if (compressionLevel === CompressionLevel.CRITICAL) {
      // Critical compression - bare minimum to prevent data loss
      return {
        id: sticker.id,
        name: sticker.name,
        icon: sticker.icon,
        position: sticker.position,
        placed: sticker.placed,
        docked: sticker.docked,
        size: sticker.size,
        rotation: sticker.rotation,
        widgetType: sticker.widgetType,
        isCustom: sticker.isCustom,
        storageCompressed: true
      } as Sticker;
    }

    return compressedSticker;
  });
};

/**
 * Attempts to store stickers in localStorage with progressive compression if needed
 */
export const saveStickersToStorage = (stickers: Sticker[]): boolean => {
  if (stickers.length === 0) return true;
  
  try {
    // Try standard storage first
    const stickersJson = JSON.stringify(stickers);
    localStorage.setItem('stickers', stickersJson);
    return true;
  } catch (error) {
    console.warn("Standard storage failed, trying light compression...", error);
    
    try {
      // Try with light compression
      const compressedStickers = compressStickers(stickers, CompressionLevel.LIGHT);
      localStorage.setItem('stickers', JSON.stringify(compressedStickers));
      console.info("Stickers saved with light compression");
      return true;
    } catch (error) {
      console.warn("Light compression failed, trying medium compression...", error);
      
      try {
        // Try with medium compression
        const mediumCompressedStickers = compressStickers(stickers, CompressionLevel.MEDIUM);
        localStorage.setItem('stickers', JSON.stringify(mediumCompressedStickers));
        console.info("Stickers saved with medium compression");
        
        // Notify user that some data was compressed
        toast({
          title: "Storage optimization applied",
          description: "Some widget data was compressed to save space.",
          duration: 5000,
        });
        return true;
      } catch (error) {
        console.warn("Medium compression failed, trying high compression...", error);
        
        try {
          // Try with high compression
          const highCompressedStickers = compressStickers(stickers, CompressionLevel.HIGH);
          localStorage.setItem('stickers', JSON.stringify(highCompressedStickers));
          console.info("Stickers saved with high compression");
          
          // Notify user that significant data was compressed
          toast({
            title: "Storage space limited",
            description: "Some widget data had to be removed to save your layout.",
            variant: "destructive",
            duration: 5000,
          });
          return true;
        } catch (error) {
          console.error("High compression failed, trying critical compression...", error);
          
          try {
            // Last resort: critical compression
            const criticalCompressedStickers = compressStickers(stickers, CompressionLevel.CRITICAL);
            localStorage.setItem('stickers', JSON.stringify(criticalCompressedStickers));
            console.info("Stickers saved with critical compression");
            
            // Notify user about the critical compression
            toast({
              title: "Storage quota exceeded",
              description: "Your dashboard was saved with minimal data. Consider removing some widgets.",
              variant: "destructive",
              duration: 7000,
            });
            return true;
          } catch (error) {
            console.error("All compression attempts failed:", error);
            
            // Final attempt: store just the sticker IDs and positions
            try {
              const minimalData = stickers.map(s => ({
                id: s.id,
                position: s.position,
                placed: s.placed,
                docked: s.docked
              }));
              
              localStorage.setItem('stickers-minimal', JSON.stringify(minimalData));
              localStorage.setItem('stickers-recovery-needed', 'true');
              
              toast({
                title: "Storage error",
                description: "Could not save your complete dashboard. Only positions were saved.",
                variant: "destructive",
                duration: 10000,
              });
              return false;
            } catch (finalError) {
              console.error("Even minimal storage failed:", finalError);
              return false;
            }
          }
        }
      }
    }
  }
};

/**
 * Attempts to load stickers from localStorage with recovery options
 */
export const loadStickersFromStorage = (defaultStickers: Sticker[]): Sticker[] => {
  try {
    // Check if we need recovery
    const needsRecovery = localStorage.getItem('stickers-recovery-needed');
    
    if (needsRecovery === 'true') {
      // Try to recover stickers
      const minimalDataJson = localStorage.getItem('stickers-minimal');
      
      if (minimalDataJson) {
        const minimalData = JSON.parse(minimalDataJson);
        
        // Merge minimal data with default stickers
        const recoveredStickers = defaultStickers.map(defaultSticker => {
          const minimalSticker = minimalData.find((s: any) => s.id === defaultSticker.id);
          
          if (minimalSticker) {
            return {
              ...defaultSticker,
              position: minimalSticker.position,
              placed: minimalSticker.placed,
              docked: minimalSticker.docked
            };
          }
          
          return defaultSticker;
        });
        
        toast({
          title: "Dashboard partially recovered",
          description: "Some widget data was lost due to storage limitations.",
          variant: "destructive",
          duration: 7000,
        });
        
        // Clear recovery flags
        localStorage.removeItem('stickers-recovery-needed');
        localStorage.removeItem('stickers-minimal');
        
        // Try to save the recovered stickers
        saveStickersToStorage(recoveredStickers);
        
        return recoveredStickers;
      }
    }
    
    // Normal loading
    const stickersJson = localStorage.getItem('stickers');
    
    if (stickersJson) {
      return JSON.parse(stickersJson);
    }
    
    return defaultStickers;
  } catch (error) {
    console.error("Failed to load stickers from storage:", error);
    
    toast({
      title: "Error loading dashboard",
      description: "Could not load your saved dashboard. Starting with default stickers.",
      variant: "destructive",
      duration: 5000,
    });
    
    return defaultStickers;
  }
};
