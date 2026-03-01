import React from 'react';
import { MenuItem, Table, OrderItem } from '../types';

interface NewOrderModalProps {
  step: 'TABLE' | 'MENU';
  tables: Table[];
  menu: MenuItem[];
  cart: OrderItem[];
  selectedTable: string | null;
  onClose: () => void;
  onSelectTable: (id: string) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQty: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onFinalize: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = (props) => {
  const { step, tables, menu, cart, selectedTable, onClose, onSelectTable, onAddToCart, onUpdateCartQty, onRemoveFromCart, onUpdateNote, onFinalize } = props;

  return (
    <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-500 flex flex-col">
      <header className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {step === 'TABLE' ? 'Select Table' : `Ordering for Table ${selectedTable}`}
          </h2>
          <p className="text-gray-400 font-bold text-sm">Step {step === 'TABLE' ? '1' : '2'} of 2</p>
        </div>
        <button onClick={onClose} className="material-symbols-outlined text-gray-400 hover:text-dark-gray text-3xl">close</button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-10">
        {step === 'TABLE' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {tables.map((t) => (
              <button 
                key={t.id}
                onClick={() => onSelectTable(t.id)}
                className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${
                  t.status === 'OCCUPIED' 
                    ? 'bg-burgundy/5 border-burgundy text-burgundy shadow-inner' 
                    : 'bg-white border-gray-100 text-gray-300 hover:border-cheese hover:text-cheese'
                }`}
              >
                <span className="text-4xl font-black">{t.id}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{t.status}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto h-full">
            <div className="flex-1 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-400">Available Menu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => onAddToCart(item)}
                    className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 text-left hover:border-burgundy transition-all hover:shadow-lg group active:scale-95"
                  >
                    <div className="size-16 rounded-xl bg-cover shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                    <div className="flex-1">
                      <p className="font-bold text-dark-gray">{item.name}</p>
                      <p className="text-burgundy font-black text-sm">${item.price}</p>
                    </div>
                    <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-burgundy group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-[400px] flex flex-col bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
              <div className="p-6 bg-white border-b border-gray-100">
                <h3 className="font-black text-dark-gray uppercase tracking-widest">Ticket Items</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50">
                    <span className="material-symbols-outlined text-6xl">shopping_basket</span>
                    <p className="font-bold uppercase text-[10px] tracking-widest mt-4">Empty Ticket</p>
                  </div>
                ) : (
                  cart.map(i => (
                    <div key={i.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm animate-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-dark-gray">{i.name}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => onUpdateCartQty(i.id, -1)} className="size-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dark-gray">-</button>
                          <span className="font-black text-sm w-4 text-center">{i.quantity}</span>
                          <button onClick={() => onUpdateCartQty(i.id, 1)} className="size-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dark-gray">+</button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <input 
                          placeholder="Special note..." 
                          className="flex-1 bg-gray-50 border-none rounded-lg text-[10px] py-2 font-bold focus:ring-burgundy"
                          value={i.note}
                          onChange={(e) => onUpdateNote(i.id, e.target.value)}
                         />
                         <button onClick={() => onRemoveFromCart(i.id)} className="text-red-400 p-2"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 bg-white border-t border-gray-100">
                <div className="flex justify-between items-end mb-6">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtotal</p>
                  <p className="text-4xl font-black text-burgundy tracking-tighter">
                    ${cart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={onFinalize}
                  disabled={cart.length === 0}
                  className="w-full py-5 bg-olive text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-olive/20 disabled:opacity-30 active:scale-95 transition-all"
                >
                  Send to Kitchen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};