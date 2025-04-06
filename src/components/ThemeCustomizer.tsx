
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ThemeToggle } from './ThemeToggle';
import { Palette, Image, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const ThemeCustomizer = () => {
  const { theme, 
    updateSidebarStyle, 
    updateBackgroundStyle, 
    updateBackgroundColor, 
    updateGradientOptions,
    updateBackgroundOpacity
  } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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
  ];

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
              <div className="text-sm text-muted-foreground">
                <p>Use the background uploader in the bottom right of your dashboard to set an image.</p>
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
    </Popover>
  );
};

export default ThemeCustomizer;
