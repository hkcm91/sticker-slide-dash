
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmbedSettingsProps {
  publicUrl: string;
}

const EmbedSettings: React.FC<EmbedSettingsProps> = ({ publicUrl }) => {
  const { toast } = useToast();
  
  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(`<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`);
    toast({
      title: "Embed Code Copied",
      description: "Code copied to clipboard",
      duration: 2000,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Options</CardTitle>
        <CardDescription>Add your dashboard to another website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium">Embed Code</h3>
          <p className="text-sm text-muted-foreground">
            Copy and paste this code into your website's HTML
          </p>
          <div className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code>{`<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`}</code>
          </div>
          <Button variant="outline" onClick={handleCopyEmbedCode} className="w-full">
            <Copy className="h-4 w-4 mr-2" /> Copy Embed Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbedSettings;
