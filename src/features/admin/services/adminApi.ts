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

// API /bills trả về { statusCode: 200, message: "...", data: [...] }
getBills: async () => {
    const res = await axiosClient.get("/bills");
    return res.data; // Trả về object chứa trường .data để DashboardView.tsx xử lý
},

// API /orders tương tự, cần kiểm tra kỹ vì đang bị lỗi 500 trên Network
getOrders: async () => {
    const res = await axiosClient.get("/orders");
    return res.data; 
},

// API /tables trả về danh sách bàn trong trường .data
getTables: async () => {
    const res = await axiosClient.get("/tables");
    return res.data;
},

// API /ingredient-batches/expiring cần truyền thêm params mặc định nếu Backend yêu cầu
getExpiringBatches: async (days = 1) => {
    const res = await axiosClient.get("/ingredient-batches/expiring", {
        params: { days }
    });
    return res.data;
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
// Trong adminApi.ts
  getAllStaff: (): Promise<Staff[]> => {
      return axiosClient.get("/users")
  },

  createStaff: (data: any) => {
    return axiosClient.post("/users", data)
  },

  updateStaff: (id: number, data: any) => {
  // Chỉ gửi những trường mà API yêu cầu (dựa trên ảnh Swagger của bạn)
  const updateData = {
    fullName: data.fullName.trim(),
    email: data.email,
    phone: data.phone || "0100000000",
  };
    return axiosClient.put(`/users/${id}`, updateData);
  },

  deleteStaff: (id: number) => {
    return axiosClient.delete(`/users/${id}`)
  },

  changeRole: (id: number, role: string) => {
    return axiosClient.patch(`/users/${id}/role`, { role })
  }
  };