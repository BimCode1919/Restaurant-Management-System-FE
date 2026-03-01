import React, { useEffect, useState } from 'react';
import { customerApi } from '../services/customerApi';
import { BillResponse, OrderDetailResponse } from '../types';

interface OrderStatusViewProps {
    billId: number;
}

const OrderStatusView: React.FC<OrderStatusViewProps> = ({ billId }) => {
    const [billData, setBillData] = useState<BillResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderStatus = async () => {
        try {
            const res = await customerApi.getBillById(billId);
            if (res.data) {
                setBillData(res.data);
            }
        } catch (error) {
            console.error("Lỗi lấy trạng thái hóa đơn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderStatus();
        const interval = setInterval(fetchOrderStatus, 15000); // Cập nhật nhanh hơn (15s) để khách theo dõi món
        return () => clearInterval(interval);
    }, [billId]);

    if (loading && !billData) {
        return <div className="text-center py-20 animate-pulse text-gray-400 font-bold uppercase text-[10px]">Đang tải dữ liệu...</div>;
    }

    // Thu thập tất cả các chi tiết món ăn từ tất cả các đơn hàng thuộc Bill này
    const allOrderDetails: OrderDetailResponse[] = billData?.orders?.flatMap(order => order.items) || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-start bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-dark-gray uppercase italic">Đang chuẩn bị</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Bàn {billData?.tableNumbers?.join(', ') || 'Đang xác định'} • #{billId}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-burgundy uppercase">Tạm tính</p>
                    <p className="text-lg font-black text-dark-gray italic">
                        {new Intl.NumberFormat('vi-VN').format(billData?.totalPrice || 0)}đ
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {allOrderDetails.length > 0 ? (
                    allOrderDetails.map((detail) => (
                        <div key={detail.id} className="bg-white p-4 rounded-3xl border border-gray-50 flex justify-between items-center shadow-sm">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm text-dark-gray leading-none">{detail.itemName}</h4>
                                    <span className="text-[10px] font-black text-gray-300">x{detail.quantity}</span>
                                </div>
                                {detail.notes && (
                                    <p className="text-[9px] text-orange-400 italic mt-1 font-medium">*{detail.notes}</p>
                                )}
                            </div>

                            {/* Hiển thị trạng thái dựa trên itemStatus */}
                            <div className="flex items-center gap-3">
                                <div className="text-right mr-2">
                                    <p className={`text-[10px] font-black uppercase tracking-tighter ${detail.itemStatus === 'SERVED' ? 'text-green-500' :
                                            detail.itemStatus === 'READY' ? 'text-blue-500' :
                                                detail.itemStatus === 'PREPARING' ? 'text-orange-500' :
                                                    detail.itemStatus === 'CANCELLED' ? 'text-red-400' :
                                                        'text-gray-400'
                                        }`}>
                                        {detail.itemStatus === 'SERVED' ? 'Đã lên món' :
                                            detail.itemStatus === 'READY' ? 'Sẵn sàng' :
                                                detail.itemStatus === 'PREPARING' ? 'Đang nấu' :
                                                    detail.itemStatus === 'PENDING' ? 'Đang chờ' :
                                                        'Đã hủy'}
                                    </p>
                                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                                        {detail.itemStatus === 'SERVED' ? 'Enjoy your meal' :
                                            detail.itemStatus === 'READY' ? 'Coming soon' : 'Please wait'}
                                    </p>
                                </div>

                                {/* Chấm tròn trạng thái trực quan với hiệu ứng tương ứng */}
                                <div className={`size-2.5 rounded-full transition-all duration-500 ${detail.itemStatus === 'SERVED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                                        detail.itemStatus === 'READY' ? 'bg-blue-500 animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.4)]' :
                                            detail.itemStatus === 'PREPARING' ? 'bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.4)]' :
                                                detail.itemStatus === 'CANCELLED' ? 'bg-red-400' :
                                                    'bg-gray-200'
                                    }`} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center opacity-30 italic">
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">Chưa có món ăn nào</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Chi tiết thanh toán</span>
                    <span className="material-symbols-outlined text-sm text-burgundy-light">payments</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="font-bold text-white/60">Tiền món ăn:</span>
                        <span className="font-black">{new Intl.NumberFormat('vi-VN').format(billData?.totalPrice || 0)}đ</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="font-bold text-white/60">Giảm giá:</span>
                        <span className="font-black text-burgundy-light">-{new Intl.NumberFormat('vi-VN').format(billData?.discountAmount || 0)}đ</span>
                    </div>
                    <div className="h-[1px] bg-white/10 my-2" />
                    <div className="flex justify-between items-end">
                        <span className="font-black uppercase text-[10px]">Cần thanh toán:</span>
                        <span className="text-xl font-black text-white">
                            {new Intl.NumberFormat('vi-VN').format(billData?.finalPrice || 0)}đ
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatusView;