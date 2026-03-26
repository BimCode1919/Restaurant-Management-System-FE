import React from 'react';
import { AdminTab } from '../types';

interface Props {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  user: any;
  logout: () => void;
}

const AdminSidebar: React.FC<Props> = ({ activeTab, setActiveTab, user, logout }) => {
  // Định nghĩa cứng danh sách Menu để tránh lỗi map từ props truyền vào
  const menuItems: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: 'dashboard' },
    { id: 'MENU', label: 'Menu', icon: 'restaurant_menu' },
    { id: 'INVENTORY', label: 'Inventory', icon: 'inventory_2' },
    { id: 'STAFF', label: 'Staff', icon: 'badge' },
    { id: 'REPORTS', label: 'Reports', icon: 'bar_chart' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
      <div className="p-8 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 bg-burgundy rounded-xl flex items-center justify-center text-white shadow-lg shadow-burgundy/20">
            <span className="material-symbols-outlined">restaurant</span>
          </div>
          <h1 className="text-xl font-black text-dark-gray uppercase tracking-tighter">Resto</h1>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Admin Portal</p>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-burgundy text-white shadow-xl shadow-burgundy/20 scale-[1.02]' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-burgundy'}`}>
              {item.icon}
            </span>
            <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 mb-4">
          <div className="size-10 rounded-xl bg-burgundy/10 flex items-center justify-center text-burgundy font-black">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="truncate">
            <p className="text-xs font-black text-dark-gray truncate uppercase">{user?.fullName || 'Administrator'}</p>
            <p className="text-[10px] font-bold text-gray-400 truncate">{user?.email || 'admin@restaurant.com'}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">logout</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;