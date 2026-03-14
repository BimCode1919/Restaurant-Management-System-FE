import axiosClient from '../../../api/axiosClient';
import { ApiResponse, Table, ReservationRequest, ReservationWithDepositRequest, ReservationResponse } from '../types';

export const reservationApi = {
    // Lấy danh sách bàn trống (Hình 3)
    getAvailableTables: (): Promise<ApiResponse<Table[]>> => {
        return axiosClient.get('/tables/available');
    },

    // Option 1: Đặt bàn không đặt cọc
    createReservation: (data: ReservationRequest): Promise<ApiResponse<ReservationResponse>> => {
        return axiosClient.post('/reservations', data);
    },

    // Option 2: Đặt bàn có đặt cọc + món ăn
    createReservationWithDeposit: (data: ReservationWithDepositRequest): Promise<ApiResponse<ReservationResponse>> => {
        return axiosClient.post('/reservations/deposit', data);
    },

    // Kiểm tra thông tin đặt bàn bằng ID
    getReservationById: (id: number): Promise<ApiResponse<ReservationResponse>> => {
        return axiosClient.get(`/reservations/${id}`);
    },

    // src/customer/services/reservationApi.ts

    payReservationDeposit: (reservationId: number, method: string): Promise<any> => {
        // PHẢI CÓ chữ return ở đầu dòng axios
        return axiosClient.post(`/payments/reservations/${reservationId}/deposit`, null, {
            params: { request: method }
        })
            .then(res => {
                // Log tại đây để kiểm tra dữ liệu thô từ axios
                console.log("Axios Raw Response:", res);
                return res.data; // Trả về res.data chính là object có chứa paymentUrl
            })
            .catch(err => {
                console.error("API Error:", err);
                throw err;
            });
    },

    cancelReservation: (id: number, reason?: string): Promise<ApiResponse<ReservationResponse>> => {
        // Gửi reason qua params nếu có
        const params = reason ? { reason } : {};
        return axiosClient.put(`/reservations/${id}/cancel`, null, { params });
    },

    checkDepositStatus: (reservationId: number): Promise<ApiResponse<PaymentResponse>> => {
        return axiosClient.get(`/payments/reservations/${reservationId}/deposit/status`);
    },
};