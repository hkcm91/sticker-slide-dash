import React, { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import StickerSidebar from './StickerSidebar';
import Sticker from './Sticker';
import WidgetModal from './WidgetModal';
import BackgroundUploader from './BackgroundUploader';
import { useToast } from '@/hooks/use-toast';
import pomodoroSticker from '@/widgets/PomodoroSticker';
import { toDoListSticker } from '@/widgets/ToDoListWidget';

// Import cozy icons from lucide-react
import { Heart, Home, Coffee, Sun, Star, BookOpen } from 'lucide-react';

// Create base64 encoded SVG strings for each icon
// This method doesn't rely on the Lucide React component's render method
const heartIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>');
const homeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>');
const coffeeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>');
const sunIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>');
const starIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');
const bookIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>');

const initialStickers: StickerType[] = [
  { id: '1', name: 'Heart', icon: heartIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '2', name: 'Home', icon: homeIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '3', name: 'Coffee', icon: coffeeIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '4', name: 'Sun', icon: sunIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '5', name: 'Star', icon: starIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '6', name: 'Book', icon: bookIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  pomodoroSticker,
  toDoListSticker,
];

const widgetDataMap: Record<string, WidgetData> = {
  'Heart': { title: 'Heart Widget', content: 'Track your favorites and loved items.' },
  'Home': { title: 'Home Widget', content: 'Control your smart home devices.' },
  'Coffee': { title: 'Coffee Widget', content: 'Find the best coffee shops nearby.' },
  'Sun': { title: 'Sun Widget', content: 'Check today\'s sunrise and sunset times.' },
  'Star': { title: 'Star Widget', content: 'View your starred and favorite items.' },
  'Book': { title: 'Book Widget', content: 'Access your reading list and book notes.' },
  'Pomodoro': { title: 'Pomodoro Timer', content: 'A simple Pomodoro timer to help you stay focused.' },
  'ToDoList': { title: 'To Do List', content: 'Keep track of your tasks and to-dos.' },
};

// Function to add a custom widget to the widget data map
export const addCustomWidget = (name: string, title: string, content: string) => {
  widgetDataMap[name] = { title, content };
};

const Dashboard = () => {
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [background, setBackground] = useState<string | null>(null);
  const [openWidgets, setOpenWidgets] = useState<Map<string, { sticker: StickerType, isOpen: boolean }>>(new Map());
  const [isRepositioning, setIsRepositioning] = useState(false);
  const { toast } = useToast();
  
  // Load stickers and background from localStorage on component mount
  useEffect(() => {
    // Load stickers
    const savedStickers = localStorage.getItem('stickers');
    if (savedStickers) {
      setStickers(JSON.parse(savedStickers));
    } else {
      setStickers(initialStickers);
    }
    
    // Load background
    const savedBackground = localStorage.getItem('background');
    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, []);
  
  // Save stickers to localStorage whenever they change
  useEffect(() => {
    if (stickers.length > 0) {
      localStorage.setItem('stickers', JSON.stringify(stickers));
    }
  }, [stickers]);
  
  // Save background to localStorage whenever it changes
  useEffect(() => {
    if (background) {
      localStorage.setItem('background', background);
    } else {
      localStorage.removeItem('background');
    }
  }, [background]);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
    e.dataTransfer.setData('stickerId', sticker.id);
    // Record if we're repositioning an already placed sticker
    setIsRepositioning(sticker.placed);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('stickerId');
    const offsetX = parseInt(e.dataTransfer.getData('offsetX') || '0', 10);
    const offsetY = parseInt(e.dataTransfer.getData('offsetY') || '0', 10);
    
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate position accounting for the offset
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    
    setStickers(prevStickers => 
      prevStickers.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, position: { x, y }, placed: true } 
          : sticker
      )
    );
    
    // Show different toast messages based on whether we're placing or repositioning
    if (isRepositioning) {
      toast({
        title: "Sticker repositioned!",
        description: "Your sticker has been moved to a new position.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Sticker placed!",
        description: "Click on the sticker to open the widget. Scroll to resize, R key to rotate, or delete it.",
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
      // Add or update the sticker in the openWidgets Map
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

  const handleDeleteSticker = (sticker: StickerType) => {
    // Update the stickers array to mark the sticker as not placed
    setStickers(prevStickers => 
      prevStickers.map(s => 
        s.id === sticker.id 
          ? { ...s, placed: false, position: { x: 0, y: 0 } } 
          : s
      )
    );
    
    // Close the widget if it's open
    setOpenWidgets(prev => {
      const newMap = new Map(prev);
      newMap.delete(sticker.id);
      return newMap;
    });
    
    toast({
      title: "Sticker removed!",
      description: "The sticker has been sent back to the sidebar.",
      duration: 3000,
    });
  };
  
  const handleUpdateSticker = (updatedSticker: StickerType) => {
    setStickers(prevStickers => 
      prevStickers.map(s => 
        s.id === updatedSticker.id ? updatedSticker : s
      )
    );
    
    // Update the sticker in openWidgets if it's there
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

  // Handle the creation of a new custom sticker
  const handleStickerCreated = (newSticker: StickerType) => {
    setStickers(prevStickers => [...prevStickers, newSticker]);
    
    // Add a placeholder widget data for the custom sticker
    if (!widgetDataMap[newSticker.name]) {
      widgetDataMap[newSticker.name] = {
        title: `${newSticker.name}`,
        content: `This is a custom sticker you created. You can connect it to a widget by updating the widgetType property.`
      };
    }
  };

  // Handle permanently deleting a sticker
  const handleStickerDelete = (sticker: StickerType) => {
    // Only custom stickers can be permanently deleted
    if (sticker.isCustom) {
      setStickers(prevStickers => prevStickers.filter(s => s.id !== sticker.id));
      
      // Close the widget if it's open
      setOpenWidgets(prev => {
        const newMap = new Map(prev);
        newMap.delete(sticker.id);
        return newMap;
      });
      
      toast({
        title: "Sticker deleted!",
        description: "The custom sticker has been permanently removed.",
        duration: 3000,
      });
    }
  };

  // Filter stickers that have been placed
  const placedStickers = stickers.filter(sticker => sticker.placed);

  return (
    <div className="flex h-screen overflow-hidden">
      <StickerSidebar 
        stickers={stickers} 
        onDragStart={handleDragStart} 
        onStickerClick={handleStickerClick}
        onStickerCreated={handleStickerCreated}
        onStickerDelete={handleStickerDelete}
        onStickerUpdate={handleUpdateSticker}
      />
      
      <div 
        className="flex-1 relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={background ? {
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className={`absolute inset-0 ${background ? 'bg-black/10' : 'bg-white'}`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Sticker Dashboard</h1>
            <p className="text-gray-600 mb-6">
              {placedStickers.length === 0 
                ? "Drag stickers from the sidebar and drop them here" 
                : "Click on stickers to open widgets, drag to reposition, scroll to resize"}
            </p>
            
            <div className="mt-6 h-full">
              {placedStickers.map(sticker => (
                <Sticker
                  key={sticker.id}
                  sticker={sticker}
                  onDragStart={handleDragStart}
                  onClick={handleStickerClick}
                  isDraggable={true}
                  onDelete={handleDeleteSticker}
                  onUpdate={handleUpdateSticker}
                />
              ))}
            </div>
          </div>
        </div>
        
        <BackgroundUploader 
          onBackgroundChange={handleBackgroundChange} 
          currentBackground={background} 
        />
      </div>
      
      {/* Render multiple widget modals */}
      {Array.from(openWidgets.entries()).map(([id, { sticker, isOpen }]) => {
        const widgetData = widgetDataMap[sticker.name];
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
