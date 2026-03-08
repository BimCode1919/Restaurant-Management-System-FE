import axiosClient from '../../../api/axiosClient';
import { AuthResponse, ApiResponse } from '../../../types/auth';

export const authApi = {
  login: (credentials: any): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/login', credentials);
  },
  
  refreshToken: (token: string): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/refresh-token', { refreshToken: token });
  },
  
  createGuestSession: (qrCode: string): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post(`/auth/guest-session/${qrCode}`);
  }
};