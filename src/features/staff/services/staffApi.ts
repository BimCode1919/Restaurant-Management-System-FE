import axiosClient from '../../../api/axiosClient';
import { ApiResponse, Order, Table } from '../types';

export const staffApi = {
  getActiveOrders: (): Promise<ApiResponse<Order[]>> => {
    return axiosClient.get('/staff/orders/active');
  },
  updateOrderStatus: (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    return axiosClient.patch(`/staff/orders/${orderId}/status`, { status });
  },
  getTables: (): Promise<ApiResponse<Table[]>> => {
    return axiosClient.get('/staff/tables');
  }
};