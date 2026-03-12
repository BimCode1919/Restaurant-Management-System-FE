export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  MOMO = 'MOMO'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}

export interface TableResponse {
  currentBill: BillResponse | null;
  id: number;
  tableNumber: string;
  status: TableStatus;
  capacity: number;
  location?: string;
  qrCode?: string;
}

export interface OrderDetailResponse {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  subtotal: number;
  itemStatus: string;
  notes: string;
}

export interface OrderResponse {
  id: number;
  billId: number;
  totalAmount: number;
  items: OrderDetailResponse[];
  createdAt: string;
}

export interface BillResponse {
  id: number;
  totalPrice: number;
  partySize: number;
  discountAmount: number;
  finalPrice: number;
  status: BillStatus;
  tableNumbers: string[];
  orders: OrderResponse[];
  createdAt: string;
}

export interface CreatePaymentRequest {
  billId: number;
  paymentMethod: PaymentMethod;
  returnUrl?: string; // Bắt buộc nếu dùng MOMO
}

export interface PaymentResponse {
  id: number;
  billId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paymentUrl?: string; // URL MoMo trả về
  transactionId?: string;
  paidAt?: string;
}

export interface MergeBillRequest {
    billIds: number[];
}