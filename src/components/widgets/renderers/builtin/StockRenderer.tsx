
import React from 'react';
import StockWidget from '../../StockWidget';

interface StockRendererProps {
  className?: string;
}

const StockRenderer: React.FC<StockRendererProps> = ({ className }) => {
  return (
    <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`}>
      <StockWidget widgetName="StockWidget" />
    </div>
  );
};

export default StockRenderer;
