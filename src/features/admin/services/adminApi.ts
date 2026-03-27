
import axiosClient from '../../../api/axiosClient';
import { ApiResponse, MenuItem, PageResponse } from '../types';
import { Ingredient } from "@/types"
import { IngredientBatch } from '@/types';
import { Staff } from "../types"

export const adminApi = {
  // Get paginated list of items (for management table)
  getAllItems: (page = 0, size = 10): Promise<ApiResponse<PageResponse<MenuItem>>> => {
    return axiosClient.get(`/items`, {
      params: { page, size, sortBy: 'id', sortDirection: 'DESC' }
    });
  },

  // Search dishes
  searchItems: (keyword: string, page = 0, size = 10): Promise<ApiResponse<PageResponse<MenuItem>>> => {
    return axiosClient.get(`/items/search`, {
      params: { keyword, page, size }
    });
  },

  // Create new dish (Admin Only)
  createItem: (data: any): Promise<ApiResponse<MenuItem>> => {
    return axiosClient.post('/items', data);
  },

  // Delete dish (Admin Only)
  deleteItem: (id: number): Promise<ApiResponse<void>> => {
    return axiosClient.delete(`/items/${id}`);
  },

  // Get dish details
  getItemById: (id: number): Promise<ApiResponse<MenuItem>> => {
    return axiosClient.get(`/items/${id}`);
  },

  updateItem: (id: number, data: any): Promise<ApiResponse<MenuItem>> => {
    return axiosClient.put(`/items/${id}`, data);
  },
// ================= DASHBOARD =================

// API /bills returns { statusCode: 200, message: "...", data: [...] }
getBills: async (): Promise<ApiResponse<any>> => {
    return axiosClient.get('/bills');
},

// API /orders similar
getOrders: async (): Promise<ApiResponse<any>> => {
    return axiosClient.get('/orders');
},

// Get preparing items for dashboard
getPreparingItems: async (): Promise<ApiResponse<any[]>> => {
    return axiosClient.get('/order-details/statusList', {
        params: { status: 'PREPARING' }
    });
},

// API /tables returns list of tables in .data field
getTables: async (): Promise<ApiResponse<any>> => {
    return axiosClient.get('/tables');
},

// API /ingredient-batches/expiring needs additional default params if Backend requires
getExpiringBatches: async (days = 1): Promise<ApiResponse<any>> => {
    return axiosClient.get('/ingredient-batches/expiring', {
        params: { days }
    });
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
  // Only send fields that API requires (based on your Swagger image)
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
  },

  // API to get presigned URL for image upload
  getPresignedUrl: (fileName: string, contentType: string): Promise<ApiResponse<{ presignedUrl: string; publicUrl: string; expiresInMinutes: number }>> => {
    return axiosClient.post('/files/presigned-url', { fileName, contentType });
  },
  // ================= DISCOUNT MANAGEMENT =================
  // Get all discounts
  getAllDiscounts: () => {
    return axiosClient.get('/discounts');
  },

  // Create new discount
  createDiscount: (data: any) => {
    return axiosClient.post('/discounts', data);
  },

  // Update discount
  updateDiscount: (id: number, data: any) => {
    return axiosClient.put(`/discounts/${id}`, data);
  },

  // Delete discount
  deleteDiscount: (id: number) => {
    return axiosClient.delete(`/discounts/${id}`);
  },
};