
import React, { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import StickerSidebar from './StickerSidebar';
import Sticker from './Sticker';
import WidgetModal from './WidgetModal';
import BackgroundUploader from './BackgroundUploader';
import { useToast } from '@/hooks/use-toast';

// Import our custom icons
import analyticsIcon from '../assets/icons/analytics-icon.svg';
import calendarIcon from '../assets/icons/calendar-icon.svg';
import weatherIcon from '../assets/icons/weather-icon.svg';
import notesIcon from '../assets/icons/notes-icon.svg';
import tasksIcon from '../assets/icons/tasks-icon.svg';
import chartIcon from '../assets/icons/chart-icon.svg';

const initialStickers: StickerType[] = [
  { id: '1', name: 'Analytics', icon: analyticsIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '2', name: 'Calendar', icon: calendarIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '3', name: 'Weather', icon: weatherIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '4', name: 'Notes', icon: notesIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '5', name: 'Tasks', icon: tasksIcon, position: { x: 0, y: 0 }, placed: false },
  { id: '6', name: 'Chart', icon: chartIcon, position: { x: 0, y: 0 }, placed: false },
];

const widgetDataMap: Record<string, WidgetData> = {
  'Analytics': { title: 'Analytics Widget', content: 'Here you can view your analytics data.' },
  'Calendar': { title: 'Calendar Widget', content: 'Plan your schedule and manage events.' },
  'Weather': { title: 'Weather Widget', content: 'Check the latest weather forecast.' },
  'Notes': { title: 'Notes Widget', content: 'Keep track of your ideas and notes.' },
  'Tasks': { title: 'Tasks Widget', content: 'Manage your to-do list and track progress.' },
  'Chart': { title: 'Chart Widget', content: 'Visualize your data with interactive charts.' },
};

const Dashboard = () => {
  const [stickers, setStickers] = useState<StickerType[]>(initialStickers);
  const [background, setBackground] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSticker, setActiveSticker] = useState<StickerType | null>(null);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const { toast } = useToast();
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
    e.dataTransfer.setData('stickerId', sticker.id);
    // Record if we're repositioning an already placed sticker
    setIsRepositioning(sticker.placed);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('stickerId');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
        description: "Click on the sticker to open the widget.",
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
      setActiveSticker(sticker);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveSticker(null);
  };

  const handleBackgroundChange = (url: string | null) => {
    setBackground(url);
  };

  // Get the widget data for the active sticker
  const activeWidgetData = activeSticker ? widgetDataMap[activeSticker.name] : null;

  // Filter stickers that have been placed
  const placedStickers = stickers.filter(sticker => sticker.placed);

  return (
    <div className="flex h-screen overflow-hidden">
      <StickerSidebar 
        stickers={stickers} 
        onDragStart={handleDragStart} 
        onStickerClick={handleStickerClick} 
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
                : "Click on stickers to open widgets, drag to reposition"}
            </p>
            
            <div className="mt-6 h-full">
              {placedStickers.map(sticker => (
                <Sticker
                  key={sticker.id}
                  sticker={sticker}
                  onDragStart={handleDragStart}
                  onClick={handleStickerClick}
                  isDraggable={true}  // Make placed stickers draggable
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
      
      <WidgetModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        sticker={activeSticker} 
        widgetData={activeWidgetData} 
      />
    </div>
  );
};

export default Dashboard;
