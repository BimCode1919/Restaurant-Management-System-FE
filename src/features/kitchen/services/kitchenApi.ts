import axiosClient from '../../../api/axiosClient';

export const kitchenApi = {
  // Lấy món đang nấu
  async getPreparingOrders(): Promise<any> {
    return axiosClient.get("/order-details/preparing");
  },

  // Lấy món đã xong
  async getReadyOrders(): Promise<any> {
    return axiosClient.get("/order-details/ready");
  },

  // Giữ nguyên PATCH để chuyển trạng thái
  async updateOrderStatus(id: number, status: string) {
    return axiosClient.patch(`/order-details/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  //===================== INVENTORY (nếu có) =================
  getIngredients: () => {
    return axiosClient.get("/ingredients");
  },
}