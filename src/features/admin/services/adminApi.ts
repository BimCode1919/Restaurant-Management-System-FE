import axiosClient from '../../../api/axiosClient';
import { ApiResponse, MenuItem, PageResponse } from '../types';
import { Ingredient } from "@/types"
import { IngredientBatch } from '@/types';
import { Staff } from "../types"

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
  // ================= DASHBOARD =================

  getBills: () => axiosClient.get("/bills"),
  getOrders: () => axiosClient.get("/orders"),
  getTables: () => axiosClient.get("/tables"),
  getExpiringBatches: () => {
  return axiosClient.get("/ingredient-batches/expiring");
},
// ================= INVENTORY =================

getAllIngredients: async (): Promise<ApiResponse<Ingredient[]>> => {
  return await axiosClient.get("/ingredients")
},

  getIngredientById: (id: number) => {
    return axiosClient.get<ApiResponse<Ingredient>>(`/ingredients/${id}`)
  },

  createIngredient: (data: {
    name: string
    stockQuantity: number
    unit: string
  }) => {
    return axiosClient.post<ApiResponse<Ingredient>>("/ingredients", data)
  },

  updateIngredient: (
    id: number,
    data: {
      name: string
      stockQuantity: number
      unit: string
    }
  ) => {
    return axiosClient.put<ApiResponse<Ingredient>>(`/ingredients/${id}`, data)
  },

  deleteIngredient: (id: number) => {
    return axiosClient.delete<ApiResponse<any>>(`/ingredients/${id}`)
  },
//================== STAFF =================

//getAllStaff: async (): Promise<Staff[]> => {
  // const res = await axiosClient.get("/users") as ApiResponse<Staff[]>
  // return res.data
  // getAllStaff: async (): Promise<ApiResponse<Staff[]>> => {
  //   return await axiosClient.get("/users")
  getAllStaff: async (): Promise<ApiResponse<Staff[]>> => {
    return await axiosClient.get("/users")
},

createStaff: (data: any) => {
  return axiosClient.post("/users", data)
},

updateStaff: (id: number, data: any) => {
  return axiosClient.put(`/users/${id}`, data)
},

deleteStaff: (id: number) => {
  return axiosClient.delete(`/users/${id}`)
},

changeRole: (id: number, role: string) => {
  return axiosClient.patch(`/users/${id}/role`, { role })
}
};