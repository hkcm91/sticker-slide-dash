
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface WidgetResourcesProps {
  widgetZipFile: File | null;
  handleWidgetZipChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  widgetLottieFile: File | null;
  handleWidgetLottieChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WidgetResources: React.FC<WidgetResourcesProps> = ({
  widgetZipFile,
  handleWidgetZipChange,
  widgetLottieFile,
  handleWidgetLottieChange
}) => {
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'zip' | 'lottie') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Show visual feedback for file selection
    toast({
      title: `${type === 'zip' ? 'Widget package' : 'Lottie animation'} selected`,
      description: `File: ${file.name} (${Math.round(file.size / 1024)} KB)`,
      duration: 3000,
    });
    
    // Call the appropriate handler
    if (type === 'zip') {
      handleWidgetZipChange(e);
    } else {
      handleWidgetLottieChange(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="widget-zip">Widget Package</Label>
        <div className="flex items-center gap-2">
          <Input
            id="widget-zip"
            type="file"
            onChange={(e) => handleFileUpload(e, 'zip')}
            accept=".zip"
            className="flex-1"
          />
          {widgetZipFile && (
            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md">
              ✓ {widgetZipFile.name} ({Math.round(widgetZipFile.size / 1024)} KB)
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Upload a widget package to completely replace this widget (optional)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="widget-lottie">Widget Lottie Animation</Label>
        <div className="flex items-center gap-2">
          <Input
            id="widget-lottie"
            type="file"
            onChange={(e) => handleFileUpload(e, 'lottie')}
            accept=".json"
            className="flex-1"
          />
          {widgetLottieFile && (
            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md">
              ✓ {widgetLottieFile.name} ({Math.round(widgetLottieFile.size / 1024)} KB)
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Upload a Lottie animation file for this widget (optional)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="widget-dependencies">Dependencies</Label>
        <Textarea
          id="widget-dependencies"
          placeholder="react-chart,axios,lodash"
          className="text-xs"
          rows={2}
        />
        <p className="text-xs text-gray-500">
          Comma-separated list of dependencies required by the widget
        </p>
      </div>
    </div>
  );
};

export default WidgetResources;
