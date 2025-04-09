
import { Widget, getAllWidgets, getWidget } from './widgetSystem';
import { Sticker } from '@/types/stickers';

// Interface for widget purchase
export interface WidgetPurchase {
  widgetId: string;
  userId: string;
  purchaseDate: string;
  transactionId: string;
  amount: number;
}

// Mock user purchases (in a real app this would be in a database)
const userPurchases: WidgetPurchase[] = [];

/**
 * Checks if a user has purchased a specific widget
 */
export function hasUserPurchasedWidget(userId: string, widgetId: string): boolean {
  return userPurchases.some(purchase => 
    purchase.userId === userId && purchase.widgetId === widgetId
  );
}

/**
 * Gets all widgets available in the marketplace
 */
export function getMarketplaceWidgets(): Widget[] {
  return getAllWidgets();
}

/**
 * Gets widgets purchased by a specific user
 */
export function getUserPurchasedWidgets(userId: string): Widget[] {
  const purchasedIds = userPurchases
    .filter(purchase => purchase.userId === userId)
    .map(purchase => purchase.widgetId);
  
  return getAllWidgets().filter(widget => purchasedIds.includes(widget.id));
}

/**
 * Records a widget purchase
 */
export function recordWidgetPurchase(userId: string, widgetId: string, amount: number): WidgetPurchase | null {
  const widget = getWidget(widgetId);
  
  if (!widget) {
    console.error(`Widget with ID ${widgetId} not found`);
    return null;
  }
  
  const purchase: WidgetPurchase = {
    widgetId,
    userId,
    purchaseDate: new Date().toISOString(),
    transactionId: `txn_${Date.now()}`,
    amount
  };
  
  userPurchases.push(purchase);
  
  return purchase;
}

/**
 * Creates a sticker from a purchased widget
 */
export function createPurchasedWidgetSticker(widget: Widget, purchaseId: string): Sticker {
  return {
    ...widget.sticker,
    id: `purchased_${widget.id}_${Date.now()}`,
    isPremium: true,
    purchasedOn: new Date().toISOString(),
    purchaseId
  };
}
