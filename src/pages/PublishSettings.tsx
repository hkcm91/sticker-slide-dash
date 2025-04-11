
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Globe, Lock, Share2, QrCode, Eye } from 'lucide-react';

const PublishSettings = () => {
  const { dashboardId } = useParams();
  const { toast } = useToast();
  const [isPublished, setIsPublished] = useState(true);
  const [visibility, setVisibility] = useState('public');
  const [customDomain, setCustomDomain] = useState('');
  const [customPath, setCustomPath] = useState('my-dashboard');
  
  // Generate a sample public URL
  const publicUrl = `https://stickerdash.io/${customPath || dashboardId}`;
  
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
                    <Switch checked={isPublished} onCheckedChange={handlePublishToggle} />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Visibility</h3>
                    <RadioGroup value={visibility} onValueChange={setVisibility}>
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
                        onChange={(e) => setCustomPath(e.target.value)}
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
                  <Button variant="outline">Reset</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="domain" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Domain</CardTitle>
                  <CardDescription>Connect your own domain to your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="custom-domain">Custom Domain</Label>
                    <Input 
                      id="custom-domain" 
                      value={customDomain} 
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="dashboard.yourdomain.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a subdomain or root domain you own
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">DNS Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Add these records to your domain's DNS settings:
                    </p>
                    <div className="bg-muted p-4 rounded-md text-sm">
                      <div className="mb-2">
                        <span className="font-bold">Type:</span> CNAME<br />
                        <span className="font-bold">Name:</span> {customDomain ? customDomain.split('.')[0] : 'dashboard'}<br />
                        <span className="font-bold">Value:</span> proxy.stickerdash.io<br />
                        <span className="font-bold">TTL:</span> Automatic
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveDomainSettings}>Save Domain Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="embed" className="mt-6">
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
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(`<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`);
                      toast({
                        title: "Embed Code Copied",
                        description: "Code copied to clipboard",
                        duration: 2000,
                      });
                    }} className="w-full">
                      <Copy className="h-4 w-4 mr-2" /> Copy Embed Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Preview</CardTitle>
              <CardDescription>How your published dashboard appears</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Dashboard Preview</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/view/${dashboardId}`}>
                  <Eye className="h-4 w-4 mr-2" /> Preview Dashboard
                </Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" /> Copy Dashboard Link
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" /> Share Dashboard
              </Button>
              <Button variant="outline" className="w-full">
                <QrCode className="h-4 w-4 mr-2" /> Generate QR Code
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublishSettings;
