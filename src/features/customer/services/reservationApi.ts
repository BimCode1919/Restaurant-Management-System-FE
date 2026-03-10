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
    }
};