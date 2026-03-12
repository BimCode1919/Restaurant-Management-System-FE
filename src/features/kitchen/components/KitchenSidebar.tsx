import React from "react";

type KitchenTab = "ACTIVE" | "INVENTORY"; // Bỏ HISTORY ở đây nè má

interface Props {
  activeTab: KitchenTab;
  setActiveTab: (tab: KitchenTab) => void;
  logout: () => void;
}

const KitchenSidebar: React.FC<Props> = ({ activeTab, setActiveTab, logout }) => {
  // Tui đã lược bỏ History, chỉ còn Active và Inventory thôi
  const menuItems = [
    { id: "ACTIVE", label: "Active", icon: "receipt_long" },
    { id: "INVENTORY", label: "Inventory", icon: "inventory_2" },
  ];

  return (
    <aside className="w-[280px] bg-[#0A0A0A] border-r border-white/5 flex flex-col justify-between p-6 shrink-0">
      <div className="space-y-8">
        {/* Logo KITCHENPRO */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-burgundy rounded-xl flex items-center justify-center shadow-lg shadow-burgundy/20">
            <span className="material-symbols-outlined text-white">restaurant</span>
          </div>
          <h1 className="font-black text-xl tracking-tight uppercase">
            KITCHEN<span className="text-burgundy">PRO</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as KitchenTab)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? "bg-burgundy text-white shadow-lg shadow-burgundy/20" 
                : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'fill' : ''}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Nút Đăng xuất */}
      <button 
        onClick={logout} 
        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
      >
        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-300">logout</span>
        <span className="font-bold text-sm">Log Out</span>
      </button>
    </aside>
  );
};

export default KitchenSidebar;