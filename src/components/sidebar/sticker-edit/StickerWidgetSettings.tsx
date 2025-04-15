
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Code, Settings, Database, Layers, Shield, PackagePlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [activeTab, setActiveTab] = useState("code");
  const [dataSourceType, setDataSourceType] = useState("none");
  const [permissions, setPermissions] = useState({
    storage: false,
    network: false,
    notifications: false,
    camera: false,
    location: false
  });

  if (!widgetType) return null;

  return (
    <>
      <Separator className="my-4" />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Widget Settings</h4>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code size={14} />
              Code
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1">
              <Settings size={14} />
              Config
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1">
              <PackagePlus size={14} />
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <ScrollArea className="h-[250px] pr-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="permissions">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-orange-500" />
                      Widget Permissions
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border border-muted bg-muted/10">
                      <CardContent className="pt-4 px-4 pb-2">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-xs font-medium">Storage Access</Label>
                              <p className="text-xs text-muted-foreground">Allow saving and loading data</p>
                            </div>
                            <Switch 
                              checked={permissions.storage} 
                              onCheckedChange={(checked) => setPermissions({...permissions, storage: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-xs font-medium">Network Access</Label>
                              <p className="text-xs text-muted-foreground">Allow external API calls</p>
                            </div>
                            <Switch 
                              checked={permissions.network} 
                              onCheckedChange={(checked) => setPermissions({...permissions, network: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-xs font-medium">Notifications</Label>
                              <p className="text-xs text-muted-foreground">Send notifications to user</p>
                            </div>
                            <Switch 
                              checked={permissions.notifications} 
                              onCheckedChange={(checked) => setPermissions({...permissions, notifications: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-xs font-medium">Camera Access</Label>
                              <p className="text-xs text-muted-foreground">Use device camera</p>
                            </div>
                            <Switch 
                              checked={permissions.camera} 
                              onCheckedChange={(checked) => setPermissions({...permissions, camera: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-xs font-medium">Location</Label>
                              <p className="text-xs text-muted-foreground">Access device location</p>
                            </div>
                            <Switch 
                              checked={permissions.location} 
                              onCheckedChange={(checked) => setPermissions({...permissions, location: checked})}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="datasource">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-blue-500" />
                      Data Source
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border border-muted bg-muted/10">
                      <CardContent className="pt-4 px-4 pb-3">
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="datasource-type" className="text-xs">Data Source Type</Label>
                            <select 
                              id="datasource-type"
                              value={dataSourceType}
                              onChange={(e) => setDataSourceType(e.target.value)}
                              className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="none">None</option>
                              <option value="rest">REST API</option>
                              <option value="graphql">GraphQL</option>
                              <option value="localstorage">Local Storage</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          
                          {dataSourceType === 'rest' && (
                            <div className="space-y-1.5">
                              <Label htmlFor="api-endpoint" className="text-xs">API Endpoint</Label>
                              <Input 
                                id="api-endpoint" 
                                placeholder="https://api.example.com/data" 
                                className="text-xs h-8"
                              />
                            </div>
                          )}
                          
                          {dataSourceType === 'graphql' && (
                            <div className="space-y-1.5">
                              <Label htmlFor="graphql-endpoint" className="text-xs">GraphQL Endpoint</Label>
                              <Input 
                                id="graphql-endpoint" 
                                placeholder="https://api.example.com/graphql" 
                                className="text-xs h-8"
                              />
                            </div>
                          )}
                          
                          {(dataSourceType === 'rest' || dataSourceType === 'graphql') && (
                            <div className="space-y-1.5">
                              <Label htmlFor="auth-type" className="text-xs">Authentication</Label>
                              <select 
                                id="auth-type"
                                className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="none">None</option>
                                <option value="basic">Basic Auth</option>
                                <option value="bearer">Bearer Token</option>
                                <option value="apikey">API Key</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="advanced">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-purple-500" />
                      Advanced Configuration
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-zip">Widget Package</Label>
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
                Upload a widget package to completely replace this widget (optional)
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
            
            <div className="space-y-2">
              <Label htmlFor="widget-dependencies">Dependencies</Label>
              <Textarea
                id="widget-dependencies"
                placeholder="react-chart,axios,lodash"
                className="text-xs"
                rows={2}
              />
              <p className="text-xs text-gray-500">
                Comma-separated list of dependencies required by the widget
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StickerWidgetSettings;
