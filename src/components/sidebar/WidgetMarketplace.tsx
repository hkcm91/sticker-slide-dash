import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, ShoppingCart } from 'lucide-react';
import { Sticker } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';
import { getAllWidgets, getFreeWidgets, getPremiumWidgets } from '@/lib/widgetSystem';
import { createDebuggingWidgetSticker } from '@/widgets/builtin';

interface WidgetMarketplaceProps {
  onAddSticker: (sticker: Sticker) => void;
}

const WidgetMarketplace: React.FC<WidgetMarketplaceProps> = ({ onAddSticker }) => {
  const [purchasedWidgetIds, setPurchasedWidgetIds] = useState<string[]>([]);
  const [freeWidgets, setFreeWidgets] = useState<any[]>([]);
  const [premiumWidgets, setPremiumWidgets] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get widgets from the widget system
    setFreeWidgets(getFreeWidgets());
    setPremiumWidgets(getPremiumWidgets());
  }, []);
  
  const handleAddFreeWidget = (widget: any) => {
    onAddSticker(widget.sticker);
    
    toast({
      title: "Widget added!",
      description: `${widget.displayName} has been added to your sticker collection.`,
      duration: 3000,
    });
  };
  
  const handlePurchaseWidget = (widget: any) => {
    // In a real app, this would open a payment flow
    // For now, we'll just simulate a successful purchase
    
    setPurchasedWidgetIds(prev => [...prev, widget.id]);
    
    // Add the widget to the user's collection
    const purchasedSticker: Sticker = {
      ...widget.sticker,
      id: `purchased_${widget.id}_${Date.now()}`,
      purchasedOn: new Date().toISOString(),
    };
    
    onAddSticker(purchasedSticker);
    
    toast({
      title: "Widget purchased!",
      description: `Thank you for purchasing ${widget.displayName}. It has been added to your collection.`,
      duration: 3000,
    });
  };
  
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Free Widgets</h3>
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-1 gap-3">
            {freeWidgets.map(widget => (
              <div 
                key={widget.id} 
                className="p-3 bg-white/90 rounded-lg shadow-sm border border-gray-100 flex items-center"
              >
                <div className="flex-shrink-0 mr-3 h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <img 
                    src={widget.sticker.icon} 
                    alt={widget.displayName} 
                    className="h-10 w-10 object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{widget.displayName}</h4>
                  <p className="text-sm text-gray-500 truncate">{widget.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddFreeWidget(widget)}
                >
                  Add
                </Button>
              </div>
            ))}
            {freeWidgets.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No free widgets available
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Premium Widgets</h3>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
            PRO
          </Badge>
        </div>
        <ScrollArea className="h-[240px]">
          <div className="grid grid-cols-1 gap-3">
            {premiumWidgets.map(widget => {
              const isPurchased = purchasedWidgetIds.includes(widget.id);
              
              return (
                <div 
                  key={widget.id} 
                  className="p-3 bg-white/90 rounded-lg shadow-sm border border-purple-100 flex items-center"
                >
                  <div className="flex-shrink-0 mr-3 h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <img 
                      src={widget.sticker.icon} 
                      alt={widget.displayName} 
                      className="h-10 w-10 object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{widget.displayName}</h4>
                    <p className="text-sm text-gray-500 truncate">{widget.description}</p>
                  </div>
                  {isPurchased ? (
                    <Button variant="outline" size="sm" onClick={() => handleAddFreeWidget(widget)}>
                      Add
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => handlePurchaseWidget(widget)}
                    >
                      <ShoppingCart className="mr-1 h-3 w-3" />
                      ${widget.price?.toFixed(2)}
                    </Button>
                  )}
                </div>
              );
            })}
            {premiumWidgets.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No premium widgets available
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default WidgetMarketplace;
