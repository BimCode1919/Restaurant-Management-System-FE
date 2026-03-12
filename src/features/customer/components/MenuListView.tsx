import React from 'react';
import { MenuItem } from '../types';

interface MenuListViewProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
  onView: (item: MenuItem) => void;
}

const MenuListView: React.FC<MenuListViewProps> = ({ items, onAdd, onView }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-black text-burgundy uppercase tracking-tighter">Our Menu Today</h2>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Special Selection</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-white rounded-[2rem] p-3 flex gap-4 shadow-sm border border-gray-100 group active:scale-[0.98] transition-all">

          {/* Click image to view details */}
          <div
            onClick={() => onView(item)}
            className="size-24 rounded-2xl bg-cover bg-center shrink-0 border border-gray-50 cursor-pointer"
            style={{ backgroundImage: `url(${item.imageUrl && item.imageUrl !== 'string' ? item.imageUrl : 'https://via.placeholder.com/150'})` }}
          ></div>

          <div className="flex-1 flex flex-col justify-between py-1">
            <div onClick={() => onView(item)} className="cursor-pointer">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-dark-gray text-sm leading-tight">{item.name}</h3>
                <span className="text-burgundy font-black text-sm">
                  {new Intl.NumberFormat('vi-VN').format(item.price)}đ
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

export default MenuListView;