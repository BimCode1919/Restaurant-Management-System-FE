// src/features/staff/services/staffApi.ts
import axiosClient from '../../../api/axiosClient';
import { 
  CreateOrderRequest, ApiResponse, CreateBillRequest, 
  TableResponse, BillResponse, ItemResponse, OrderResponse 
} from '../types';

export const staffApi = {
  // Thêm "as Promise<ApiResponse<...>>" để TS hiểu dữ liệu đã qua bóc tách
  getTables: () => 
    axiosClient.get('/tables') as Promise<ApiResponse<TableResponse[]>>,
  
  getAvailableItems: () => 
    axiosClient.get('/items/available') as Promise<ApiResponse<ItemResponse[]>>,

  createBill: (data: CreateBillRequest) => 
    axiosClient.post('/bills', data) as Promise<ApiResponse<BillResponse>>,

  createOrder: (data: CreateOrderRequest) => 
    axiosClient.post('/orders', data) as Promise<ApiResponse<OrderResponse>>,
    
  getOrdersByBill: (billId: number) => 
    axiosClient.get(`/orders/bill/${billId}`) as Promise<ApiResponse<OrderResponse[]>>,
};