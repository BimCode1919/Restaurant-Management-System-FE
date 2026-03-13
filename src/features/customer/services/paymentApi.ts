import axiosClient from '../../../api/axiosClient'; 
import { PaymentResponse, CreatePaymentRequest } from '../types';

export const paymentApi = {
    /**
     * Khách hàng tạo yêu cầu thanh toán (đặt cọc)
     */
    createPayment: (request: CreatePaymentRequest): Promise<PaymentResponse> => {
        // Backend trả về trực tiếp PaymentResponse
        return axiosClient.post('/payments', request);
    }
};