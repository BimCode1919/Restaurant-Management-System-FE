// Discount type for admin discount management
export interface Discount {
  id: number;
  name: string;
  code: string;
  description: string;
  discountType: string;
  valueType: string;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  minPartySize: number;
  maxPartySize: number;
  tierConfig: string;
  applicableDays: string;
  applyToSpecificItems: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  calculatedAmount?: number;
}
// Định nghĩa chuẩn Response từ Spring Boot
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}

// Định nghĩa phân trang (Pageable) từ Spring Boot
export interface PageResponse<T> {
  data: any;
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // trang hiện tại
}

export interface ActiveDiscountInfo {
  discountId: number;
  discountName: string;
  discountValue: number;
  discountType: string;
}

export interface MenuItem {
  image: any;
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

export interface OrderItem extends MenuItem {
  quantity: number;
}
export interface Ingredient {
  id: number;
  name: string;
  stockQuantity: number;
  unit: string;
  updatedAt?: string | null;
}
export interface DashboardStats {
  revenueToday: number
  ordersToday: number
  activeTables: number
  lowInventory: number
}

export interface RecentOrder {
  id: number
  billId: number
  status: string
  createdAt: string
}
export interface Staff {
  id: number
  fullName: string
  email: string
  role: string
  phone?: string
  active?: boolean
}
export type AdminTab = 'DASHBOARD' | 'MENU' | 'INVENTORY' | 'REPORTS' | 'STAFF' | 'VOUCHER';