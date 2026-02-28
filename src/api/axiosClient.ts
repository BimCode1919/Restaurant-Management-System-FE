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
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const userData = JSON.parse(localStorage.getItem('user') || '{}');

            if (userData.refreshToken) {
                // Gọi API refresh token
                const refreshUrl = `${import.meta.env.VITE_API_URL}/auth/refresh-token`;

                return axios.post(refreshUrl, {
                    refreshToken: userData.refreshToken
                })
                    .then(res => {
                        if (res.status === 200) {
                            // Cập nhật token mới vào LocalStorage
                            const newUserDate = { ...userData, token: res.data.data.token };
                            localStorage.setItem('user', JSON.stringify(newUserDate));

                            // Gắn token mới vào request cũ và chạy lại
                            originalRequest.headers.Authorization = `Bearer ${res.data.data.token}`;
                            return axios(originalRequest);
                        }
                    })
                    .catch(() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    });
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;