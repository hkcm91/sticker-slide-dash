
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface DomainSettingsProps {
  customDomain: string;
  onCustomDomainChange: (value: string) => void;
  onSaveDomainSettings: () => void;
}

const DomainSettings: React.FC<DomainSettingsProps> = ({
  customDomain,
  onCustomDomainChange,
  onSaveDomainSettings
}) => {
  return (
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
            onChange={(e) => onCustomDomainChange(e.target.value)}
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
        <Button onClick={onSaveDomainSettings}>Save Domain Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default DomainSettings;
