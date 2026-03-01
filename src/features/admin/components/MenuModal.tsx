import React from 'react';
import { MenuItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem: MenuItem | null;
  // Chúng ta sẽ truyền dữ liệu đã parse về cho Hook xử lý
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MenuModal: React.FC<Props> = ({ isOpen, onClose, editingItem, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-burgundy">
              {editingItem ? 'edit_note' : 'add_circle'}
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-dark-gray">
              {editingItem ? 'Update Dish' : 'Create New Dish'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors material-symbols-outlined text-gray-400">
            close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-8 space-y-5">
          {/* Dish Name */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Dish Name</label>
            <input 
              name="name" 
              defaultValue={editingItem?.name} 
              required 
              placeholder="e.g. Wagyu Beef Steak"
              className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-burgundy focus:border-transparent outline-none transition-all border" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Price ($)</label>
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                defaultValue={editingItem?.price} 
                required 
                className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none" 
              />
            </div>
            {/* Unit */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Unit</label>
              <input 
                name="unit" 
                defaultValue={editingItem?.unit || 'Portion'} 
                required 
                placeholder="e.g. Set, Plate"
                className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category ID (Bạn nên truyền list categories từ BE vào đây, tạm thời để hardcode ID) */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Category ID</label>
              <select 
                name="categoryId" 
                className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none bg-white"
              >
                <option value="1">Main Courses (1)</option>
                <option value="2">Appetizers (2)</option>
                <option value="3">Desserts (3)</option>
                <option value="4">Drinks (4)</option>
              </select>
            </div>
            {/* Availability */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Status</label>
              <select 
                name="available" 
                defaultValue={editingItem?.available ? "true" : "false"}
                className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none bg-white font-bold"
              >
                <option value="true" className="text-green-600">Available</option>
                <option value="false" className="text-red-600">Sold Out</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Image URL</label>
            <input 
              name="imageUrl" 
              defaultValue={editingItem?.imageUrl} 
              placeholder="https://images.unsplash.com/..."
              className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Description</label>
            <textarea 
              name="description" 
              defaultValue={editingItem?.description} 
              required 
              className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none min-h-[100px] resize-none" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-4 bg-burgundy text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-burgundy/20 hover:bg-opacity-90 active:scale-95 transition-all mt-4"
          >
            {editingItem ? 'Save Updates' : 'Publish Dish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;