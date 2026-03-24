import axiosClient from '../../../api/axiosClient';
import {
    ApiResponse,
    Table,
    ReservationResponse,
    BookedSlotResponse,
    CreateReservationRequest,
    PaymentResponse
} from '../types';

export const reservationApi = {
    /**
     * 1. KIỂM TRA TRẠNG THÁI TRỐNG (AVAILABILITY)
     */

    // Lấy danh sách các slot đã bị đặt theo ngày (để hiển thị lịch cho khách)
    getAvailability: (date?: string): Promise<BookedSlotResponse[]> => {
        return axiosClient.get('/reservations/availability', { params: { date } });
    },

    // Lấy danh sách bàn trống (Dùng trong TableView)
    getAvailableTables: (): Promise<ApiResponse<Table[]>> => {
        return axiosClient.get('/tables/available');
    },

    /**
     * 2. TẠO ĐẶT BÀN (RESERVATION)
     */

    // Endpoint DUY NHẤT để tạo đặt bàn. 
    // Backend sẽ tự dựa vào partySize (>10) hoặc preOrderItems để tính depositAmount.
    createReservation: (data: CreateReservationRequest): Promise<ReservationResponse> => {
        return axiosClient.post('/reservations', data);
    },

    // Kiểm tra thông tin chi tiết một đơn đặt bàn đã tạo
    getReservationById: (id: number): Promise<ApiResponse<ReservationResponse>> => {
        return axiosClient.get(`/reservations/${id}`);
    },

    /**
     * 3. THANH TOÁN (PAYMENT)
     */

    // Luồng thanh toán Online qua MoMo
    // Lưu ý: data trả về thường chứa paymentUrl để redirect khách hàng
    payDepositMomo: (reservationId: number): Promise<any> => {
        return axiosClient.post(`/payments/reservations/${reservationId}/deposit`, null, {
            params: {
                request: 'MOMO' // Tên key 'request' phải khớp với tên biến ở Backend
            }
        }).then(res => res.data); // Đảm bảo lấy .data để có paymentUrl
    },

    // Kiểm tra trạng thái thanh toán của khoản cọc
    checkDepositStatus: (reservationId: number): Promise<ApiResponse<PaymentResponse>> => {
        return axiosClient.get(`/payments/reservations/${reservationId}/deposit/status`);
    },

    /**
     * 4. HỦY BỎ (CANCEL)
     */

    cancelReservation: (id: number, reason?: string): Promise<ReservationResponse> => {
        const params = reason ? { reason } : {};
        return axiosClient.put(`/reservations/${id}/cancel`, null, { params });
    }
};