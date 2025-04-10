
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import PomodoroWidgetUI from '../../PomodoroWidget';

interface PomodoroRendererProps {
  className?: string;
}

const PomodoroRenderer: React.FC<PomodoroRendererProps> = ({ className }) => {
  return (
    <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
      <PomodoroWidgetUI widgetName="Pomodoro" />
    </div>
  );
};

export default PomodoroRenderer;
