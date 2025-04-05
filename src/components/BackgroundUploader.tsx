
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface BackgroundUploaderProps {
  onBackgroundChange: (url: string | null) => void;
  currentBackground: string | null;
}

const BackgroundUploader = ({ onBackgroundChange, currentBackground }: BackgroundUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        onBackgroundChange(e.target.result);
        toast.success('Background updated successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = () => {
    onBackgroundChange(null);
    toast.success('Background removed');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute bottom-4 right-4 z-30">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white shadow-md"
          onClick={triggerFileInput}
        >
          <Upload size={16} className="mr-2" />
          {currentBackground ? 'Change' : 'Upload'} Background
        </Button>
        
        {currentBackground && (
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white shadow-md"
            onClick={handleRemoveBackground}
          >
            <X size={16} className="mr-2" />
            Remove
          </Button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {isDragging && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium">Drop your image here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundUploader;
