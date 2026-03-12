import React from "react";
import OrderCard from "./OrderCard";

interface Props {
  title: string;
  orders: any[];
  type: "PREPARING" | "READY";
  store: any;
  refresh: () => void;
}

const OrderColumn: React.FC<Props> = ({ title, orders, type, store, refresh }) => {
  return (
    /* 1. h-[calc(100vh-120px)]: Ép cái khung cột cố định theo màn hình.
       2. overflow-y-auto: Kích hoạt khả năng cuộn cho TOÀN BỘ nội dung bên trong div này.
       3. scrollbar-hide: Thêm vào nếu má muốn ẩn thanh cuộn cho đẹp.
    */
    <div className="flex flex-col w-1/2 bg-[#161616]/50 p-6 rounded-[2.5rem] border border-white/5 shadow-inner h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      
      {/* 1. PHẦN TIÊU ĐỀ: Bây giờ nó sẽ cuộn đi luôn khi má vuốt xuống */}
      <div className="flex justify-between items-center px-4 py-2 mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${type === 'PREPARING' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
            {title}
          </h2>
        </div>
        <div className="bg-white/10 px-4 py-1 rounded-full border border-white/10">
          <span className="text-xs font-bold text-gray-400">{orders.length} MÓN</span>
        </div>
      </div>

      {/* 2. DANH SÁCH CARD: Không để overflow ở đây nữa để nó đi theo tiêu đề */}
      <div className="flex flex-col gap-6">
          {orders.length > 0 ? (
              orders.map((o: any) => (
                <OrderCard 
                    key={o.id} 
                    order={o} 
                    type={type} 
                    refresh={refresh} 
                />
              ))
          ) : (
              <div className="flex flex-col items-center justify-center opacity-20 py-20">
                <span className="material-symbols-outlined text-6xl mb-2">inbox</span>
                <p className="text-sm font-bold uppercase tracking-widest">Empty</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default OrderColumn;