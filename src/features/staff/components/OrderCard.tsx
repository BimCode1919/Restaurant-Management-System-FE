import React from 'react';
import { BillResponse, ItemStatus, BillStatus } from '../types';

interface OrderCardProps {
  bill: BillResponse;
  onViewDetail?: (billId: number) => void;
  onCloseBill?: (billId: number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ bill, onViewDetail }) => {
  // Thêm kiểm tra nếu bill không tồn tại thì trả về 0 hết
  const getItemSummary = () => {
    let pending = 0;
    let ready = 0;
    let served = 0;

    // Sử dụng ?. để tránh lỗi nếu bill hoặc orders bị undefined
    bill?.orders?.forEach(order => {
      order.items?.forEach(item => {
        if (item.itemStatus === ItemStatus.PENDING || item.itemStatus === ItemStatus.PREPARING) pending += item.quantity;
        if (item.itemStatus === ItemStatus.READY) ready += item.quantity;
        if (item.itemStatus === ItemStatus.SERVED) served += item.quantity;
      });
    });

    return { pending, ready, served };
  };

  // Nếu không có bill, không render gì cả hoặc render một khung trống
  if (!bill) return null;

  const { pending, ready, served } = getItemSummary();

  // Mapping màu sắc theo trạng thái món ăn
  const statusColors = {
    [ItemStatus.PENDING]: 'bg-amber-100 text-amber-700',
    [ItemStatus.PREPARING]: 'bg-blue-100 text-blue-700',
    [ItemStatus.READY]: 'bg-green-100 text-green-700 animate-pulse border border-green-500',
    [ItemStatus.SERVED]: 'bg-gray-100 text-gray-500',
    [ItemStatus.CANCELLED]: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-[2rem] border-2 border-burgundy/10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
      {/* Header */}
      <div className="p-6 pb-4 flex justify-between items-start bg-burgundy/[0.02]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-black text-dark-gray tracking-tighter uppercase">
              Table {bill.tableNumbers.join(', ')}
            </span>
          </div>
          {/* Badge Trạng thái đậm hơn */}
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              Occupied
            </span>
          </div>
        </div>
        {/* Nút Manage nổi bật hơn */}
        <button
          onClick={() => onViewDetail?.(bill.id)}
          className="bg-dark-gray text-white p-2 rounded-xl hover:bg-burgundy transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-sm">edit_square</span>
        </button>
      </div>

      {/* Body: Item Status Summary */}
      <div className="px-6 py-4 flex-1">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
            <p className="text-xl font-black text-dark-gray">{pending}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Waiting</p>
          </div>
          <div className={`rounded-2xl p-3 text-center border transition-all ${ready > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
            <p className={`text-xl font-black ${ready > 0 ? 'text-green-600' : 'text-dark-gray'}`}>{ready}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Ready</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
            <p className="text-xl font-black text-dark-gray">{served}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Served</p>
          </div>
        </div>

        {/* Quick Item List (Optional: only show last few items) */}
        <div className="mt-4 space-y-2">
          {bill.orders.flatMap(o => o.items).slice(-3).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-gray-600 truncate max-w-[120px]">
                {item.quantity}x {item.itemName}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-black uppercase text-[8px] ${statusColors[item.itemStatus]}`}>
                {item.itemStatus}
              </span>
            </div>
          ))}
          {(pending + ready + served) > 3 && (
            <p className="text-[9px] text-gray-300 font-bold text-center italic mt-2">
              + {(pending + ready + served) - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Footer: Price & Actions */}
      <div className="p-6 pt-0 mt-auto">
        <div className="flex justify-between items-end mb-4 border-t border-dashed border-gray-100 pt-4">
          <p className="text-[10px] font-black text-gray-300 uppercase">Subtotal</p>
          <p className="text-2xl font-black text-burgundy tracking-tighter">
            ${bill.totalPrice.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetail?.(bill.id)}
            className="flex-1 bg-dark-gray text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-colors"
          >
            Manage
          </button>
          {ready > 0 && (
            <button className="bg-green-500 text-white px-4 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
              <span className="material-symbols-outlined">concierge_bell</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};