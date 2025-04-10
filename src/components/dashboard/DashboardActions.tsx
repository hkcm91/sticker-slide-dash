
import React from 'react';
import { Button } from '../ui/button';
import { Layers } from 'lucide-react';

interface DashboardActionsProps {
  showLayerPanel: boolean;
  toggleLayerPanel: () => void;
}

/**
 * Component for dashboard action buttons like the layer panel toggle
 */
const DashboardActions: React.FC<DashboardActionsProps> = ({
  showLayerPanel,
  toggleLayerPanel
}) => {
  return (
    <Button
      className="absolute bottom-4 right-4 z-50 rounded-full w-10 h-10 p-0 shadow-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
      onClick={toggleLayerPanel}
      title={showLayerPanel ? "Close layer panel" : "Open layer panel (Alt+L)"}
    >
      <Layers className="h-5 w-5" />
    </Button>
  );
};

export default DashboardActions;
