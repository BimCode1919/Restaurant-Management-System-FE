export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';

export interface OrderItem {
  id: string;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  note: string;
}

export interface Order {
  id: string;
  tableId: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  waiterName: string;
  createdAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export interface Table {
  id: string;
  status: TableStatus;
  capacity: number;
}