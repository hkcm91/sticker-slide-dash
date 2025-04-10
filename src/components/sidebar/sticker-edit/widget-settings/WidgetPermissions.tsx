
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface PermissionsState {
  storage: boolean;
  network: boolean;
  notifications: boolean;
  camera: boolean;
  location: boolean;
}

interface WidgetPermissionsProps {
  permissions: PermissionsState;
  setPermissions: (permissions: PermissionsState) => void;
}

const WidgetPermissions: React.FC<WidgetPermissionsProps> = ({
  permissions,
  setPermissions
}) => {
  return (
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
  );
};

export default WidgetPermissions;
