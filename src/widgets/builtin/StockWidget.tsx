
import React from 'react';
import { registerWidgetModule } from '@/lib/widgetSystem';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Stock widget state
interface StockState {
  symbol: string;
  price: number;
  change: number;
  lastUpdated: string;
}

// Initial state
const initialState: StockState = {
  symbol: 'AAPL',
  price: 145.85,
  change: 2.34,
  lastUpdated: new Date().toISOString()
};

// Stock widget actions
const stockActions = {
  updateSymbol: (state: StockState, payload: string) => {
    return { 
      ...state, 
      symbol: payload,
      lastUpdated: new Date().toISOString()
    };
  },
  
  refreshStock: (state: StockState) => {
    // In a real widget, this would fetch real stock data
    const basePrice = state.price;
    const randomChange = (Math.random() * 10 - 5).toFixed(2);
    const newPrice = (basePrice + parseFloat(randomChange)).toFixed(2);
    
    return {
      ...state,
      price: parseFloat(newPrice),
      change: parseFloat(randomChange),
      lastUpdated: new Date().toISOString()
    };
  }
};

// Stock widget UI component
export const StockWidgetUI: React.FC<{ widgetState: StockState }> = ({ widgetState }) => {
  const isPositive = widgetState.change >= 0;
  
  return (
    <div className="p-4 rounded-lg bg-white/90 backdrop-blur-sm shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{widgetState.symbol}</h3>
        {isPositive ? (
          <TrendingUp className="h-6 w-6 text-green-500" />
        ) : (
          <TrendingDown className="h-6 w-6 text-red-500" />
        )}
      </div>
      
      <div className="text-3xl font-bold mb-2">
        ${widgetState.price.toFixed(2)}
      </div>
      
      <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : ''}{widgetState.change.toFixed(2)} ({isPositive ? '+' : ''}
        {((widgetState.change / (widgetState.price - widgetState.change)) * 100).toFixed(2)}%)
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        Last updated: {new Date(widgetState.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

// Create and register the Stock widget
const stockWidgetIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>');

export const stockWidget = registerWidgetModule({
  name: 'StockWidget',
  displayName: 'Stock Tracker',
  description: 'Monitor stock prices and trends',
  category: 'Finance',
  version: '1.0.0',
  author: 'Stickers App',
  icon: stockWidgetIcon,
  isPremium: true,
  price: 4.99,
  state: initialState,
  actions: stockActions,
});

export default stockWidget;
