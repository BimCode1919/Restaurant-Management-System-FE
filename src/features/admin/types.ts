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

export type AdminTab = 'DASHBOARD' | 'MENU' | 'INVENTORY' | 'REPORTS' | 'STAFF' | 'VOUCHER';