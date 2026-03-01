import React from 'react';

interface StaffHeaderProps {
  user: any;
  onNewOrder: () => void;
  onLogout: () => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ user, onNewOrder, onLogout }) => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-burgundy size-8 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl font-bold">restaurant_menu</span>
        </div>
        <h2 className="text-burgundy text-xl font-black uppercase tracking-tighter">Staff Terminal</h2>
      </div>
      <div className="flex items-center gap-6">
        <button 
          onClick={onNewOrder}
          className="flex items-center gap-2 bg-cheese hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>New Order</span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-dark-gray text-xs font-black uppercase">{user?.fullName}</p>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">On Service</p>
          </div>
          <img src={user?.avatar} className="size-10 rounded-2xl border-2 border-white shadow-sm ring-1 ring-gray-100" alt="Staff" />
          <button onClick={onLogout} className="p-2 text-gray-400 hover:text-burgundy">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};