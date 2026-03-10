// src/features/staff/services/staffApi.ts
import axiosClient from '../../../api/axiosClient';
import {
  CreateOrderRequest, ApiResponse, CreateBillRequest,
  TableResponse, BillResponse, ItemResponse, OrderResponse,
  ItemStatus, OrderDetailResponse
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

  updateItemStatus: (orderDetailId: number, status: ItemStatus) =>
    axiosClient.patch(`/order-details/${orderDetailId}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    }) as Promise<ApiResponse<any>>,

  massUpdateOrderStatus: (orderId: number) =>
    axiosClient.patch(`/orders/MassUpdateStatus/${orderId}`) as Promise<ApiResponse<OrderDetailResponse[]>>,
};