
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Code, Settings, Database, Layers, Shield, PackagePlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  WidgetCodeSettings,
  WidgetPermissions,
  WidgetDataSource,
  WidgetAdvancedConfig,
  WidgetResources
} from './widget-settings';

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
            <WidgetCodeSettings
              showCodeEditor={showCodeEditor}
              setShowCodeEditor={setShowCodeEditor}
              widgetCode={widgetCode}
              setWidgetCode={setWidgetCode}
            />
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
                    <WidgetPermissions
                      permissions={permissions}
                      setPermissions={setPermissions}
                    />
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
                    <WidgetDataSource
                      dataSourceType={dataSourceType}
                      setDataSourceType={setDataSourceType}
                    />
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
                    <WidgetAdvancedConfig />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <WidgetResources
              widgetZipFile={widgetZipFile}
              handleWidgetZipChange={handleWidgetZipChange}
              widgetLottieFile={widgetLottieFile}
              handleWidgetLottieChange={handleWidgetLottieChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StickerWidgetSettings;
