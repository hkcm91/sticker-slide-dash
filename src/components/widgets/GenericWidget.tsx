
import React from 'react';
import { cn } from '@/lib/utils';

interface GenericWidgetProps {
  title?: string;
  content?: string;
  className?: string;
  contentClassName?: string;
}

const GenericWidget: React.FC<GenericWidgetProps> = ({ 
  title, 
  content, 
  className,
  contentClassName 
}) => {
  return (
    <div className={cn("bg-background rounded-lg p-4 w-full", className)}>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {content && <p className={cn("text-sm text-muted-foreground", contentClassName)}>{content}</p>}
    </div>
  );
};

export default GenericWidget;
