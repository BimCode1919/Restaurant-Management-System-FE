// src/features/admin/components/views/MenuView.tsx
import React from 'react';
import { MenuItem } from '../types';

interface Props {
  menu: MenuItem[];
  loading: boolean;
  menuSearch: string;
  setMenuSearch: (val: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

const MenuView: React.FC<Props> = ({ 
  menu, loading, menuSearch, setMenuSearch, onEdit, onDelete, onAddNew 
}) => {
  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search & Add Button */}
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-burgundy outline-none"
            placeholder="Search dishes..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={onAddNew}
          className="bg-burgundy text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span> New Dish
        </button>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-widest">
              <th className="px-8 py-6">Item</th>
              <th className="px-8 py-6">Category</th>
              <th className="px-8 py-6">Price</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {menu.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 group transition-colors">
                <td className="px-8 py-5 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-gray-100 bg-cover" style={{ backgroundImage: `url(${item.imageUrl || ''})` }}></div>
                  <div>
                    <p className="font-bold text-dark-gray">{item.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">{item.unit}</p>
                  </div>
                </td>
                <td className="px-8 py-5 text-[10px] font-black uppercase text-gray-500">{item.categoryName}</td>
                <td className="px-8 py-5 font-black text-burgundy">${item.price}</td>
                <td className="px-8 py-5">
                   <span className={`text-[10px] font-black uppercase ${item.available ? 'text-green-500' : 'text-red-400'}`}>
                     {item.available ? 'Available' : 'Sold Out'}
                   </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuView;