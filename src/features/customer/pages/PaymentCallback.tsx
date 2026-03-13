import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast'; tắt mẹ thông báo.

const PaymentCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const resultCode = searchParams.get('resultCode');
        const message = searchParams.get('message') || 'Transaction failed';

        if (resultCode === '0') {
            setStatus('success');
            //toast.success('Deposit paid successfully!');

            // Redirect to Home after 6 seconds so they can read the email notice
            const timer = setTimeout(() => {
                navigate('/', { replace: true });
            }, 6000);

            return () => clearTimeout(timer);
        } else {
            setStatus('failed');
            //toast.error(message);
        }
    }, [searchParams, navigate]);

    return (
        <div className="h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                {/* 1. Processing State */}
                {status === 'processing' && (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="size-16 border-4 border-gray-100 border-t-burgundy rounded-full animate-spin mb-6" />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-dark-gray">Verifying Transaction</h2>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold">Please do not refresh this page</p>
                    </div>
                )}

                {/* 2. Success State - English Notice */}
                {status === 'success' && (
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-50 animate-in zoom-in-95 duration-500">
                        <div className="size-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-100 mx-auto mb-8">
                            <span className="material-symbols-outlined text-4xl">check</span>
                        </div>
                        <h2 className="text-3xl font-black italic uppercase text-dark-gray tracking-tighter">Perfect!</h2>
                        
                        <div className="space-y-4 mt-4">
                            <p className="text-gray-600 text-sm font-medium">
                                Your deposit of <span className="text-dark-gray font-bold">{new Intl.NumberFormat('vi-VN').format(Number(searchParams.get('amount')))}đ</span> has been received.
                            </p>
                            
                            {/* Email Confirmation Notice */}
                            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                                <p className="text-blue-800 text-xs leading-relaxed font-bold uppercase tracking-tight">
                                    Please check your inbox. Our staff will review your request and send a confirmation email shortly to finalize your reservation.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dashed border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Redirecting to home in 6s...</p>
                            <button 
                                onClick={() => navigate('/')}
                                className="mt-4 text-[10px] font-bold text-burgundy underline uppercase"
                            >
                                Return to home now
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. Failed State */}
                {status === 'failed' && (
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-50 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="material-symbols-outlined text-4xl">close</span>
                        </div>
                        <h2 className="text-2xl font-black italic uppercase text-dark-gray tracking-tighter">Payment Failed</h2>
                        <p className="text-gray-400 text-xs mt-3 font-medium px-4">
                            {searchParams.get('message') || 'The transaction was cancelled or declined.'}
                        </p>

                        <div className="mt-10 flex flex-col gap-3">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="w-full bg-dark-gray text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={() => navigate('/')} 
                                className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;