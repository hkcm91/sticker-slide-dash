
import React from 'react';
import WeatherWidget from '../../WeatherWidget';

interface WeatherRendererProps {
  className?: string;
}

const WeatherRenderer: React.FC<WeatherRendererProps> = ({ className }) => {
  return (
    <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
      <WeatherWidget widgetName="WeatherWidget" />
    </div>
  );
};

export default WeatherRenderer;
