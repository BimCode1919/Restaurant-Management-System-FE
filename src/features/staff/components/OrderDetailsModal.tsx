import React from 'react';
import { Order } from '../types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onAddMore: (tableId: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onAddMore }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Table {order.tableId} Details</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Ticket #{order.id} • Assigned to {order.waiterName}</p>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-gray-400 hover:text-dark-gray">close</button>
        </div>
        <div className="p-8">
           <div className="mb-6 flex justify-between items-center">
             <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-olive/10 text-olive border-olive/20">
                Current Status: {order.status}
              </span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Created {new Date(order.createdAt).toLocaleTimeString()}</span>
           </div>
           
           <div className="max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
             <table className="w-full">
               <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                 <tr>
                   <th className="text-left pb-4">Item</th>
                   <th className="text-center pb-4">Qty</th>
                   <th className="text-right pb-4">Subtotal</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {order.items.map(item => (
                   <tr key={item.id}>
                     <td className="py-4">
                       <p className="font-bold text-dark-gray">{item.name}</p>
                       {item.note && <p className="text-[10px] text-burgundy font-bold uppercase italic mt-0.5">Note: {item.note}</p>}
                     </td>
                     <td className="py-4 text-center font-black text-sm">{item.quantity}</td>
                     <td className="py-4 text-right font-black text-dark-gray">${(item.price * item.quantity).toFixed(2)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-end">
              <div className="flex gap-4">
                <button className="flex flex-col items-center gap-1 group">
                  <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-burgundy group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">print</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Kitchen</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-olive group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">receipt</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Check</span>
                </button>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total</p>
                <p className="text-5xl font-black text-burgundy tracking-tighter">${order.total.toFixed(2)}</p>
              </div>
           </div>
           
           <button 
            onClick={() => onAddMore(order.tableId)}
            className="w-full mt-10 py-5 bg-cheese text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-cheese/20 active:scale-95 transition-transform"
           >
             Add More Items
           </button>
        </div>
      </div>
    </div>
  );
};