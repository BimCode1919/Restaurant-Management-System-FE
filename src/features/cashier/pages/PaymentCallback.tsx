import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    useEffect(() => {
        const resultCode = searchParams.get('resultCode');
        const message = searchParams.get('message') || 'Payment failed';

        // MoMo trả về resultCode = 0 là thành công
        if (resultCode === '0') {
            setStatus('success');
            toast.success('Payment Completed Successfully!');
            // Tự động quay lại trang thu ngân sau 5s
            setTimeout(() => navigate('/cashier'), 5000);
        } else {
            setStatus('failed');
            toast.error(message);
        }
    }, [searchParams, navigate]);

    return (
        <div className="h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                {status === 'processing' && (
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="size-20 border-8 border-burgundy/10 border-t-burgundy rounded-full animate-spin mb-4" />
                        <p className="font-black uppercase text-sm italic">Verifying Transaction...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-olive/5 border border-olive/20 p-10 rounded-[3rem] animate-enter">
                        <div className="size-20 bg-olive text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                        <h2 className="text-3xl font-black italic text-olive uppercase tracking-tighter">Payment Success</h2>
                        <p className="text-gray-500 font-bold text-sm mt-4 uppercase">Bill has been closed. You can now clear the table.</p>
                        <button
                            onClick={() => navigate('/cashier')}
                            className="mt-8 bg-dark-gray text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="bg-burgundy/5 border border-burgundy/20 p-10 rounded-[3rem]">
                        <div className="size-20 bg-burgundy text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✕</div>
                        <h2 className="text-3xl font-black italic text-burgundy uppercase tracking-tighter">Payment Failed</h2>
                        <p className="text-gray-500 font-bold text-sm mt-4 uppercase">{searchParams.get('message')}</p>
                        <button
                            onClick={() => navigate('/cashier')}
                            className="mt-8 bg-burgundy text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;