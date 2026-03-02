import React from 'react';

interface StaffHeaderProps {
  user: {
    fullName: string;
    avatar?: string;
    role?: string;
  };
  onNewOrder: () => void;
  onLogout: () => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ user, onNewOrder, onLogout }) => {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-burgundy size-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-burgundy/20">
          <span className="material-symbols-outlined text-2xl">restaurant</span>
        </div>
        <div>
          <h2 className="text-dark-gray text-lg font-black uppercase tracking-tighter leading-none">Terminal</h2>
          <p className="text-[10px] font-black text-cheese uppercase tracking-[0.2em]">Staff Edition</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onNewOrder}
          className="group flex items-center gap-2 bg-dark-gray hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 border-b-4 border-black/30"
        >
          <span className="material-symbols-outlined text-sm group-hover:rotate-90 transition-transform">add_circle</span>
          <span>Open New Table</span>
        </button>

        <div className="h-10 w-[1px] bg-gray-100 mx-2" />

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-dark-gray text-xs font-black uppercase">{user?.fullName || 'Staff User'}</p>
            <div className="flex items-center justify-end gap-1">
              <span className="size-1.5 rounded-full bg-olive animate-pulse"></span>
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Active Shift</p>
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
              className="size-11 rounded-2xl border-2 border-white shadow-md ring-1 ring-gray-100 group-hover:ring-burgundy transition-all"
              alt="Staff"
            />
          </div>
          <button
            onClick={onLogout}
            className="size-11 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
            title="Logout"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};