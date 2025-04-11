
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { 
  GeneralSettings, 
  DomainSettings, 
  EmbedSettings, 
  DashboardPreview 
} from '@/components/publish';

const PublishSettings = () => {
  const { dashboardId } = useParams();
  const { toast } = useToast();
  
  // State management
  const [isPublished, setIsPublished] = useState(true);
  const [visibility, setVisibility] = useState('public');
  const [customDomain, setCustomDomain] = useState('');
  const [customPath, setCustomPath] = useState('my-dashboard');
  
  // Generate a sample public URL
  const publicUrl = `https://stickerdash.io/${customPath || dashboardId}`;
  
  // Event handlers
  const handlePublishToggle = (checked: boolean) => {
    setIsPublished(checked);
    
    toast({
      title: checked ? "Dashboard Published" : "Dashboard Unpublished",
      description: checked 
        ? "Your dashboard is now live and accessible via its public URL" 
        : "Your dashboard is now private and no longer accessible",
      duration: 3000,
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    
    toast({
      title: "Link Copied",
      description: "Dashboard URL copied to clipboard",
      duration: 2000,
    });
  };
  
  const handleSaveDomainSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your custom domain settings have been updated",
      duration: 2000,
    });
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboards
        </Link>
        <h1 className="text-3xl font-bold">Publish Settings</h1>
        <p className="text-muted-foreground mt-1">Control how your dashboard is shared with others</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="domain">Domain</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-6">
              <GeneralSettings 
                isPublished={isPublished}
                visibility={visibility}
                customPath={customPath}
                onPublishToggle={handlePublishToggle}
                onVisibilityChange={setVisibility}
                onCustomPathChange={setCustomPath}
              />
            </TabsContent>
            
            <TabsContent value="domain" className="mt-6">
              <DomainSettings 
                customDomain={customDomain}
                onCustomDomainChange={setCustomDomain}
                onSaveDomainSettings={handleSaveDomainSettings}
              />
            </TabsContent>
            
            <TabsContent value="embed" className="mt-6">
              <EmbedSettings publicUrl={publicUrl} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <DashboardPreview 
            dashboardId={dashboardId || ''}
            publicUrl={publicUrl}
            onCopyLink={handleCopyLink}
          />
        </div>
      </div>
    </div>
  );
};

export default PublishSettings;
