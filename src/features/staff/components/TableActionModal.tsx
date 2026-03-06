import React from 'react';

interface TableActionModalProps {
    tableNumber: string;
    billData: any;
    onClose: () => void;
    onUpdateOrder: () => void;
    onCancelItem: (orderDetailId: number) => void;
}

export const TableActionModal: React.FC<TableActionModalProps> = ({
    tableNumber, billData, onClose, onUpdateOrder, onCancelItem
}) => {
    // Gom tất cả items từ danh sách orders
    const allItems = React.useMemo(() => {
        return billData?.orders?.flatMap((order: any) => order.items || []) || [];
    }, [billData]);

    return (
        <div className="fixed inset-0 z-[110] bg-dark-gray/60 backdrop-blur-sm flex items-center justify-center p-4 font-display">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Table {tableNumber}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Bill #{billData?.id}</p>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-gray-400 font-bold">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Thêm món mới */}
                    <button
                        onClick={onUpdateOrder}
                        className="w-full flex items-center justify-between p-5 bg-olive/5 border-2 border-olive/10 rounded-3xl hover:bg-olive hover:text-white transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl font-bold">restaurant_menu</span>
                            <div className="text-left">
                                <p className="font-black uppercase text-sm italic">Add New Items</p>
                                <p className="text-[10px] opacity-70 font-bold">Open menu to order more food</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                    </button>

                    {/* Danh sách món */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order History</h3>
                        {allItems.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold text-sm">No items found.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {allItems.map((item: any) => {
                                    const isCancelled = item.itemStatus === 'CANCELLED';
                                    const isServed = item.itemStatus === 'SERVED';

                                    return (
                                        <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isCancelled ? 'opacity-50 bg-gray-50' : 'bg-white shadow-sm'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-xs text-dark-gray italic">{item.quantity}x</div>
                                                <div>
                                                    <p className={`font-bold text-sm ${isCancelled ? 'line-through' : ''}`}>{item.itemName}</p>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${isCancelled ? 'bg-red-100 text-red-500' :
                                                            isServed ? 'bg-olive/10 text-olive' : 'bg-orange-100 text-orange-500'
                                                        }`}>{item.itemStatus}</span>
                                                </div>
                                            </div>
                                            {!isCancelled && !isServed && (
                                                <button
                                                    onClick={() => window.confirm(`Cancel ${item.itemName}?`) && onCancelItem(item.id)}
                                                    className="size-10 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-50"
                                                >
                                                    <span className="material-symbols-outlined text-xl font-bold">close</span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Bill</p>
                    <p className="text-3xl font-black text-burgundy italic">
                        {billData?.totalAmount?.toLocaleString() || billData?.totalPrice?.toLocaleString() || 0} VND
                    </p>
                </div>
            </div>
        </div>
    );
};