import React, { useState } from 'react';
import { customerApi } from '../services/customerApi';
import { AIRecommendRequest, AIRecommendResponse, MenuItem, OrderItem } from '../types';
import FloatingCart from './FloatingCart';

interface AIViewProps {
  menu: MenuItem[];
  onAdd: (item: MenuItem) => void;
  cart: OrderItem[];
}

const AIView: React.FC<AIViewProps> = ({ menu, onAdd, cart }) => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendResponse | null>(null);
  const [addedItems, setAddedItems] = useState<string[]>([]);

  const [formData, setFormData] = useState<AIRecommendRequest>({
    prompt: "",
    budget: 200000, // Giá trị mặc định
    people: 1,
    preferences: {
      spicy: false,
      vegetarian: false,
      mealType: 'dinner'
    }
  });

  const handleGetRecommendation = async () => {
    if (!formData.prompt.trim()) {
      alert("Please tell us your preference!");
      return;
    }
    setLoading(true);
    setAddedItems([]);
    try {
      const response = await customerApi.getAIRecommendation(formData);
      const aiData = (response as any).data?.data || (response as any).data;
      setRecommendation(aiData);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const findRealItem = (aiItemName: string) => {
    return menu.find(m => m.name.toLowerCase().includes(aiItemName.toLowerCase()));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-burgundy">auto_awesome</span>
          <h2 className="text-xs font-black uppercase tracking-widest text-dark-gray italic">AI Smart Order</h2>
        </div>

        {/* Prompt Input */}
        <textarea
          value={formData.prompt}
          onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20 outline-none transition-all min-h-[100px] mb-6"
          placeholder="I'm looking for a healthy dinner..."
        />

        {/* FIX: Thêm ô nhập Budget bị thiếu */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mb-2 block">
              Budget Range (VND)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* 2 Nút Spicy & Vegetarian */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setFormData({ ...formData, preferences: { ...formData.preferences, spicy: !formData.preferences.spicy } })}
            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${formData.preferences.spicy ? 'bg-burgundy border-burgundy text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
          >
            <span className="material-symbols-outlined text-sm">local_fire_department</span>
            Spicy
          </button>
          <button
            onClick={() => setFormData({ ...formData, preferences: { ...formData.preferences, vegetarian: !formData.preferences.vegetarian } })}
            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${formData.preferences.vegetarian ? 'bg-burgundy border-burgundy text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
          >
            <span className="material-symbols-outlined text-sm">eco</span>
            Vegetarian
          </button>
        </div>

        <button
          onClick={handleGetRecommendation}
          disabled={loading}
          className="w-full bg-[#1A1C1E] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          {loading ? 'Processing...' : 'Get Suggestion'}
        </button>
      </div>

      {/* Gợi ý từ AI (Sẽ ẩn sau khi bấm +) */}
      {recommendation && (
        <div className="space-y-4 mb-12">
          {[
            { type: 'Appetizer', name: recommendation.appetizer },
            { type: 'Main Course', name: recommendation.mainCourse },
            { type: 'Dessert', name: recommendation.dessert }
          ]
          .filter(rec => !addedItems.includes(rec.name))
          .map((rec, idx) => {
            const realItem = findRealItem(rec.name);
            return (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-50 flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-burgundy uppercase tracking-widest mb-1">{rec.type}</span>
                  <span className="font-bold text-dark-gray italic">{rec.name}</span>
                </div>
                {realItem && (
                  <button
                    onClick={() => {
                      onAdd(realItem);
                      setAddedItems(prev => [...prev, rec.name]);
                    }}
                    className="size-10 bg-burgundy text-white rounded-xl flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Hiển thị Cart ở dưới cùng theo đúng hình 1 */}
    <FloatingCart 
            cart={cart} 
            total={cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)} 
            onOpenReview={() => (window as any).openReviewModal()} // Hoặc truyền hàm mở modal từ props
        />
        </div>
  );
};

export default AIView;