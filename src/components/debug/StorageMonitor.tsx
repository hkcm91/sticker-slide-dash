
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, HardDrive, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findUnusedStickers } from '@/utils/stickerCleanupUtils';
import { Sticker } from '@/types/stickers';
import BackupRestoreDialog from './BackupRestoreDialog';

interface StorageMonitorProps {
  visible?: boolean;
  stickers: Sticker[];
  onImportStickers?: (stickers: Sticker[]) => void;
}

const StorageMonitor: React.FC<StorageMonitorProps> = ({ 
  visible = false, 
  stickers = [],
  onImportStickers
}) => {
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(5 * 1024 * 1024); // Default to 5MB
  const [isNearLimit, setIsNearLimit] = useState(false);
  const [lastCleanupDate, setLastCleanupDate] = useState<string | null>(null);
  const [unusedCount, setUnusedCount] = useState(0);
  
  useEffect(() => {
    // Calculate current localStorage usage
    const calculateUsage = () => {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            total += key.length + value.length;
          }
        }
      }
      return total * 2; // Rough approximation (2 bytes per character)
    };
    
    // Try to get quota from browser
    const getQuota = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          if (estimate.quota) {
            setStorageQuota(estimate.quota);
          }
        }
      } catch (error) {
        console.warn('Could not estimate storage quota:', error);
      }
    };
    
    // Get last cleanup date
    const getLastCleanupDate = () => {
      const lastCleanup = localStorage.getItem('lastStickerCleanup');
      setLastCleanupDate(lastCleanup);
    };
    
    // Check for unused stickers
    const checkUnusedStickers = () => {
      try {
        const stickersJson = localStorage.getItem('stickers');
        if (stickersJson) {
          const stickers = JSON.parse(stickersJson) as Sticker[];
          const unused = findUnusedStickers(stickers, 30);
          setUnusedCount(unused.length);
        }
      } catch (error) {
        console.warn('Could not check unused stickers:', error);
      }
    };
    
    const updateUsage = () => {
      const used = calculateUsage();
      setStorageUsed(used);
      setIsNearLimit(used > storageQuota * 0.8);
      getLastCleanupDate();
      checkUnusedStickers();
    };
    
    getQuota();
    updateUsage();
    
    // Listen for storage events
    const handleStorageChange = () => {
      updateUsage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval to check periodically
    const interval = setInterval(updateUsage, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [storageQuota]);
  
  if (!visible) return null;
  
  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Format date to relative time
  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  const usagePercentage = (storageUsed / storageQuota) * 100;
  
  return (
    <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md border border-border w-64 z-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Storage Usage</h3>
        </div>
        {isNearLimit && (
          <Badge variant="destructive" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Near Limit
          </Badge>
        )}
      </div>
      
      <Progress 
        value={usagePercentage} 
        className={`h-2 ${isNearLimit ? 'bg-red-200' : 'bg-slate-200'}`} 
      />
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{formatBytes(storageUsed)}</span>
        <span>of {formatBytes(storageQuota)}</span>
      </div>
      
      <div className="mt-3 border-t border-border pt-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="2"/><path d="m7.5 11 2 2L15 8"/></svg>
            </span>
            Last Cleanup:
          </span>
          <span>{formatRelativeTime(lastCleanupDate)}</span>
        </div>
        
        {unusedCount > 0 && (
          <div className="flex items-center justify-between text-xs text-amber-600 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </span>
              Unused Stickers:
            </span>
            <span>{unusedCount}</span>
          </div>
        )}
        
        {onImportStickers && (
          <div className="mt-3 pt-2 border-t border-border">
            <BackupRestoreDialog 
              stickers={stickers} 
              onImportStickers={onImportStickers} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageMonitor;
