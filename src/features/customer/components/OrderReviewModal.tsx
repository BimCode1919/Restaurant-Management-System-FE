import React from 'react';
import { OrderItem } from '../types';

// Define interface matching CustomerMenu
interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  updateQty: (id: number, delta: number) => void;
  total: number;
  onSubmit: () => Promise<void>;
}

const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  cart,
  updateQty,
  total,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-300">

        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black uppercase italic text-dark-gray">Cart</h2>
          <button onClick={onClose} className="size-10 bg-gray-50 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-400">close</span>
          </button>
        </div>

        <div className="max-h-[40vh] overflow-y-auto space-y-4 mb-8 pr-2">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex-1">
                <h4 className="font-bold text-sm text-dark-gray">{item.name}</h4>
                <p className="text-burgundy font-black text-xs">
                  {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="size-7 flex items-center justify-center bg-gray-50 rounded-lg font-black text-gray-600 hover:bg-gray-100"
                > − </button>
                <span className="font-black text-sm w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="size-7 flex items-center justify-center bg-gray-900 text-white rounded-lg font-black hover:bg-burgundy"
                > + </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <p className="text-center text-gray-400 py-10 font-bold uppercase text-[10px] tracking-widest">Cart is empty</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-2xl font-black text-dark-gray">
                {new Intl.NumberFormat('vi-VN').format(total)}VNĐ
              </p>
            </div>
            <p className="text-[10px] font-bold text-burgundy bg-burgundy/10 px-3 py-1 rounded-full uppercase">
              {cart.length} dish{cart.length > 1 ? 'es' : ''}
            </p>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={onSubmit}
            className="w-full bg-burgundy disabled:bg-gray-300 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-burgundy/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Confirm Order
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewModal;