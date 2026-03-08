import React, { useEffect, useState } from "react";
import { kitchenApi } from "../services/kitchenApi";

interface Ingredient {
  id: number;
  name: string;
  stockQuantity: number;
  unit: string;
}

const InventoryTab: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await kitchenApi.getIngredients();
        
        // Log của má: response = { statusCode: 200, data: Array(19), ... }
        // Vậy mình phải lấy đúng cái mảng nằm trong response.data
        
        if (response && response.data) {
          // Gán cái mảng Array(19) vào state
          setIngredients(response.data); 
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu kho:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  if (loading) return <div className="p-8 text-burgundy animate-pulse font-black">SCANNING INVENTORY...</div>;

  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar pr-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* CHỐT CHẶN 2: Dùng Optional Chaining ?. để an toàn tuyệt đối */}
        {ingredients?.length > 0 ? (
          ingredients.map((item) => (
            <div key={item.id} className="bg-[#111111] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl hover:border-burgundy/20 transition-all">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-burgundy">inventory_2</span>
                </div>
                {/* Đảm bảo item.stockQuantity có giá trị mới so sánh */}
                {(item.stockQuantity ?? 0) < 10 && (
                  <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full animate-pulse">LOW</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-300 mb-1 uppercase tracking-tight">{item.name || 'N/A'}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{item.stockQuantity ?? 0}</span>
                <span className="text-gray-600 font-bold uppercase text-[10px]">{item.unit || ''}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 opacity-20">
             <p className="font-black uppercase tracking-widest">Inventory Empty!!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTab;