import React from 'react';
import { MenuItem, OrderItem } from '../types';

interface Props {
  onClose: () => void;
  cart: OrderItem[];
  tables?: any[];
  menu?: MenuItem[];
  selectedTable?: string;
  onSelectTable?: (id: string) => void;
  onAddToCart?: (item: MenuItem) => void;
  onRemoveFromCart?: (id: string) => void;
  onSubmitOrder?: () => void;
}

const ManualOrderOverlay: React.FC<Props> = ({ 
  onClose, cart, tables = [], menu = [], selectedTable, onSelectTable, onAddToCart, onRemoveFromCart, onSubmitOrder 
}) => {
  const totalDue = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <div className="fixed inset-0 z-[200] flex bg-white animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Sidebar: Order Info */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-white">
          <h3 className="text-2xl font-black uppercase tracking-tight">Direct Ordering</h3>
          <button onClick={onClose} className="material-symbols-outlined">close</button>
        </div>
        
        <div className="p-8 space-y-4">
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Assign Table</label>
          <div className="grid grid-cols-4 gap-2">
            {tables.map((t: any) => (
              <button 
                key={t.id} 
                onClick={() => onSelectTable?.(t.id)}
                className={`h-12 rounded-xl font-bold transition-all ${selectedTable === t.id ? 'bg-[#800020] text-white' : 'bg-white border border-gray-200'}`}
              >
                {t.id}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cart Summary</h4>
          {cart.map(i => (
            <div key={i.id} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-dark-gray">{i.name}</p>
                <p className="text-xs text-gray-500">{i.quantity} x ${i.price}</p>
              </div>
              <button onClick={() => onRemoveFromCart?.(i.id)} className="text-red-600">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>

        <div className="p-8 bg-white border-t border-gray-200">
           <div className="flex justify-between items-end mb-6">
             <p className="text-xs font-black uppercase text-gray-400">Total Due</p>
             <p className="text-4xl font-black text-[#800020]">${totalDue.toFixed(2)}</p>
           </div>
           <button onClick={onSubmitOrder} className="w-full py-5 bg-[#FFD700] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl">
             Send Order
           </button>
        </div>
      </div>

      {/* Main Content: Menu Selection */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h3 className="text-3xl font-black text-dark-gray uppercase tracking-tighter mb-8">Menu Selection</h3>
        <div className="grid grid-cols-3 gap-6">
          {menu.map((item) => (
            <button 
              key={item.id} 
              onClick={() => onAddToCart?.(item)}
              className="bg-white border-2 p-4 rounded-3xl text-left hover:border-[#800020] transition-all flex gap-4"
            >
              <div className="size-16 rounded-2xl bg-gray-200 shrink-0" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }}></div>
              <div>
                <p className="font-bold text-md leading-tight">{item.name}</p>
                <p className="text-[#800020] font-black text-sm">${item.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManualOrderOverlay;