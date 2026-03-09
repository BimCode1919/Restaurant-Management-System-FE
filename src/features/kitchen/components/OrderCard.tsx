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
  type: string; 
  refresh: () => void;
}

const OrderCard: React.FC<Props> = ({ order, type, refresh }) => {
  
  // 1. HÀM XỬ LÝ KHI BẤM NÚT "XONG MÓN"
  const handleComplete = async () => {
    try {
      // Gọi API PATCH gửi chuỗi "READY" thuần trong body
      await kitchenApi.updateOrderStatus(order.id, "READY");
      refresh(); 
    } catch (error) {
      console.error("Status update error:", error);
      alert("Can not update order status to Ready. Please try again.");
    }
  };

  // 2. HÀM XỬ LÝ KHI BẤM NÚT "HỦY" (CHUYỂN VỀ PENDING)
  const handleCancelToPending = async () => {
    // Thêm xác nhận để tránh bấm nhầm khi đang làm việc nhanh
    if (window.confirm(`Are you sure you want to cancel and move the dish "${order.itemName}" back to the pending queue?`)) {
      try {
        // Gửi chuỗi "PENDING" để đưa món ăn ra khỏi danh sách đang nấu
        await kitchenApi.updateOrderStatus(order.id, "PENDING");
        refresh(); 
      } catch (error) {
        console.error("Status update error:", error);
        alert("Can not update order status to Pending. Please try again.");
      }
    }
  };

  // Chuẩn hóa type về viết hoa để so sánh logic hiển thị
  const currentType = type.toUpperCase();

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col shadow-2xl transition-all hover:border-white/20 mb-4">
      {/* Header Card */}
      <div className="p-5 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">TICKET</span>
            <h3 className="text-2xl font-black mt-1 text-white">#{order.id}</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-mono">TABLE</p>
            {/* Hiển thị N/A nếu API chưa trả về tableId */}
            <p className="text-lg font-black text-yellow-500">{order.tableId || "05"}</p>
          </div>
        </div>
      </div>

      {/* Body Card */}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-4">
          <span className="text-3xl font-black text-yellow-500 leading-none">
            {order.quantity}x
          </span>
          <div className="flex-1">
            <p className="text-xl font-bold text-white leading-tight uppercase tracking-tight">
              {order.itemName || "Unknown Item"}
            </p>
            {order.notes && (
              <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 italic text-gray-300">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NÚT BẤM - CHỈ HIỆN Ở CỘT PREPARING */}
      {currentType === "PREPARING" && (
        <div className="p-4 pt-0 flex flex-col gap-2">
          {/* Nút hoàn thành món */}
          <button
            onClick={handleComplete}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.97]"
          >
            <span className="material-symbols-outlined fill">check_circle</span>
            Mark as Ready
          </button>

          {/* Nút hủy chuyển về Pending */}
          <button
            onClick={handleCancelToPending}
            className="w-full bg-transparent border border-gray-600 hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-500 font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] text-sm"
          >
            <span className="material-symbols-outlined text-lg">close</span>
            Cancel to Pending
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;