import axiosClient from '../../../api/axiosClient';
import { ApiResponse, MenuItem, PageResponse } from '../types';

export const adminApi = {
  // Lấy danh sách món có phân trang (dùng cho bảng quản lý)
  getAllItems: (page = 0, size = 10): Promise<ApiResponse<PageResponse<MenuItem>>> => {
    return axiosClient.get(`/items`, {
      params: { page, size, sortBy: 'id', sortDirection: 'DESC' }
    });
  },

  // Search món ăn
  searchItems: (keyword: string, page = 0, size = 10): Promise<ApiResponse<PageResponse<MenuItem>>> => {
    return axiosClient.get(`/items/search`, {
      params: { keyword, page, size }
    });
  },

  // Tạo món mới (Admin Only)
  createItem: (data: any): Promise<ApiResponse<MenuItem>> => {
    return axiosClient.post('/items', data);
  },

  // Xóa món (Admin Only)
  deleteItem: (id: number): Promise<ApiResponse<void>> => {
    return axiosClient.delete(`/items/${id}`);
  },

  // Lấy chi tiết 1 món
  getItemById: (id: number): Promise<ApiResponse<MenuItem>> => {
    return axiosClient.get(`/items/${id}`);
  },

  updateItem: (id: number, data: any): Promise<ApiResponse<MenuItem>> => {
    return axiosClient.put(`/items/${id}`, data);
  },
};