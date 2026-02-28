export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'KITCHEN'; // Khớp với BE của bạn
  active: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserResponse;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}