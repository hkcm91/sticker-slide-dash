import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Plus, Rocket, Eye, Settings } from 'lucide-react';

const Home = () => {
  // Mock data - in a real app this would come from a database
  const dashboards = [
    {
      id: '1',
      name: 'My Primary Dashboard',
      description: 'Interactive sticker dashboard with draggable widgets',
      lastEdited: '2025-04-10T15:30:00Z',
      isPublished: true,
      publishedUrl: '/view/1',
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      description: 'Monitor metrics and KPIs',
      lastEdited: '2025-04-08T12:15:00Z',
      isPublished: false,
    },
  ];

  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboards</h1>
          <p className="text-muted-foreground mt-1">Manage and publish your interactive dashboards</p>
        </div>
        <Button asChild>
          <Link to="/create-dashboard"><Plus className="mr-2 h-4 w-4" /> Create New</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current dashboard card */}
        <Card className="border-2 border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">My Primary Dashboard</CardTitle>
              <Badge className="bg-green-600">Active</Badge>
            </div>
            <CardDescription>Interactive sticker dashboard with draggable widgets</CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LayoutDashboard className="h-4 w-4" />
              <span>Last edited: {new Date('2025-04-10T15:30:00Z').toLocaleDateString()}</span>
            </div>
            {dashboards[0].isPublished && (
              <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                <Rocket className="h-4 w-4" />
                <span>Published</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild variant="default" className="flex-1">
              <Link to="/"><LayoutDashboard className="mr-2 h-4 w-4" /> Edit</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/view/1"><Eye className="mr-2 h-4 w-4" /> View</Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link to="/publish/1"><Settings className="h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Other dashboards */}
        {dashboards.filter((_, index) => index > 0).map(dashboard => (
          <Card key={dashboard.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{dashboard.name}</CardTitle>
                {dashboard.isPublished && <Badge className="bg-green-600">Published</Badge>}
              </div>
              <CardDescription>{dashboard.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LayoutDashboard className="h-4 w-4" />
                <span>Last edited: {new Date(dashboard.lastEdited).toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to={`/dashboard/${dashboard.id}`}><LayoutDashboard className="mr-2 h-4 w-4" /> Edit</Link>
              </Button>
              {dashboard.isPublished && (
                <Button asChild variant="outline" className="flex-1">
                  <Link to={dashboard.publishedUrl}><Eye className="mr-2 h-4 w-4" /> View</Link>
                </Button>
              )}
              <Button asChild variant="outline" size="icon">
                <Link to={`/publish/${dashboard.id}`}><Settings className="h-4 w-4" /></Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Create new dashboard card */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors flex flex-col items-center justify-center h-[250px]">
          <Link to="/create-dashboard" className="flex flex-col items-center justify-center p-6 h-full w-full">
            <div className="rounded-full bg-primary/10 p-3 mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-1">Create New Dashboard</h3>
            <p className="text-muted-foreground text-sm text-center">Start with a blank canvas or use a template</p>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Home;
