
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LightbulbIcon } from 'lucide-react';

const DashboardHint: React.FC = () => {
  return (
    <div className="absolute bottom-8 right-8 z-10 animate-fade-in">
      <Alert className="w-72 bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg">
        <LightbulbIcon className="h-4 w-4 text-yellow-500 mr-2" />
        <AlertDescription className="text-sm text-gray-700">
          Drag stickers from the sidebar and drop them here to create your custom dashboard
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DashboardHint;
