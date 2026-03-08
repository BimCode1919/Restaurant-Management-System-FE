import React from 'react';
import { PaymentMethod } from '../types';

interface PaymentActionCardProps {
    finalAmount: number;
    onPay: (method: PaymentMethod) => void;
    isProcessing: boolean;
}

export const PaymentActionCard: React.FC<PaymentActionCardProps> = ({ finalAmount, onPay, isProcessing }) => {
    return (
        <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payable Amount</p>
                    <p className="text-4xl font-black text-burgundy italic tracking-tighter">
                        {finalAmount?.toLocaleString()}đ
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    disabled={isProcessing}
                    onClick={() => onPay(PaymentMethod.CASH)}
                    className="flex-1 bg-dark-gray hover:bg-black text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all flex flex-col items-center gap-1 disabled:opacity-50"
                >
                    <span>Cash Payment</span>
                    <span className="text-[8px] font-normal opacity-60 italic">Nhận tiền mặt</span>
                </button>

                <button
                    disabled={isProcessing}
                    onClick={() => onPay(PaymentMethod.MOMO)}
                    className="flex-1 bg-[#A50064] hover:opacity-90 text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all flex flex-col items-center gap-1 disabled:opacity-50"
                >
                    <span>MoMo Wallet</span>
                    <span className="text-[8px] font-normal opacity-80 italic">Cổng thanh toán</span>
                </button>
            </div>
        </div>
    );
};