
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneralSettingsProps {
  isPublished: boolean;
  visibility: string;
  customPath: string;
  onPublishToggle: (checked: boolean) => void;
  onVisibilityChange: (value: string) => void;
  onCustomPathChange: (value: string) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  isPublished,
  visibility,
  customPath,
  onPublishToggle,
  onVisibilityChange,
  onCustomPathChange
}) => {
  const { toast } = useToast();
  
  const handleReset = () => {
    onCustomPathChange('');
    toast({
      title: "Settings Reset",
      description: "Your custom settings have been reset to default",
      duration: 2000,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Options</CardTitle>
        <CardDescription>Control whether your dashboard is publicly available</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Publish Dashboard</h3>
            <p className="text-sm text-muted-foreground">Make your dashboard available to others</p>
          </div>
          <Switch checked={isPublished} onCheckedChange={onPublishToggle} />
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="font-medium">Visibility</h3>
          <RadioGroup value={visibility} onValueChange={onVisibilityChange}>
            <div className="flex items-start space-x-3 space-y-0 mb-4">
              <RadioGroupItem value="public" id="public" />
              <div className="grid gap-1.5">
                <Label htmlFor="public" className="font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Public
                </Label>
                <p className="text-sm text-muted-foreground">
                  Anyone with the link can view this dashboard
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="private" id="private" />
              <div className="grid gap-1.5">
                <Label htmlFor="private" className="font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Private
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only you can access this dashboard
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="custom-path">Custom URL Path</Label>
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>
          <div className="flex space-x-2">
            <div className="flex-grow flex items-center border rounded-md px-3 bg-muted">
              <span className="text-sm text-muted-foreground">stickerdash.io/</span>
            </div>
            <Input 
              id="custom-path" 
              value={customPath} 
              onChange={(e) => onCustomPathChange(e.target.value)}
              placeholder="my-dashboard"
              className="flex-grow"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Use lowercase letters, numbers, and hyphens only
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default GeneralSettings;
