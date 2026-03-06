/** * ENUMS - Khớp hoàn toàn với Backend 
 */
export enum BillStatus {
  OPEN = 'OPEN',
  PAID = 'PAID',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum OrderType {
  PRE_ORDER = 'PRE_ORDER',
  AT_TABLE = 'AT_TABLE'
}

export enum ItemStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface OrderItem {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  subtotal: number;
  itemStatus: ItemStatus;
  notes: string;
}

/**
 * API WRAPPER
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string; // ISO Date string
}

/**
 * RESPONSES (DTOs từ Backend)
 */

export interface ItemResponse {
  id: number;
  name: string;
  price: number;
  unit: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  available: boolean;
  activeDiscounts: ActiveDiscountInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface ActiveDiscountInfo {
  discountId: number;
  discountName: string;
  discountValue: number;
  discountType: string;
}

export interface OrderDetailResponse {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  subtotal: number;
  itemStatus: ItemStatus;
  notes: string;
}

export interface OrderResponse {
  id: number;
  billId: number;
  orderType: OrderType;
  createdBy: string;
  totalAmount: number;
  items: OrderDetailResponse[];
  createdAt: string;
}

export interface DiscountResponse {
  id: number;
  name: string;
  value: number;
  type: string;
}

export interface BillResponse {
  id: number;
  totalPrice: number;
  partySize: number;
  discount?: DiscountResponse;
  discountAmount: number;
  finalPrice: number;
  status: BillStatus;
  reservationId?: number;
  paymentId?: number;
  tableNumbers: string[];
  orders: OrderResponse[];
  createdAt: string;
  closedAt?: string;
}

export interface TableResponse {
  currentBill: any;
  id: number;
  tableNumber: string;
  status: TableStatus;
  capacity: number;
  qrCode?: string;
}

/**
 * REQUESTS (Dùng cho API POST/PUT)
 */

export interface CreateBillRequest {
  tableIds: number[];
  partySize: number;
  reservationId?: number;
}

export interface OrderDetailRequest {
  itemId: number;
  quantity: number;
  notes?: string;
}

export interface CreateOrderRequest {
  billId: number;
  orderType?: OrderType;
  items: OrderDetailRequest[];
}