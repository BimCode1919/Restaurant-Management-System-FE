import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosClient from '../../../api/axiosClient';

const CashierPaymentCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const resultCode = searchParams.get('resultCode');
        const orderId = searchParams.get('orderId');

        if (resultCode === '0') {
            // Bước quan trọng: Gọi API Confirm để Backend cập nhật status Bill = PAID
            axiosClient.post(`/payments/momo/confirm-order?orderId=${orderId}`)
                .then(() => {
                    setStatus('success');
                    toast.success('Bill updated to PAID status');
                    // Đợi 2s để nhân viên thấy thông báo rồi mới về Dashboard
                    setTimeout(() => navigate('/cashier', { replace: true }), 2000);
                })
                .catch(() => {
                    setStatus('failed');
                    toast.error("Failed to sync payment status with server.");
                });
        } else {
            setStatus('failed');
            toast.error("Payment was not successful.");
        }
    }, [searchParams, navigate]);

    return (
        <div className="h-screen flex items-center justify-center bg-[#F8F9FA]">
            <div className="text-center">
                {status === 'processing' && (
                    <div className="flex flex-col items-center">
                        <div className="size-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-black uppercase text-[10px] tracking-widest text-dark-gray">Synchronizing with MoMo...</p>
                    </div>
                )}
                {status === 'success' && (
                    <div className="animate-in zoom-in-95">
                        <span className="material-symbols-outlined text-6xl text-olive mb-4">check_circle</span>
                        <h2 className="text-2xl font-black italic text-dark-gray uppercase">Transaction Verified</h2>
                    </div>
                )}
                {status === 'failed' && (
                    <div>
                        <span className="material-symbols-outlined text-6xl text-burgundy mb-4">error</span>
                        <h2 className="text-xl font-black text-dark-gray uppercase">Verification Failed</h2>
                        <button onClick={() => navigate('/cashier')} className="mt-4 text-xs font-bold underline">Back to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashierPaymentCallback;