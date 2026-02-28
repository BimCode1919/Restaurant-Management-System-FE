import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Đính kèm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho Response: Xử lý lỗi tập trung (ví dụ 401 - hết hạn token)
axiosClient.interceptors.response.use(
  (response) => response.data, // Trả về data luôn, không cần .data ở phía sau
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;