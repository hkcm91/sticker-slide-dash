
import React from 'react';

interface GenericWidgetProps {
  title?: string;
  content?: string;
}

const GenericWidget: React.FC<GenericWidgetProps> = ({ title, content }) => {
  return (
    <div className="bg-background rounded-lg p-4 w-full">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {content && <p>{content}</p>}
    </div>
  );
};

export default GenericWidget;
