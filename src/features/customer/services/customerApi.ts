import axiosClient from '../../../api/axiosClient';
import { MenuItem, ApiResponse, PageResponse, OrderResponse, BillResponse, AIEmbeddingsResponse, AIRecommendRequest, AIRecommendResponse } from '../types';

export const customerApi = {
    // Lấy menu đang kinh doanh (khớp với @GetMapping("/available"))
    getAvailableMenu: (categoryId?: number): Promise<ApiResponse<MenuItem[]>> => {
        const url = categoryId ? `/items/available?categoryId=${categoryId}` : '/items/available';
        return axiosClient.get(url);
    },

    // Tìm kiếm món ăn (@GetMapping("/search"))
    searchMenu: (keyword: string, page = 0, size = 10): Promise<ApiResponse<PageResponse<MenuItem>>> => {
        return axiosClient.get(`/items/search?keyword=${keyword}&page=${page}&size=${size}`);
    },

    createBill: (data: { tableIds: number[], partySize: number, reservationId: number }) => 
    axiosClient.post('/bills', data),

    // Tạo đơn hàng mới (@PostMapping)
    // Request body khớp với CreateOrderRequest của BE
    createOrder: (orderRequest: {
        billId: number,
        orderType: 'AT_TABLE' | 'TAKE_AWAY',
        items: { itemId: number, quantity: number, notes?: string }[]
    }): Promise<ApiResponse<OrderResponse>> => {
        return axiosClient.post('/orders', orderRequest);
    },

    // Lấy danh sách các món đã gọi của một hóa đơn (@GetMapping("/bill/{billId}"))
    getOrdersByBill: (billId: number): Promise<ApiResponse<OrderResponse[]>> => {
        return axiosClient.get(`/orders/bill/${billId}`);
    },

    getBillById: (id: number): Promise<ApiResponse<BillResponse>> => {
        return axiosClient.get(`/bills/${id}`);
    },
    // Gọi AI gợi ý món ăn
    getAIRecommendation: (data: AIRecommendRequest): Promise<ApiResponse<AIRecommendResponse>> => {
        return axiosClient.post('/ai/recommend-meal', data);
    },

    // Trigger generate embeddings (nếu cần dùng nút admin hoặc setup)
    generateAIEmbeddings: (): Promise<AIEmbeddingsResponse> => {
        return axiosClient.post('/ai/generate-embeddings');
    }
};