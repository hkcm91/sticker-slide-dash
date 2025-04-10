
import React from 'react';
import { Card } from '@/components/ui/card';
import DebuggingWidget from '@/components/widgets/DebuggingWidget';

interface DebuggingRendererProps {
  className?: string;
  widgetId?: string;
}

const DebuggingRenderer: React.FC<DebuggingRendererProps> = ({ 
  className = '', 
  widgetId 
}) => {
  return (
    <Card className={`overflow-hidden shadow-md ${className}`}>
      <DebuggingWidget />
    </Card>
  );
};

export default DebuggingRenderer;
