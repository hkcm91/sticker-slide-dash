
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ThemeToggle } from './ThemeToggle';
import { Palette, Image, Sun, Upload, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface ThemeCustomizerProps {
  currentBackground: string | null;
  onBackgroundChange: (url: string | null) => void;
}

const ThemeCustomizer = ({ currentBackground, onBackgroundChange }: ThemeCustomizerProps) => {
  const { theme, 
    updateSidebarStyle, 
    updateBackgroundStyle, 
    updateBackgroundColor, 
    updateGradientOptions,
    updateBackgroundOpacity
  } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInputRef, setFileInputRef] = useState<React.RefObject<HTMLInputElement>>(React.createRef());

  const gradientDirections = [
    { value: 'to-r', label: '→' },
    { value: 'to-l', label: '←' },
    { value: 'to-t', label: '↑' },
    { value: 'to-b', label: '↓' },
    { value: 'to-tr', label: '↗' },
    { value: 'to-tl', label: '↖' },
    { value: 'to-br', label: '↘' },
    { value: 'to-bl', label: '↙' },
  ];

  const sidebarStyles = [
    { value: 'default', label: 'Default' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'colorful', label: 'Colorful' },
  ];

  const presetGradients = [
    { start: '#e5deff', end: '#d3e4fd', name: 'Lavender Sky' },
    { start: '#ffdee2', end: '#fde1d3', name: 'Peach Sunset' },
    { start: '#f2fce2', end: '#d3e4fd', name: 'Mint Breeze' },
    { start: '#fef7cd', end: '#fec6a1', name: 'Golden Hour' },
    { start: '#d6bcfa', end: '#9b87f5', name: 'Purple Dream' },
    { start: '#ffc3a0', end: '#ffafbd', name: 'Soft Coral' },
    { start: '#accbee', end: '#e7f0fd', name: 'Cool Blue' },
    { start: '#d299c2', end: '#fef9d7', name: 'Pink Lemonade' },
  ];

  // Background upload functionality
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
        // Ensure we switch to image background style
        updateBackgroundStyle('image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = () => {
    onBackgroundChange(null);
    toast.success('Background removed');
    // Revert to solid color background
    updateBackgroundStyle('solid');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-4 left-4 z-50 rounded-full shadow-md bg-white/90 backdrop-blur-sm"
        >
          <Palette size={18} className="mr-2 text-purple-500" />
          <span className="font-medium">Customize</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top">
        <div className="p-4 border-b">
          <h3 className="font-medium flex items-center">
            <Palette size={16} className="mr-2 text-purple-500" />
            Theme Customizer
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Personalize your sticker dashboard
          </p>
        </div>
        <Tabs defaultValue="appearance">
          <TabsList className="w-full grid grid-cols-3 mt-1">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Mode</h4>
              <ThemeToggle />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Background Opacity</h4>
              <Slider 
                defaultValue={[theme.backgroundOpacity * 100]} 
                max={100} 
                step={5}
                onValueChange={(values) => updateBackgroundOpacity(values[0] / 100)}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {Math.round(theme.backgroundOpacity * 100)}%
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="background" className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Style</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={theme.backgroundStyle === 'solid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => updateBackgroundStyle('solid')}
                  className="w-full"
                >
                  Solid
                </Button>
                <Button 
                  variant={theme.backgroundStyle === 'gradient' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => updateBackgroundStyle('gradient')}
                  className="w-full"
                >
                  Gradient
                </Button>
                <Button 
                  variant={theme.backgroundStyle === 'image' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => updateBackgroundStyle('image')}
                  className="w-full"
                >
                  Image
                </Button>
              </div>
            </div>
            
            {theme.backgroundStyle === 'solid' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Color</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['#ffffff', '#f8f9fa', '#e9ecef', '#f8f0fc', '#e3fafc', '#ebfbee'].map(color => (
                    <button
                      key={color}
                      className={`h-8 rounded-md border ${theme.backgroundColor === color ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateBackgroundColor(color)}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => updateBackgroundColor(e.target.value)}
                  className="w-full h-8 mt-2 cursor-pointer"
                />
              </div>
            )}
            
            {theme.backgroundStyle === 'gradient' && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Gradient Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {presetGradients.map((gradient, i) => (
                    <button
                      key={i}
                      className="h-12 rounded-md transition-transform hover:scale-105"
                      style={{ 
                        background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})` 
                      }}
                      onClick={() => updateGradientOptions({
                        startColor: gradient.start,
                        endColor: gradient.end
                      })}
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Start Color</h4>
                    <input
                      type="color"
                      value={theme.gradientOptions.startColor}
                      onChange={(e) => updateGradientOptions({ startColor: e.target.value })}
                      className="w-full h-8 cursor-pointer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">End Color</h4>
                    <input
                      type="color"
                      value={theme.gradientOptions.endColor}
                      onChange={(e) => updateGradientOptions({ endColor: e.target.value })}
                      className="w-full h-8 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Direction</h4>
                  <div className="grid grid-cols-4 gap-1">
                    {gradientDirections.map((dir) => (
                      <Button
                        key={dir.value}
                        variant={theme.gradientOptions.direction === dir.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateGradientOptions({ direction: dir.value as any })}
                        className="w-full text-lg font-mono"
                      >
                        {dir.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {theme.backgroundStyle === 'image' && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Upload Image</h4>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={triggerFileInput}
                    className="w-full flex items-center justify-center"
                  >
                    <Upload size={16} className="mr-2" />
                    {currentBackground ? 'Change Background' : 'Upload Background'}
                  </Button>
                  
                  {currentBackground && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRemoveBackground}
                      className="w-full flex items-center justify-center text-red-500 hover:text-red-600"
                    >
                      <X size={16} className="mr-2" />
                      Remove Background
                    </Button>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {currentBackground && (
                    <div className="mt-2 relative h-20 rounded-md overflow-hidden border">
                      <img 
                        src={currentBackground} 
                        alt="Current background" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div 
                    className="mt-2 border-2 border-dashed rounded-md p-4 text-center text-sm text-gray-500"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    Drag & drop an image here
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sidebar" className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sidebar Style</h4>
              <div className="grid grid-cols-3 gap-2">
                {sidebarStyles.map((style) => (
                  <Button
                    key={style.value}
                    variant={theme.sidebarStyle === style.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSidebarStyle(style.value as any)}
                    className="w-full"
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
      
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
    </Popover>
  );
};

export default ThemeCustomizer;
