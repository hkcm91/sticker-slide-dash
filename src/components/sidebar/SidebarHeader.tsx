
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles } from 'lucide-react';

interface SidebarHeaderProps {
  onToggleSidebar: () => void;
  className?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onToggleSidebar, className }) => {
  return (
    <div className={`p-4 flex items-center justify-between ${className}`}>
      <h2 className="font-bold text-sm text-white flex items-center">
        <Sparkles size={16} className="mr-2 animate-pulse" />
        <span className="tracking-wide">Stickers</span>
      </h2>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full bg-white/20 text-white hover:bg-white/30"
        onClick={onToggleSidebar}
      >
        <ChevronLeft size={16} />
      </Button>
    </div>
  );
};

export default SidebarHeader;
