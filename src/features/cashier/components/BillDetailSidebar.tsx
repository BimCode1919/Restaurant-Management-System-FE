import React from 'react';
import { BillResponse, PaymentMethod } from '../types';

interface BillDetailSidebarProps {
  bill: BillResponse;
  onApplyDiscount: () => void;
  onCheckout: (method: PaymentMethod) => void;
  loading: boolean;
}

export const BillDetailSidebar: React.FC<BillDetailSidebarProps> = ({
  bill, onApplyDiscount, onCheckout, loading
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 shadow-2xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-burgundy italic uppercase">Bill Details</h2>
        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
          Table: {bill.tableNumbers?.join(', ')}
        </p>
      </div>

      {/* List Items */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
        {bill.orders?.flatMap(order => order.items).map((item, idx) => (
          <div key={idx} className="flex justify-between items-start border-b border-gray-50 pb-3">
            <div>
              <p className="font-bold text-dark-gray text-sm uppercase leading-tight">{item.itemName}</p>
              <p className="text-[10px] text-gray-400 font-bold">Qty: {item.quantity} x {item.price?.toLocaleString()}đ</p>
            </div>
            <span className="font-black text-dark-gray text-sm italic">{item.subtotal?.toLocaleString()}đ</span>
          </div>
        ))}
      </div>

      {/* Summary & Actions */}
      <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4">
        <div className="space-y-2 border-b border-gray-200 pb-4">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-400 uppercase">Subtotal</span>
            <span className="text-dark-gray">{bill.totalPrice?.toLocaleString()}đ</span>
          </div>

          <div className="flex justify-between text-xs font-bold items-center">
            <span className="text-olive uppercase">Discount</span>
            <div className="flex items-center gap-2">
              <span className="text-olive">-{bill.discountAmount?.toLocaleString()}đ</span>
              <button
                onClick={onApplyDiscount}
                className="bg-olive/10 text-olive text-[8px] px-2 py-1 rounded-full border border-olive/20 hover:bg-olive hover:text-white transition-all"
              >
                APPLY BEST
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-dark-gray uppercase tracking-widest">Total Amount</span>
          <span className="text-3xl font-black text-burgundy italic tracking-tighter">
            {bill.finalPrice?.toLocaleString()}đ
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            disabled={loading}
            onClick={() => onCheckout(PaymentMethod.CASH)}
            className="bg-dark-gray text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex flex-col items-center gap-1"
          >
            <span>Cash</span>
            <span className="opacity-50 text-[8px]">Thanh toán mặt</span>
          </button>

          <button
            disabled={loading}
            onClick={() => onCheckout(PaymentMethod.MOMO)}
            className="bg-[#A50064] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex flex-col items-center gap-1"
          >
            <span>MoMo</span>
            <span className="opacity-70 text-[8px]">QR Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};