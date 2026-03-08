import React from "react";
import { kitchenApi } from "../services/kitchenApi";

interface Props {
  order: {
    id: number;
    tableId?: string;
    itemName: string;
    quantity: number;
    itemStatus: string;
    notes?: string;
  };
  type: string; // Để string cho nó linh hoạt, đỡ bị lệch hoa thường
  refresh: () => void;
}

const OrderCard: React.FC<Props> = ({ order, type, refresh }) => {
  
  // HÀM XỬ LÝ KHI BẤM NÚT "XONG MÓN"
  const handleComplete = async () => {
    try {
      // Swagger yêu cầu body là "READY" (chuỗi thuần, không phải object)
      await kitchenApi.updateOrderStatus(order.id, "READY");
      refresh(); 
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể chuyển sang Ready. Má kiểm tra lại kết nối nhé!");
    }
  };

  // Chuẩn hóa type về viết hoa để so sánh cho chắc
  const currentType = type.toUpperCase();

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col shadow-2xl transition-all hover:border-white/20 mb-4">
      {/* Header Card */}
      <div className="p-5 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">TICKET</span>
            <h3 className="text-2xl font-black mt-1">#{order.id}</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-mono">TABLE</p>
            <p className="text-lg font-black text-yellow-500">{order.tableId || "05"}</p>
          </div>
        </div>
      </div>

      {/* Body Card - PHẢI HIỆN TÊN MÓN Ở ĐÂY */}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-4">
          <span className="text-3xl font-black text-yellow-500 leading-none">
            {order.quantity}x
          </span>
          <div className="flex-1">
            {/* API trả về itemName, mình dùng đúng itemName */}
            <p className="text-xl font-bold text-white leading-tight uppercase tracking-tight">
              {order.itemName || "Doesn't exist"}
            </p>
            {order.notes && (
              <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NÚT BẤM - CHỈ HIỆN Ở CỘT PREPARING */}
      {currentType === "PREPARING" && (
        <div className="p-4 pt-0">
          <button
            onClick={handleComplete}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.97]"
          >
            <span className="material-symbols-outlined fill">check_circle</span>
            Mark as Ready
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;