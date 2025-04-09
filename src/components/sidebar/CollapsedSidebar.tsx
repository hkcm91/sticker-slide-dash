
import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CollapsedSidebarProps {
  onToggleSidebar: () => void;
}

const CollapsedSidebar: React.FC<CollapsedSidebarProps> = ({ onToggleSidebar }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <button 
        className="group p-2 focus:outline-none"
        onClick={onToggleSidebar}
        aria-label="Open sticker tray"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-white/80 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
          <ChevronRight size={16} className="text-sticker-purple" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center rotate-12 transform group-hover:rotate-6 transition-transform duration-300">
            <Sparkles size={8} className="text-sticker-purple" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default CollapsedSidebar;
