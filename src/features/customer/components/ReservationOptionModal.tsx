import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi'; // Đường dẫn tới file authApi của bạn
import { toast } from 'react-hot-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ReservationOptionModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isCreatingSession, setIsCreatingSession] = useState(false);

    if (!isOpen) return null;

    const handleSelectOption = async (isLargeGroup: boolean) => {
        try {
            setIsCreatingSession(true);

            // Bước 1: Gọi API tạo Guest Session
            const response = await authApi.createGuestSession();

            // Lấy data từ response (đảm bảo khớp với cấu trúc BE của bạn)
            const data = (response as any).data?.data || (response as any).data || response;

            // Bước 2: Lưu theo cấu trúc OBJECT giống hệt bên GuestLanding
            const userData = {
                token: data.token,
                refreshToken: data.refreshToken,
                info: { role: 'CUSTOMER' } // Để phân biệt với khách tại bàn
            };

            // Quan trọng: Phải stringify vì GuestLanding và Interceptor đang dùng kiểu này
            localStorage.setItem('user', JSON.stringify(userData));

            // Bước 3: Chuyển hướng
            navigate('/reservation-flow', { state: { isLargeGroup } });
            onClose();

        } catch (error: any) {
            console.error("Guest Session Error:", error);
            toast.error("Không thể khởi tạo phiên làm việc. Vui lòng thử lại!");
        } finally {
            setIsCreatingSession(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                <button
                    onClick={onClose}
                    disabled={isCreatingSession}
                    className="absolute top-6 right-6 text-gray-400 hover:text-dark-gray disabled:opacity-50"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h2 className="text-2xl font-black uppercase italic text-dark-gray mb-8 text-center">
                    {isCreatingSession ? 'Initializing...' : 'Choose party size'}
                </h2>

                <div className="grid gap-4">
                    {/* Option 1 */}
                    <button
                        disabled={isCreatingSession}
                        onClick={() => handleSelectOption(false)}
                        className={`p-6 bg-gray-50 rounded-[2rem] border border-gray-100 text-left hover:border-burgundy transition-all group ${isCreatingSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="block font-black text-burgundy text-sm uppercase mb-1">Under 5 people</span>
                        <p className="text-xs text-gray-500 italic">Quick table booking, no deposit required.</p>
                    </button>

                    {/* Option 2 */}
                    <button
                        disabled={isCreatingSession}
                        onClick={() => handleSelectOption(true)}
                        className={`p-6 bg-gray-900 text-white rounded-[2rem] text-left hover:scale-[1.02] transition-all ${isCreatingSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="block font-black text-burgundy-light text-sm uppercase mb-1">5 people or more</span>
                        <p className="text-xs text-white/60 italic">Deposit required to secure the reservation.</p>
                    </button>
                </div>

                {isCreatingSession && (
                    <div className="mt-4 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-burgundy"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationOptionModal;