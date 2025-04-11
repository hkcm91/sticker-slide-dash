
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Share2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardPreviewProps {
  dashboardId: string;
  publicUrl: string;
  onCopyLink: () => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  dashboardId, 
  publicUrl, 
  onCopyLink 
}) => {
  return (
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
        <Button variant="outline" className="w-full" onClick={onCopyLink}>
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
  );
};

export default DashboardPreview;
