import React, { useState } from 'react';
import { MenuItem } from '../types';

interface MenuListViewProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
  onView: (item: MenuItem) => void;
}

const MenuListView: React.FC<MenuListViewProps> = ({ items, onAdd, onView }) => {
  // 1. Thêm state để quản lý category
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // 2. Lấy danh sách category duy nhất
  const categories = ['ALL', ...Array.from(new Set(items.map(item => item.categoryName)))];
  // 3. Lọc danh sách món ăn
const filteredItems = selectedCategory === 'ALL' 
    ? items 
    : items.filter(item => item.categoryName === selectedCategory);
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-burgundy uppercase tracking-tighter">Our Menu Today</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Special Selection</p>
      </div>

      {/* --- THANH FILTER CATEGORIES --- */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-burgundy text-white shadow-md' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {cat === 'ALL' ? 'all' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Dùng filteredItems thay vì items gốc */}
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-[2rem] p-3 flex gap-4 shadow-sm border border-gray-100 group active:scale-[0.98] transition-all">
            
            {/* Thay nguyên cái div backgroundImage cũ bằng đoạn này nhé má */}
            <div 
              onClick={() => onView(item)}
              className="size-24 rounded-2xl overflow-hidden shrink-0 border border-gray-50 cursor-pointer"
            >
             <div className="size-24 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                <img 
                  // 1. Sử dụng item.id để khớp với tên file trong thư mục public/menu/
                  // Lưu ý: Vì ảnh nằm trong public/menu nên đường dẫn bắt đầu từ /menu/
                  src={`/menu/${item.id}.jpg`} 
                  
                  alt={item.name}
                  className="w-full h-full object-cover"
                  
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    
                    // 2. Nếu không tìm thấy file id.jpg, thử tìm file id.png (phòng hờ sai định dạng)
                    const pngFallback = `/menu/${item.id}.png`;
                    
                    // 3. Nếu cả 2 đều hẻo, dùng ảnh random theo chủ đề món ăn cho đẹp
                    const randomFoodUrl = `https://loremflickr.com/400/400/food,${encodeURIComponent(item.name)}`;
                    
                    if (target.src.includes('.jpg') && !target.src.includes('loremflickr')) {
                      target.src = pngFallback;
                    } else if (target.src !== randomFoodUrl) {
                      target.src = randomFoodUrl;
                      target.onerror = null; // Dừng loop
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between py-1">
              <div onClick={() => onView(item)} className="cursor-pointer">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-dark-gray text-sm leading-tight">{item.name}</h3>
                  <span className="text-burgundy font-black text-sm">
                    {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-black mt-1">{item.categoryName}</p>
              </div>

              <button
                onClick={() => onAdd(item)}
                className="w-full h-9 bg-gray-100 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-burgundy hover:text-white transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuListView;