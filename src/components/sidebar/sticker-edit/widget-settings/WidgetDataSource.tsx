
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card";

interface WidgetDataSourceProps {
  dataSourceType: string;
  setDataSourceType: (type: string) => void;
}

const WidgetDataSource: React.FC<WidgetDataSourceProps> = ({
  dataSourceType,
  setDataSourceType
}) => {
  return (
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
  );
};

export default WidgetDataSource;
