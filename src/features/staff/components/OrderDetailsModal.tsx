import React from 'react';
import { BillResponse, ItemStatus, TableResponse } from '../types';

interface OrderDetailsModalProps {
  bill: BillResponse;
  onClose: () => void;
  onAddMore: (table: any) => void; // Truyền object table để mở modal order tiếp
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ bill, onClose, onAddMore }) => {
  // Gom tất cả các món từ nhiều Orders trong Bill thành 1 danh sách phẳng
  const allItems = bill.orders.flatMap(order => order.items);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-dark-gray/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-dark-gray">
                Table {bill.tableNumbers.join(', ')}
              </h3>
              <span className="px-3 py-1 bg-burgundy text-white text-[10px] font-black rounded-lg uppercase">
                {bill.status}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] mt-1">
              Bill ID: #{bill.id} • {bill.partySize} Guests • Opened {new Date(bill.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="size-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-burgundy transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8">
          {/* Items Table */}
          <div className="max-h-[45vh] overflow-y-auto pr-4 custom-scrollbar">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="text-left pb-4">Order Item</th>
                  <th className="text-center pb-4">Status</th>
                  <th className="text-center pb-4">Qty</th>
                  <th className="text-right pb-4">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allItems.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <p className="font-bold text-dark-gray group-hover:text-burgundy transition-colors">{item.itemName}</p>
                      {item.notes && (
                        <div className="flex items-center gap-1 mt-1 text-cheese">
                          <span className="material-symbols-outlined text-xs">notes</span>
                          <p className="text-[10px] font-bold uppercase italic">{item.notes}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                        item.itemStatus === ItemStatus.READY ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.itemStatus}
                      </span>
                    </td>
                    <td className="py-4 text-center font-black text-sm text-dark-gray">{item.quantity}</td>
                    <td className="py-4 text-right font-black text-dark-gray">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Billing Summary */}
          <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-3">
              <button className="flex flex-col items-center gap-2 group">
                <div className="size-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-dark-gray group-hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined">print</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Reciept</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="size-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-olive group-hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Checkout</span>
              </button>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center gap-4 mb-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Total Amount</p>
                {bill.discountAmount > 0 && (
                  <span className="text-[10px] font-black text-olive uppercase">-{bill.discountAmount}$ Off</span>
                )}
              </div>
              <p className="text-6xl font-black text-burgundy tracking-tighter leading-none">
                ${bill.finalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => onAddMore(bill)}
            className="w-full mt-8 py-5 bg-dark-gray hover:bg-black text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add More Items to Table
          </button>
        </div>
      </div>
    </div>
  );
};