import axiosClient from '../../../api/axiosClient';

export const kitchenApi = {
// API mới dùng chung một endpoint với query parameter
  getOrdersByStatus: async (status: "PREPARING" | "READY"): Promise<any> => {
    return axiosClient.get("/order-details/statusList", {
      params: { status } // Nó sẽ tạo ra: /order-details/statusList?status=PREPARING
    });
  },
  // Giữ nguyên PATCH để chuyển trạng thái
  async updateOrderStatus(id: number, status: string) {
    return axiosClient.patch(`/order-details/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  //===================== INVENTORY ====================
  getIngredients: () => {
    return axiosClient.get("/ingredients");
  },
}