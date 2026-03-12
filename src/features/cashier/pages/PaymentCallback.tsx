import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { reservationApi } from '../../customer/services/reservationApi'; // Ensure correct path
import { ReservationWithDepositRequest } from '../../customer/types';

const PaymentCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    useEffect(() => {
        const resultCode = searchParams.get('resultCode');
        const message = searchParams.get('message') || 'Payment failed';
        const pendingData = localStorage.getItem('pending_reservation');

        if (resultCode === '0') {
            setStatus('success');

            // --- ONLINE RESERVATION HANDLING ---
            if (pendingData) {
                const reservationRequest: ReservationWithDepositRequest = {
                    ...JSON.parse(pendingData),
                    depositAmount: 200000 // Fixed deposit amount
                };

                reservationApi.createReservationWithDeposit(reservationRequest)
                    .then((response) => {
                        toast.success(`Reservation Successful! ID: ${response.data.id}`);
                        localStorage.removeItem('pending_reservation'); // Clear after use

                        // Navigate to Customer success screen
                        setTimeout(() => navigate('/reservation/success', { state: { reservation: response.data } }), 2000);
                    })
                    .catch(err => {
                        console.error("Reservation API Error:", err);
                        toast.error("Payment successful but failed to create reservation. Please contact the restaurant!");
                    });
            } else {
                // --- CASHIER TERMINAL HANDLING ---
                toast.success('Payment Completed Successfully!');
                setTimeout(() => navigate('/cashier'), 5000);
            }
        } else {
            setStatus('failed');
            toast.error(message);
            // If failed, do not clear pending_reservation so the customer can "Retry"
        }
    }, [searchParams, navigate]);

    return (
        <div className="h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                {status === 'processing' && (
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="size-20 border-8 border-burgundy/10 border-t-burgundy rounded-full animate-spin mb-4" />
                        <p className="font-black uppercase text-sm italic tracking-widest">Verifying transaction...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-olive/5 border border-olive/20 p-10 rounded-[3rem] animate-in zoom-in-95 duration-500">
                        <div className="size-20 bg-olive text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-olive/20">✓</div>
                        <h2 className="text-3xl font-black italic text-olive uppercase tracking-tighter">Payment Successful</h2>
                        <p className="text-gray-500 font-bold text-sm mt-4 uppercase leading-relaxed">
                            {localStorage.getItem('pending_reservation')
                                ? 'Your reservation request is being initialized...'
                                : 'The invoice has been paid. You can now clear the table.'}
                        </p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="bg-burgundy/5 border border-burgundy/20 p-10 rounded-[3rem]">
                        <div className="size-20 bg-burgundy text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-burgundy/20">✕</div>
                        <h2 className="text-3xl font-black italic text-burgundy uppercase tracking-tighter">Payment Failed</h2>
                        <p className="text-gray-500 font-bold text-sm mt-4 uppercase tracking-wide">{searchParams.get('message')}</p>
                        <button
                            onClick={() => {
                                // If online reservation, go back to retry payment
                                const isReservation = localStorage.getItem('pending_reservation');
                                if (isReservation) {
                                    navigate(-1);
                                } else {
                                    navigate('/cashier'); // Back to cashier dashboard
                                }
                            }}
                            className="mt-8 bg-burgundy text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;