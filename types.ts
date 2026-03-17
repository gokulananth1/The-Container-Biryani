
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CHEF = 'CHEF',
  CUSTOMER = 'CUSTOMER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  ONLINE = 'ONLINE'
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Main Course' | 'Desserts' | 'Beverages';
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isVeg?: boolean; // New property for diet categorization
}

export interface Order {
  id: string;
  items: { item: MenuItem; quantity: number }[];
  status: OrderStatus;
  type: OrderType;
  tableNumber?: string;
  total: number;
  timestamp: number;
  customerId?: string;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  status: 'IN_STOCK' | 'OUT_OF_STOCK';
}

export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    description: string;
    features: { title: string; desc: string }[];
  };
  culinary: {
    title: string;
    specialtyTitle: string;
    specialtyDescription: string;
    mustTry: string[];
  };
  insights: {
    serviceTip: string;
    atmosphere: string;
  };
}
