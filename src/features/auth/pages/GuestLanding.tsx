import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { toast } from 'react-hot-toast';

const GuestLanding: React.FC = () => {
    const { qrCode } = useParams<{ qrCode: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const initGuestSession = async () => {
            if (!qrCode) return;

            try {
                const response = await authApi.createGuestSession(qrCode);

                // Lưu thông tin vào localStorage để axiosClient có thể lấy token
                const userData = {
                    token: response.data.token,
                    refreshToken: response.data.refreshToken,
                    info: { role: 'CUSTOMER' } // Giả lập info để khớp với logic các trang khác
                };

                localStorage.setItem('user', JSON.stringify(userData));

                toast.success("Welcome! Table session initialized.");

                // Chuyển hướng khách hàng vào trang Menu chính
                navigate('/customer');
            } catch (error: any) {
                console.error("Session Error:", error);
                toast.error("Invalid or expired Table QR Code.");
                // Nếu lỗi, có thể đẩy ra trang 404 hoặc thông báo lỗi
            }
        };

        initGuestSession();
    }, [qrCode, navigate]);

    return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-burgundy italic">
                    Initializing Table Session...
                </p>
            </div>
        </div>
    );
};

export default GuestLanding;