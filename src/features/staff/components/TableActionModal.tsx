import React from 'react';
import { ItemStatus, OrderResponse, TableActionModalProps } from '../types';

export const TableActionModal: React.FC<TableActionModalProps> = ({
    tableNumber, billData, onClose, onUpdateOrder, onCancelItem, onMassUpdate, onServeItem
}) => {

    // Gom tất cả items và xác định các Order có món PENDING
    const { allItems, pendingOrders, calculatedTotal } = React.useMemo(() => {
        const orders: OrderResponse[] = billData?.orders || [];
        const items = orders.flatMap(order => order.items || []);

        // 1. Lọc Order ID có món PENDING
        const pendingIds = orders
            .filter(order => order.items?.some(i => i.itemStatus === 'PENDING'))
            .map(order => order.id);

        // 2. Tính tổng tiền thực tế từ tất cả các Order
        // Ưu tiên lấy totalAmount từ Backend, nếu không có thì tính từ subtotal của items
        const total = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return {
            allItems: items,
            pendingOrders: pendingIds,
            calculatedTotal: total
        };
    }, [billData]);

    return (
        <div className="fixed inset-0 z-[110] bg-dark-gray/60 backdrop-blur-sm flex items-center justify-center p-4 font-display">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header giữ nguyên */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Table {tableNumber}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Bill #{billData?.id}</p>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-gray-400 font-bold">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Nút Add New Items giữ nguyên */}
                    <button
                        onClick={onUpdateOrder}
                        className="w-full flex items-center justify-between p-5 bg-[#F8F9FA] border border-gray-100 rounded-3xl hover:border-burgundy transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl font-bold text-dark-gray">restaurant_menu</span>
                            <div className="text-left">
                                <p className="font-black uppercase text-sm italic">Add New Items</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Open menu to order more food</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-2 transition-transform">arrow_forward</span>
                    </button>
                {/* Danh sách món */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Order History</h3>
                    <div className="grid gap-3">
                        {(() => {
                            // Gom filter vào một biến tạm để dùng chung
                            const activeItems = allItems.filter((item) => item.itemStatus !== 'SERVED');

                            if (activeItems.length > 0) {
                                return activeItems.map((item) => {
                                    const isCancelled = item.itemStatus === ItemStatus.CANCELLED;
                                    const isPending = item.itemStatus === ItemStatus.PENDING;
                                    const isReady = item.itemStatus === 'READY';

                                    return (
                                        <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isCancelled ? 'opacity-40 bg-gray-50' : 'bg-white shadow-sm'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-xs text-dark-gray italic">
                                                    {item.quantity}x
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm ${isCancelled ? 'line-through' : 'text-dark-gray'}`}>
                                                        {item.itemName}
                                                    </p>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                                        isCancelled ? 'bg-red-100 text-red-500' :
                                                        isPending ? 'bg-orange-100 text-orange-500 animate-pulse' : 
                                                        isReady ? 'bg-emerald-100 text-emerald-600' : 'bg-olive/10 text-olive'
                                                    }`}>
                                                        {item.itemStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isReady && (
                                                    <button
                                                        onClick={() => onServeItem(item.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.95] group"
                                                    >
                                                        <span className="material-symbols-outlined text-lg font-bold group-hover:rotate-12 transition-transform">check_circle</span>
                                                        <span className="text-[10px] font-black uppercase tracking-wider italic">Serve</span>
                                                    </button>
                                                )}

                                                {isPending && (
                                                    <button
                                                        onClick={() => onCancelItem(item.id)}
                                                        className="size-10 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-50"
                                                    >
                                                        <span className="material-symbols-outlined text-xl font-bold">close</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            }

                            return (
                                /* Hiển thị khi không còn món nào cần xử lý */
                                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
                                    <span className="material-symbols-outlined text-gray-200 text-4xl mb-2">done_all</span>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">All items have been served</p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
                </div>

                {/* Footer mới: Tích hợp Send To Kitchen */}
                <div className="p-8 bg-[#F8F9FA] border-t border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Bill</p>
                        <p className="text-3xl font-black text-burgundy italic">
                            {calculatedTotal.toLocaleString()} VND
                        </p>
                    </div>

                    {/* Nút gửi xuống bếp cho từng Order ID chưa confirm */}
                    {pendingOrders.length > 0 && (
                        <div className="flex flex-col gap-2 pt-2">
                            {pendingOrders.map(orderId => (
                                <button
                                    key={orderId}
                                    onClick={() => onMassUpdate(orderId)}
                                    className="w-full py-4 bg-dark-gray text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-dark-gray/20 hover:bg-burgundy transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-xl">send_and_archive</span>
                                    Send Order #{orderId} To Kitchen
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};