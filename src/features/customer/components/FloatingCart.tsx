import React from 'react';
import { OrderItem } from '../types';

interface FloatingCartProps {
  cart: OrderItem[];
  total: number;
  onOpenReview: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ cart, total, onOpenReview }) => {
  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-50 animate-in slide-in-from-bottom-10">
      <button
        onClick={onOpenReview}
        className="w-full bg-gray-900 text-white p-5 rounded-[2rem] shadow-2xl flex items-center justify-between group active:scale-95 transition-all border border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="size-10 bg-burgundy rounded-xl flex items-center justify-center text-white font-black animate-pulse shadow-lg shadow-burgundy/30">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </div>

          <div className="text-left">
            <span className="block font-black uppercase text-[10px] tracking-widest text-white/60 leading-none mb-1">
              View Cart
            </span>
            <span className="block font-black uppercase text-xs tracking-widest italic text-burgundy-light">
              Review your items
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter leading-none">
            Total
          </p>
          <span className="text-xl font-black">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
          </span>
        </div>
      </button>
    </div>
  );
};

export default FloatingCart;