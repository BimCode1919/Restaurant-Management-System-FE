// --- 1. Điều hướng & Trạng thái ---
export type AdminTab = 'DASHBOARD' | 'MENU' | 'INVENTORY' | 'REPORTS' | 'STAFF' | 'VOUCHER';
export type CustomerTab = 'MENU' | 'AI' | 'STATUS';
export type BillStatus = 'OPEN' | 'PAID' | 'CLOSED' | 'CANCELLED';
export type ItemStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';

export enum PaymentMethod {
  CASH = 'CASH',
  MOMO = 'MOMO'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// --- 2. Thực thể Món ăn (Khớp ItemResponse) ---
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageURL: string;
  categoryName: string;
  categoryId: number;
  unit: string;
  available: boolean;
}

// --- 3. Thực thể Giỏ hàng ---
export interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
}

// --- 4. Thực thể Order từ Backend ---
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
  orderType: 'AT_TABLE' | 'TAKE_AWAY';
  createdBy: string;
  totalAmount: number;
  items: OrderDetailResponse[];
  createdAt: string;
}

// --- 5. Phản hồi API & Phân trang ---
export interface ApiResponse<T> {
  status: number;
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// --- 6. Người dùng ---
export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'MANAGER';
  token?: string;
}

// --- 7. Thực thể Bàn ---
export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';
  location: string;
  qrCode: string;
}

// --- 8. Thực thể Reservation ---
export interface ReservationRequest {
  customerName: string;
  customerPhone: string;
  reservationTime: string;
  partySize: number;
  tableId?: number;
  notes?: string;
}

export interface PreOrderItemRequest {
  itemId: number;
  quantity: number;
}

export interface ReservationWithDepositRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  partySize: number;
  reservationTime: string;
  note?: string;
  requestedTableIds: number[];
  preOrderItems: PreOrderItemRequest[];
}

export interface ReservationResponse {
  id: number;
  customerName: string;
  customerPhone: string;
  reservationTime: string;
  partySize: number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'NO_SHOW';
  tableNumber?: string;
  billId?: number;
  depositAmount?: number; // Thêm trường này để hiển thị ở màn hình Review
}

// --- 9. Hóa đơn & Thanh toán ---
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

export interface DiscountResponse {
    id: number;
    code: string;
    percentage: number;
    maxAmount: number;
}
// --- 9. AI Recommendation Types ---
export interface AIRecommendRequest {
  prompt: string;
  budget: number;
  people: number;
  preferences: {
    spicy: boolean;
    vegetarian: boolean;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  };
}

export interface AIRecommendResponse {
  appetizer: string;
  mainCourse: string;
  dessert: string;
}

export interface AIEmbeddingsResponse {
  statusCode: number;
  message: string;
  responseAt: string;
  id: number;
  code: string;
  percentage: number;
  maxAmount: number;
}

export interface CreatePaymentRequest {
  billId: number;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
}

/**
 * Interface đã cập nhật đầy đủ để fix lỗi Property 'paymentUrl' does not exist
 */
export interface PaymentResponse {
  id: number;
  billId: number;
  method: PaymentMethod; // Sử dụng Enum cho đồng bộ
  amount: number;
  status: PaymentStatus;

  // Các trường quan trọng cho thanh toán Online
  paymentUrl?: string;
  transactionId?: string;

  // MoMo specific
  momoOrderId?: string;
  momoRequestId?: string;

  errorMessage?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}