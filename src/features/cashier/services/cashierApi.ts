import axiosClient from '../../../api/axiosClient'; // Đường dẫn tới file config của bạn
import {
    ApiResponse,
    BillResponse,
    PaymentResponse,
    CreatePaymentRequest
} from '../types';

export const cashierApi = {
    /**
     * Lấy thông tin chi tiết của một hóa đơn
     * @GetMapping("/bills/{id}")
     */
    getBillDetails: (billId: number): Promise<ApiResponse<BillResponse>> => {
        return axiosClient.get(`/bills/${billId}`);
    },

    /**
     * Tự động áp dụng mã giảm giá tốt nhất cho hóa đơn
     * @PostMapping("/bills/{id}/apply-best-discount")
     */
    applyBestDiscount: (billId: number): Promise<ApiResponse<BillResponse>> => {
        return axiosClient.post(`/bills/${billId}/apply-best-discount`);
    },

    /**
     * Tạo yêu cầu thanh toán (Tiền mặt hoặc MoMo)
     * @PostMapping("/payments")
     * Lưu ý: Kết quả trả về trực tiếp PaymentResponse theo cấu trúc Controller của bạn
     */
    createPayment: (request: CreatePaymentRequest): Promise<PaymentResponse> => {
        // Vì Controller trả về trực tiếp PaymentResponse (không bọc ApiResponse)
        // và axiosClient đã return response.data, nên ở đây nhận được đúng object cần thiết.
        return axiosClient.post('/payments', request);
    }
};