
import React, { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import StickerSidebar from './sidebar/StickerSidebar';
import Sticker from './Sticker';
import WidgetModal from './WidgetModal';
import ThemeCustomizer from './ThemeCustomizer';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import pomodoroSticker from '@/widgets/PomodoroSticker';
import { toDoListSticker } from '@/widgets/ToDoListWidget';
import { LightbulbIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Home, Coffee, Sun, Star, BookOpen } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { builtInWidgets, initializeWidgets } from '@/widgets/builtin';
import { getWidgetData, registerWidgetData } from '@/utils/widgetRegistry';

const heartIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>');
const homeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>');
const coffeeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>');
const sunIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>');
const starIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');
const bookIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>');

const builtInWidgetStickers = builtInWidgets.map(widget => widget.sticker);

const initialStickers: StickerType[] = [
  { id: '1', name: 'Heart', icon: heartIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '2', name: 'Home', icon: homeIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '3', name: 'Coffee', icon: coffeeIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '4', name: 'Sun', icon: sunIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '5', name: 'Star', icon: starIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '6', name: 'Book', icon: bookIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  pomodoroSticker,
  toDoListSticker,
  ...builtInWidgetStickers,
];

// Initialize widget data map with default widgets
const initializeWidgetDataMap = () => {
  // Register basic widgets
  registerWidgetData('Heart', 'Heart Widget', 'Track your favorites and loved items.');
  registerWidgetData('Home', 'Home Widget', 'Control your smart home devices.');
  registerWidgetData('Coffee', 'Coffee Widget', 'Find the best coffee shops nearby.');
  registerWidgetData('Sun', 'Sun Widget', 'Check today\'s sunrise and sunset times.');
  registerWidgetData('Star', 'Star Widget', 'View your starred and favorite items.');
  registerWidgetData('Book', 'Book Widget', 'Access your reading list and book notes.');
  registerWidgetData('Pomodoro', 'Pomodoro Timer', 'A simple Pomodoro timer to help you stay focused.');
  registerWidgetData('ToDoList', 'To Do List', 'Keep track of your tasks and to-dos.');
  registerWidgetData('WeatherWidget', 'Weather', 'Check the current weather conditions for your location.');
  registerWidgetData('StockWidget', 'Stock Tracker', 'Monitor stock prices and market trends.');
};

export const addCustomWidget = (name: string, title: string, content: string) => {
  registerWidgetData(name, title, content);
};

const Dashboard = () => {
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [background, setBackground] = useState<string | null>(null);
  const [openWidgets, setOpenWidgets] = useState<Map<string, { sticker: StickerType, isOpen: boolean }>>(new Map());
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [hasSeenHint, setHasSeenHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Initialize widget data map
    initializeWidgetDataMap();
    // Initialize built-in widgets
    initializeWidgets();
    
    const savedStickers = localStorage.getItem('stickers');
    if (savedStickers) {
      setStickers(JSON.parse(savedStickers));
    } else {
      setStickers(initialStickers);
    }
    
    const savedBackground = localStorage.getItem('background');
    if (savedBackground) {
      setBackground(savedBackground);
    }

    const hasSeenHintBefore = localStorage.getItem('hasSeenHint');
    if (hasSeenHintBefore) {
      setHasSeenHint(true);
    } else {
      const timer = setTimeout(() => {
        setShowHint(true);
        setTimeout(() => {
          setShowHint(false);
          setHasSeenHint(true);
          localStorage.setItem('hasSeenHint', 'true');
        }, 5000);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  useEffect(() => {
    if (stickers.length > 0) {
      localStorage.setItem('stickers', JSON.stringify(stickers));
    }
  }, [stickers]);
  
  useEffect(() => {
    if (background) {
      localStorage.setItem('background', background);
    } else {
      localStorage.removeItem('background');
    }
  }, [background]);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
    e.dataTransfer.setData('stickerId', sticker.id);
    setIsRepositioning(sticker.placed);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('stickerId');
    const offsetX = parseInt(e.dataTransfer.getData('offsetX') || '0', 10);
    const offsetY = parseInt(e.dataTransfer.getData('offsetY') || '0', 10);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    
    setStickers(prevStickers => 
      prevStickers.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, position: { x, y }, placed: true } 
          : sticker
      )
    );
    
    if (isRepositioning) {
      toast({
        title: "Sticker repositioned!",
        description: "Your sticker has been moved to a new position.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Sticker placed!",
        description: "Click on the sticker to open the widget. Scroll to resize, R key to rotate, or return it to tray.",
        duration: 3000,
      });
    }
    
    setIsRepositioning(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleStickerClick = (sticker: StickerType) => {
    if (sticker.placed) {
      setOpenWidgets(prev => {
        const newMap = new Map(prev);
        newMap.set(sticker.id, { sticker, isOpen: true });
        return newMap;
      });
    }
  };

  const handleCloseModal = (stickerId: string) => {
    setOpenWidgets(prev => {
      const newMap = new Map(prev);
      newMap.delete(stickerId);
      return newMap;
    });
  };

  const handleBackgroundChange = (url: string | null) => {
    setBackground(url);
  };

  const handleStickerDelete = (sticker: StickerType) => {
    if ((sticker as any).permanentDelete) {
      setStickers(prevStickers => 
        prevStickers.filter(s => s.id !== sticker.id)
      );
      
      toast({
        title: "Sticker permanently deleted",
        description: "The sticker has been completely removed from your collection.",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      setStickers(prevStickers => {
        return prevStickers.map(s => 
          s.id === sticker.id 
            ? { ...s, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 } 
            : s
        );
      });
      
      setOpenWidgets(prev => {
        const newMap = new Map(prev);
        newMap.delete(sticker.id);
        return newMap;
      });
      
      toast({
        title: "Sticker returned to tray!",
        description: "The sticker has been returned to your tray and is available for reuse.",
        duration: 3000,
      });
    }
  };

  const handleUpdateSticker = (updatedSticker: StickerType) => {
    setStickers(prevStickers => 
      prevStickers.map(s => 
        s.id === updatedSticker.id ? updatedSticker : s
      )
    );
    
    setOpenWidgets(prev => {
      if (!prev.has(updatedSticker.id)) return prev;
      
      const newMap = new Map(prev);
      newMap.set(updatedSticker.id, { 
        sticker: updatedSticker, 
        isOpen: prev.get(updatedSticker.id)?.isOpen || false 
      });
      return newMap;
    });
  };

  const handleStickerCreated = (newSticker: StickerType) => {
    setStickers(prevStickers => [...prevStickers, newSticker]);
    
    if (!getWidgetData(newSticker.name)) {
      registerWidgetData(newSticker.name, `${newSticker.name}`, 
        `This is a custom sticker you created. You can connect it to a widget by updating the widgetType property.`
      );
    }
  };

  const handleImportStickers = (importedStickers: StickerType[]) => {
    setStickers(prevStickers => [...prevStickers, ...importedStickers]);
    
    toast({
      title: "Stickers imported!",
      description: `${importedStickers.length} stickers have been added to your collection.`,
      duration: 3000,
    });
  };

  const placedStickers = stickers.filter(sticker => sticker.placed);

  const getBackgroundStyle = () => {
    if (background && theme.backgroundStyle === 'image') {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (theme.backgroundStyle === 'gradient') {
      const { startColor, endColor, direction } = theme.gradientOptions;
      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor})`
      };
    }
    
    return {
      backgroundColor: theme.backgroundColor
    };
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme.mode === 'dark' ? 'dark' : ''}`}>
      <StickerSidebar 
        stickers={stickers} 
        onDragStart={handleDragStart} 
        onStickerClick={handleStickerClick}
        onStickerCreated={handleStickerCreated}
        onStickerDelete={handleStickerDelete}
        onStickerUpdate={handleUpdateSticker}
        onImportStickers={handleImportStickers}
        sidebarStyle={theme.sidebarStyle}
      />
      
      <div 
        className="flex-1 relative overflow-hidden transition-all duration-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={getBackgroundStyle()}
      >
        <div 
          className={`absolute inset-0 ${
            background && theme.backgroundStyle === 'image' ? 'bg-black/10' : 
            theme.mode === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ opacity: theme.backgroundOpacity }}
        >
          {showHint && !hasSeenHint && (
            <div className="absolute bottom-8 right-8 z-10 animate-fade-in">
              <Alert className="w-72 bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg">
                <LightbulbIcon className="h-4 w-4 text-yellow-500 mr-2" />
                <AlertDescription className="text-sm text-gray-700">
                  Drag stickers from the sidebar and drop them here to create your custom dashboard
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <div className="p-6">
            {placedStickers.length === 0 && (
              <div className="h-full flex items-center justify-center opacity-40">
                <div className="text-center text-gray-400">
                  <Sparkles className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                </div>
              </div>
            )}
            
            <div className="mt-6 h-full">
              {placedStickers.map(sticker => (
                <Sticker
                  key={sticker.id}
                  sticker={sticker}
                  onDragStart={handleDragStart}
                  onClick={handleStickerClick}
                  isDraggable={true}
                  onDelete={handleStickerDelete}
                  onUpdate={handleUpdateSticker}
                />
              ))}
            </div>
          </div>
        </div>
        
        <ThemeCustomizer 
          onBackgroundChange={handleBackgroundChange} 
          currentBackground={background} 
        />
      </div>
      
      {Array.from(openWidgets.entries()).map(([id, { sticker, isOpen }]) => {
        const widgetData = getWidgetData(sticker.name);
        if (!widgetData) return null;
        
        return (
          <WidgetModal 
            key={id}
            isOpen={isOpen}
            onClose={() => handleCloseModal(id)}
            sticker={sticker}
            widgetData={widgetData}
          />
        );
      })}
    </div>
  );
};

export default Dashboard;
