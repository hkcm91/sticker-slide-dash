
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from "@/components/ui/card";

const WidgetAdvancedConfig: React.FC = () => {
  return (
    <Card className="border border-muted bg-muted/10">
      <CardContent className="pt-4 px-4 pb-3">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="config-schema" className="text-xs">Widget Configuration Schema</Label>
            <Textarea
              id="config-schema"
              placeholder={`{
  "properties": {
    "displayMode": {
      "type": "string",
      "enum": ["light", "dark", "auto"]
    },
    "refreshInterval": {
      "type": "number",
      "minimum": 1
    }
  }
}`}
              className="font-mono text-xs"
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              JSON Schema for widget configuration options
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WidgetAdvancedConfig;
