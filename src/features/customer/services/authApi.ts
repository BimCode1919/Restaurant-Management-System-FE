// Định nghĩa interface cho phản hồi guest session
import axiosClient from '../../../api/axiosClient';
import { ApiResponse } from '../types';
export interface GuestSessionResponse {
    token: string;
    refreshToken: string;
    type: string;
}

export const authApi = {
    // Gọi endpoint POST /auth/guest-session
    createGuestSession: (): Promise<ApiResponse<GuestSessionResponse>> => {
        return axiosClient.post('/auth/guest-session');
    }
};