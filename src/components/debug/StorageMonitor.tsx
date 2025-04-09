
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, HardDrive } from 'lucide-react';

interface StorageMonitorProps {
  visible?: boolean;
}

const StorageMonitor: React.FC<StorageMonitorProps> = ({ visible = false }) => {
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(5 * 1024 * 1024); // Default to 5MB
  const [isNearLimit, setIsNearLimit] = useState(false);
  
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
    
    const updateUsage = () => {
      const used = calculateUsage();
      setStorageUsed(used);
      setIsNearLimit(used > storageQuota * 0.8);
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
    </div>
  );
};

export default StorageMonitor;
