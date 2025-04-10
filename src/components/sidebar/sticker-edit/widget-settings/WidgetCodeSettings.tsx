
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code } from 'lucide-react';

interface WidgetCodeSettingsProps {
  showCodeEditor: boolean;
  setShowCodeEditor: (show: boolean) => void;
  widgetCode: string;
  setWidgetCode: (code: string) => void;
}

const WidgetCodeSettings: React.FC<WidgetCodeSettingsProps> = ({
  showCodeEditor,
  setShowCodeEditor,
  widgetCode,
  setWidgetCode
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="widget-code">Widget Code</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowCodeEditor(!showCodeEditor)}
          className="flex items-center gap-1"
        >
          <Code size={14} />
          {showCodeEditor ? "Hide Code" : "Edit Code"}
        </Button>
      </div>
      
      {showCodeEditor && (
        <Textarea
          id="widget-code"
          value={widgetCode}
          onChange={(e) => setWidgetCode(e.target.value)}
          className="font-mono text-xs"
          placeholder={`// Define your widget actions
{
  increment: (state) => ({ ...state, count: (state.count || 0) + 1 }),
  decrement: (state) => ({ ...state, count: (state.count || 0) - 1 }),
  reset: (state) => ({ ...state, count: 0 })
}`}
          rows={8}
        />
      )}
    </div>
  );
};

export default WidgetCodeSettings;
