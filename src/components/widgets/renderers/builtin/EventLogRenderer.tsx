
import React from 'react';
import EventLogWidget from '../../EventLogWidget';

interface EventLogRendererProps {
  className?: string;
}

const EventLogRenderer: React.FC<EventLogRendererProps> = ({ className }) => {
  return (
    <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
      <EventLogWidget maxEvents={20} />
    </div>
  );
};

export default EventLogRenderer;
