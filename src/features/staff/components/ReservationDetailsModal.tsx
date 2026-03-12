import React from 'react';
import { ReservationResponse } from '../types';
import { X, User, Phone, Calendar, Wallet, FileText } from 'lucide-react';

interface Props {
    data: ReservationResponse | null; // Cho phép null để an toàn hơn
    onClose: () => void;
    onAction: (type: 'CONFIRM' | 'CHECK_IN' | 'CANCEL' | 'NO_SHOW', id: number, extra?: any) => void;
}

export const ReservationDetailsModal: React.FC<Props> = ({ data, onClose, onAction }) => {
    // 1. Cầu chì bảo vệ: Nếu không có data, không render gì cả để tránh lỗi 'id of null'
    if (!data) return null;

    // 2. Helper format tiền: Kiểm tra null/undefined trước khi toLocaleString
    const formatPrice = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '0₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // 3. Helper format thời gian
    const formatTime = (timeStr: string | undefined) => {
        if (!timeStr) return '--:--';
        return new Date(timeStr).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-burgundy italic">Reservation</h2>
                        <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-widest">Ref: #{data.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="px-8 pb-8 space-y-4">

                    {/* Thông tin khách hàng */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-2">
                                <User size={12} /> Guest Name
                            </p>
                            <p className="font-bold text-dark-gray truncate">{data.customerName || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-2">
                                <Phone size={12} /> Phone Number
                            </p>
                            <p className="font-bold text-dark-gray">{data.customerPhone || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Thời gian & Số lượng khách */}
                    <div className="bg-orange-50/50 p-5 rounded-[1.8rem] border border-orange-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-orange-400 uppercase italic">Schedule & Party</p>
                                <p className="font-black text-dark-gray text-lg">
                                    {formatTime(data.reservationTime)} • {data.partySize} Guests
                                </p>
                            </div>
                        </div>

                        {/* Bàn được chỉ định - Luôn hiển thị nếu có mảng tableNumbers */}
                        {data.tableNumbers && data.tableNumbers.length > 0 && (
                            <div className="text-right">
                                <p className="text-[10px] font-black text-orange-400 uppercase italic">Tables</p>
                                <div className="flex gap-1 justify-end mt-1">
                                    {data.tableNumbers.map(num => (
                                        <span key={num} className="px-2 py-0.5 bg-white rounded-md text-xs font-black text-orange-600 border border-orange-200">
                                            {num}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Deposit: Chỉ hiện nếu yêu cầu đặt cọc HOẶC đã có số tiền đặt cọc > 0 */}
                    {(data.depositRequired || (data.depositAmount && data.depositAmount > 0)) && (
                        <div className="bg-gray-50 p-5 rounded-[1.8rem] border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="size-10 bg-white rounded-full flex items-center justify-center shadow-sm text-olive">
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase italic">Deposit</p>
                                    <p className="font-black text-dark-gray text-lg">{formatPrice(data.depositAmount)}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${data.depositPaid ? 'bg-olive/10 text-olive' : 'bg-burgundy/10 text-burgundy'
                                }`}>
                                {data.depositPaid ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>
                    )}

                    {/* Note: Chỉ hiển thị nếu có nội dung thực tế (tránh chữ 'string' mặc định của Swagger) */}
                    {data.note && data.note !== 'string' && (
                        <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                            <p className="text-[10px] font-black text-blue-400 uppercase mb-1 flex items-center gap-2 italic">
                                <FileText size={12} /> Note from Guest
                            </p>
                            <p className="text-sm font-medium text-gray-600 italic leading-relaxed">
                                "{data.note}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="p-8 pt-0 grid grid-cols-3 gap-3">
                    {/* Nút Cancel */}
                    <button
                        disabled={!data.canCancel}
                        onClick={() => onAction('CANCEL', data.id, { reason: 'Staff cancelled' })}
                        className="py-4 rounded-2xl bg-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    {/* Nút No-Show */}
                    <button
                        disabled={!data.canMarkNoShow}
                        onClick={() => onAction('NO_SHOW', data.id, { reason: 'Guest no-show' })}
                        className="py-4 rounded-2xl bg-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                        No-Show
                    </button>

                    {/* LOGIC NÚT BẤM CHÍNH */}
                    {data.canCheckIn ? (
                        // Nếu API báo có thể Check-in, hiện nút Check-in (Màu xanh dương)
                        <button
                            onClick={() => onAction('CHECK_IN', data.id, { billId: data.billId })}
                            className="py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all animate-in fade-in zoom-in"
                        >
                            Check-in
                        </button>
                    ) : (
                        // Nếu không thể Check-in, kiểm tra xem đã Confirm chưa
                        <button
                            disabled={data.status === 'CONFIRMED' || data.status === 'SEATED'}
                            onClick={() => onAction('CONFIRM', data.id)}
                            className="py-4 rounded-2xl bg-olive text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-olive/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                        >
                            {data.status === 'CONFIRMED' ? 'Confirmed' : 'Confirm'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};