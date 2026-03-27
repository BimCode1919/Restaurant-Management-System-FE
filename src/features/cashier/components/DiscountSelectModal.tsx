import React, { useEffect, useRef } from 'react';
import { Discount } from '../hooks/useDiscounts';

interface DiscountSelectModalProps {
  open: boolean;
  discounts: Discount[];
  loading: boolean;
  onClose: () => void;
  onSelect: (discount: Discount) => void;
  fetchDiscounts: () => void;
  billTotal?: number;
}

export const DiscountSelectModal: React.FC<DiscountSelectModalProps> = ({
  open, discounts, loading, onClose, onSelect, fetchDiscounts, billTotal
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (open && !fetchedRef.current) {
      fetchDiscounts();
      fetchedRef.current = true;
    }
    if (!open) {
      fetchedRef.current = false;
    }
  }, [open, fetchDiscounts]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-8 relative animate-in fade-in zoom-in">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-outlined text-gray-400">close</span>
        </button>
        <h2 className="text-2xl font-black text-burgundy mb-6">Select Discount</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">Loading...</div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {discounts.length === 0 && <div className="text-center text-gray-400 italic">No available discounts</div>}
            {discounts.map(discount => {
              const minOrder = discount.minOrderAmount || 0;
              const notEnough = billTotal !== undefined && billTotal < minOrder;
              return (
                <div
                  key={discount.id}
                  className={`border border-gray-100 rounded-2xl p-4 flex flex-col gap-1 bg-gray-50 transition cursor-pointer ${notEnough ? 'opacity-50 pointer-events-none' : 'hover:bg-olive/10'}`}
                  onClick={() => {
                    if (notEnough) {
                      setError(`Minimum order to apply: ${minOrder.toLocaleString()}₫. Current order: ${billTotal?.toLocaleString()}₫`);
                      return;
                    }
                    setError(null);
                    onSelect(discount);
                  }}
                >
                  <span className="font-black text-dark-gray text-lg mb-1">{discount.name}</span>
                  <span className="text-xs text-gray-500 italic mb-1">{discount.description}</span>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{discount.discountType}</span>
                  {discount.minOrderAmount && (
                    <span className="text-xs text-gray-400">Min order: {discount.minOrderAmount.toLocaleString()}₫</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {error && <div className="mt-4 text-red-500 text-xs font-bold text-center">{error}</div>}
      </div>
    </div>
  );
};
