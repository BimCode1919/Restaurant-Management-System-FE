import React from 'react';
import { PaymentMethod } from '../types';

interface PaymentActionCardProps {
    finalAmount: number;
    onPay: (method: PaymentMethod) => void;
    isProcessing: boolean;
}

export const PaymentActionCard: React.FC<PaymentActionCardProps> = ({ finalAmount, onPay, isProcessing }) => {
    return (
        <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
                <button
                    disabled={isProcessing}
                    onClick={() => onPay(PaymentMethod.CASH)}
                    className="group flex-1 bg-dark-gray hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex flex-col items-center gap-0.5 disabled:opacity-50"
                >
                    <span className="group-hover:scale-110 transition-transform">Cash</span>
                    <span className="text-[7px] font-normal opacity-40 lowercase tracking-normal italic">It Just Cash</span>
                </button>

                <button
                    disabled={isProcessing}
                    onClick={() => onPay(PaymentMethod.MOMO)}
                    className="group flex-1 bg-[#A50064] hover:bg-[#850050] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex flex-col items-center gap-0.5 disabled:opacity-50 shadow-lg shadow-[#A50064]/20"
                >
                    <span className="group-hover:scale-110 transition-transform">MoMo</span>
                    <span className="text-[7px] font-normal opacity-60 lowercase tracking-normal italic">Online Banking</span>
                </button>
            </div>
        </div>
    );
};