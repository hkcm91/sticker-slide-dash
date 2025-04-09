
import { Sticker } from '@/types/stickers';
import { toast } from '@/hooks/use-toast';
import { CompressionLevel, compressStickers } from './compressionUtils';

/**
 * Helper to determine if a sticker can be considered unused
 */
const isUnusedSticker = (sticker: Sticker, threshold: number): boolean => {
  // A sticker is considered unused if it's not placed and hasn't been
  // modified or used recently (based on lastUsed timestamp if available)
  if (sticker.placed || sticker.docked) {
    return false;
  }
  
  // If the sticker has a lastUsed timestamp, check against threshold
  if (sticker.lastUsed) {
    const lastUsedDate = new Date(sticker.lastUsed);
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - threshold);
    
    return lastUsedDate < thresholdDate;
  }
  
  // For stickers without lastUsed, consider them unused
  // but don't clean up built-in stickers
  return sticker.isCustom === true;
};

/**
 * Filter stickers that haven't been used in the specified time period
 */
export const findUnusedStickers = (
  stickers: Sticker[], 
  daysThreshold: number = 30
): Sticker[] => {
  return stickers.filter(sticker => isUnusedSticker(sticker, daysThreshold));
};

/**
 * Clean up unused stickers to free up storage space
 */
export const cleanupUnusedStickers = (
  stickers: Sticker[],
  daysThreshold: number = 30
): Sticker[] => {
  const unusedStickers = findUnusedStickers(stickers, daysThreshold);
  
  if (unusedStickers.length === 0) {
    return stickers; // No stickers to clean up
  }
  
  // Filter out the unused stickers
  const cleanedStickers = stickers.filter(
    sticker => !unusedStickers.some(unused => unused.id === sticker.id)
  );
  
  // Return the cleaned up sticker collection
  return cleanedStickers;
};

/**
 * Perform storage optimization based on current usage
 * This function analyzes the current storage usage and performs
 * different levels of cleanup based on how close to the quota we are
 */
export const optimizeStorage = (
  stickers: Sticker[], 
  currentUsage: number,
  totalQuota: number
): Sticker[] => {
  // Calculate usage percentage
  const usagePercentage = (currentUsage / totalQuota) * 100;
  
  let optimizedStickers = [...stickers];
  let cleanupApplied = false;
  
  // Apply different strategies based on storage usage
  if (usagePercentage > 85) {
    // Critical storage situation: aggressive cleanup
    // 1. Remove unused stickers (from last 14 days)
    optimizedStickers = cleanupUnusedStickers(optimizedStickers, 14);
    // 2. Apply high compression to remaining stickers
    optimizedStickers = compressStickers(optimizedStickers, CompressionLevel.HIGH);
    cleanupApplied = true;
    
    toast({
      title: "Storage space critical",
      description: "Unused stickers were removed and compression applied to save space.",
      variant: "destructive",
      duration: 5000,
    });
  } 
  else if (usagePercentage > 70) {
    // High storage usage: moderate cleanup
    // 1. Remove unused stickers (from last 30 days)
    optimizedStickers = cleanupUnusedStickers(optimizedStickers, 30);
    // 2. Apply medium compression
    optimizedStickers = compressStickers(optimizedStickers, CompressionLevel.MEDIUM);
    cleanupApplied = true;
    
    toast({
      title: "Storage optimization",
      description: "Some unused stickers were archived to optimize storage.",
      duration: 5000,
    });
  }
  else if (usagePercentage > 50) {
    // Moderate storage usage: light cleanup
    // 1. Apply light compression only
    optimizedStickers = compressStickers(optimizedStickers, CompressionLevel.LIGHT);
    cleanupApplied = true;
  }
  
  // Return original stickers if no cleanup was needed
  return cleanupApplied ? optimizedStickers : stickers;
};

/**
 * Performs a scheduled cleanup check based on time elapsed
 * Returns true if cleanup was performed, false otherwise
 */
export const performScheduledCleanup = (
  stickers: Sticker[],
  setStickers: React.Dispatch<React.SetStateAction<Sticker[]>>
): boolean => {
  // Check when the last cleanup was performed
  const lastCleanup = localStorage.getItem('lastStickerCleanup');
  const now = new Date().toISOString();
  let cleanupNeeded = false;
  
  if (!lastCleanup) {
    // First time, set the timestamp and don't clean up yet
    localStorage.setItem('lastStickerCleanup', now);
    return false;
  }
  
  // Calculate days since last cleanup
  const lastCleanupDate = new Date(lastCleanup);
  const daysSinceCleanup = Math.floor(
    (new Date().getTime() - lastCleanupDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Perform weekly cleanup
  if (daysSinceCleanup >= 7) {
    cleanupNeeded = true;
  }
  
  if (cleanupNeeded) {
    try {
      // Get storage usage before cleanup
      let storageUsed = 0;
      let storageQuota = 5 * 1024 * 1024; // Default to 5MB
      
      // Try to get actual quota from browser
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          if (estimate.quota) {
            storageQuota = estimate.quota;
          }
        });
      }
      
      // Calculate current localStorage usage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            storageUsed += key.length + value.length;
          }
        }
      }
      storageUsed *= 2; // Rough approximation (2 bytes per character)
      
      // Perform optimization based on current usage
      const optimizedStickers = optimizeStorage(stickers, storageUsed, storageQuota);
      
      // Update state if changes were made
      if (optimizedStickers !== stickers) {
        setStickers(optimizedStickers);
      }
      
      // Update last cleanup timestamp
      localStorage.setItem('lastStickerCleanup', now);
      
      return true;
    } catch (error) {
      console.error("Error during scheduled cleanup:", error);
      return false;
    }
  }
  
  return false;
};
