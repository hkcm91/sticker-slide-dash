
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Code } from 'lucide-react';

interface StickerWidgetSettingsProps {
  widgetType?: string;
  showCodeEditor: boolean;
  setShowCodeEditor: (show: boolean) => void;
  widgetCode: string;
  setWidgetCode: (code: string) => void;
  widgetZipFile: File | null;
  handleWidgetZipChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  widgetLottieFile: File | null;
  handleWidgetLottieChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StickerWidgetSettings: React.FC<StickerWidgetSettingsProps> = ({
  widgetType,
  showCodeEditor,
  setShowCodeEditor,
  widgetCode,
  setWidgetCode,
  widgetZipFile,
  handleWidgetZipChange,
  widgetLottieFile,
  handleWidgetLottieChange
}) => {
  if (!widgetType) return null;

  return (
    <>
      <Separator className="my-4" />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Widget Settings</h4>
        
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
        
        <div className="space-y-2">
          <Label htmlFor="widget-zip">Replace Widget Package</Label>
          <div className="flex items-center gap-2">
            <Input
              id="widget-zip"
              type="file"
              onChange={handleWidgetZipChange}
              accept=".zip"
              className="flex-1"
            />
            {widgetZipFile && (
              <div className="text-xs text-green-600">
                ✓ {widgetZipFile.name}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Upload a new widget package to completely replace this widget (optional)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="widget-lottie">Widget Lottie Animation</Label>
          <div className="flex items-center gap-2">
            <Input
              id="widget-lottie"
              type="file"
              onChange={handleWidgetLottieChange}
              accept=".json"
              className="flex-1"
            />
            {widgetLottieFile && (
              <div className="text-xs text-green-600">
                ✓ {widgetLottieFile.name}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Upload a Lottie animation file for this widget (optional)
          </p>
        </div>
      </div>
    </>
  );
};

export default StickerWidgetSettings;
