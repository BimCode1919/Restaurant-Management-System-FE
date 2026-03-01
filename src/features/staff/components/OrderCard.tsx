import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  onView: (order: Order) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onView, onUpdateStatus }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all group">
      <div className="p-6 flex justify-between items-start bg-burgundy text-white">
        <div>
          <h3 className="text-3xl font-black tracking-tighter">TABLE {order.tableId}</h3>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Ticket #{order.id}</p>
        </div>
        <div className="bg-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">history</span>
          3m Ago
        </div>
      </div>
      <div className="p-6 flex-1">
        <ul className="space-y-4">
          {order.items.slice(0, 3).map(item => (
            <li key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="font-black text-burgundy text-sm">{item.quantity}x</span>
                <span className="text-sm font-bold text-dark-gray">{item.name}</span>
              </div>
            </li>
          ))}
          {order.items.length > 3 && (
            <li className="text-[10px] font-black text-gray-400 uppercase tracking-widest">+{order.items.length - 3} more items...</li>
          )}
        </ul>
      </div>
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
            order.status === 'PENDING' ? 'bg-cheese/10 text-cheese border-cheese/20' :
            order.status === 'PREPARING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
            'bg-olive/10 text-olive border-olive/20'
          }`}>
            {order.status}
          </span>
          <span className="text-dark-gray font-black">${order.total.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onView(order)}
            className="h-10 bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors"
          >
            View Details
          </button>
          {order.status === 'PENDING' && (
            <button 
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              className="h-10 bg-burgundy text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-red-900 transition-colors"
            >
              Fire Ticket
            </button>
          )}
          {order.status === 'READY' && (
            <button 
              onClick={() => onUpdateStatus(order.id, 'SERVED')}
              className="h-10 bg-olive text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-green-800 transition-colors"
            >
              Mark Served
            </button>
          )}
        </div>
      </div>
    </div>
  );
};