
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sticker } from '@/types/stickers';

interface BackupRestoreDialogProps {
  stickers: Sticker[];
  onImportStickers: (stickers: Sticker[]) => void;
}

const BackupRestoreDialog: React.FC<BackupRestoreDialogProps> = ({ stickers, onImportStickers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleExportData = () => {
    try {
      // Create a backup object with all needed data
      const backupData = {
        stickers,
        version: "1.0",
        exportDate: new Date().toISOString()
      };
      
      // Convert to JSON string
      const jsonData = JSON.stringify(backupData, null, 2);
      
      // Create a Blob with the JSON data
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sticker-book-backup-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Record last cleanup date
      localStorage.setItem('lastStickerCleanup', new Date().toISOString());
      
      toast({
        title: "Backup successful",
        description: "Your sticker collection has been backed up successfully.",
      });
    } catch (error) {
      toast({
        title: "Backup failed",
        description: "There was an error creating your backup.",
        variant: "destructive",
      });
      console.error("Backup failed:", error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate the data structure
        if (!importedData.stickers || !Array.isArray(importedData.stickers)) {
          throw new Error("Invalid backup format: stickers array not found");
        }
        
        // Import the stickers
        onImportStickers(importedData.stickers);
        
        // Record last cleanup date
        localStorage.setItem('lastStickerCleanup', new Date().toISOString());
        
        toast({
          title: "Restore successful",
          description: `Imported ${importedData.stickers.length} stickers successfully.`,
        });
        
        setIsOpen(false);
      } catch (error) {
        toast({
          title: "Restore failed",
          description: "The backup file appears to be invalid or corrupted.",
          variant: "destructive",
        });
        console.error("Restore failed:", error);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Download size={14} />
          <span>Backup & Restore</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Backup & Restore</DialogTitle>
          <DialogDescription>
            Save your sticker collection or restore from a previous backup.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <h3 className="text-sm font-medium">Backup Data</h3>
            <p className="text-sm text-gray-600">
              Download a copy of your sticker collection to keep it safe.
            </p>
            <Button 
              onClick={handleExportData} 
              className="flex items-center gap-2"
            >
              <Download size={16} />
              <span>Download Backup</span>
            </Button>
          </div>

          <div className="grid gap-3">
            <h3 className="text-sm font-medium">Restore Data</h3>
            <p className="text-sm text-gray-600">
              Restore your sticker collection from a backup file.
            </p>
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-700">
                Restoring will replace your current collection with the backed up data.
              </AlertDescription>
            </Alert>
            <div>
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <Button 
                onClick={() => document.getElementById('import-file')?.click()}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                <span>Upload Backup File</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackupRestoreDialog;
