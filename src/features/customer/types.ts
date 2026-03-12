// --- 1. Điều hướng ---
export type AdminTab = 'DASHBOARD' | 'MENU' | 'INVENTORY' | 'REPORTS' | 'STAFF' | 'VOUCHER';
export type CustomerTab = 'MENU' | 'AI' | 'STATUS';
export type BillStatus = 'OPEN' | 'PAID' | 'CLOSED' | 'CANCELLED';
export type ItemStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';

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
  notes?: string; // Bổ sung trường notes từ OrderDetailRequest
}

// --- 4. Thực thể Order từ Backend (Khớp OrderResponse & OrderDetailResponse) ---
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
  createdAt: string; // LocalDateTime từ BE sẽ parse thành string ISO
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
// --- 7. Thực thể Bàn (Khớp với API /tables/available) ---
export interface Table {
    id: number;
    tableNumber: string;
    capacity: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';
    location: string;
    qrCode: string;
}

// --- 8. Thực thể Reservation (Khớp với API Reservation) ---
export interface ReservationRequest {
    customerName: string;
    customerPhone: string;
    reservationTime: string; // ISO string
    partySize: number;
    tableId?: number;
    notes?: string;
}

export interface ReservationWithDepositRequest extends ReservationRequest {
    depositAmount: number;
    orderItems: { itemId: number; quantity: number; notes?: string }[];
}

export interface ReservationResponse {
    id: number;
    customerName: string;
    customerPhone: string;
    reservationTime: string;
    partySize: number;
    status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'NO_SHOW';
    tableNumber?: string;
}
export interface BillResponse {
    id: number;
    totalPrice: number;       // BigDecimal -> number
    partySize: number;
    discount?: DiscountResponse;
    discountAmount: number;
    finalPrice: number;
    status: BillStatus;
    reservationId?: number;
    paymentId?: number;
    tableNumbers: string[];   // List<String> -> string[]
    orders: OrderResponse[];  // List<OrderResponse>
    createdAt: string;        // LocalDateTime -> string (ISO format)
    closedAt?: string;
}

export interface DiscountResponse {
    id: number;
    code: string;
    percentage: number;
    maxAmount: number;
}