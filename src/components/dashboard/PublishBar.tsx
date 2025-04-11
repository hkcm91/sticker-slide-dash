
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Globe, Lock, Share2, Settings } from 'lucide-react';

interface PublishBarProps {
  dashboardId: string;
}

const PublishBar: React.FC<PublishBarProps> = ({ dashboardId }) => {
  const { toast } = useToast();
  const [isPublished, setIsPublished] = useState(true);
  
  const handleTogglePublish = () => {
    const newState = !isPublished;
    setIsPublished(newState);
    
    toast({
      title: newState ? "Dashboard Published" : "Dashboard Unpublished",
      description: newState 
        ? "Your dashboard is now publicly accessible" 
        : "Your dashboard is now private",
      duration: 3000,
    });
  };
  
  const handleShareDashboard = () => {
    navigator.clipboard.writeText(`https://stickerdash.io/view/${dashboardId}`);
    
    toast({
      title: "Link Copied",
      description: "Dashboard URL copied to clipboard",
      duration: 2000,
    });
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card border rounded-lg shadow-md p-1">
      <Button
        variant={isPublished ? "default" : "outline"}
        size="sm"
        onClick={handleTogglePublish}
        className="gap-1"
      >
        {isPublished ? (
          <>
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Published</span>
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Private</span>
          </>
        )}
      </Button>
      
      {isPublished && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareDashboard}
            className="gap-1"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1"
          >
            <Link to={`/view/${dashboardId}`}>
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Link>
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        size="sm"
        asChild
        className="gap-1"
      >
        <Link to={`/publish/${dashboardId}`}>
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </Button>
    </div>
  );
};

export default PublishBar;
