import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  partySize: number;
  selectedDate: string;   // Nhận từ luồng chính
  selectedTime: string;   // Nhận từ luồng chính
  depositAmount: number;  // Tính toán từ Hook
  tableCount: number;
  preOrderTotal: number;
  isLargeGroup: boolean;
}

const ReservationFormModal: React.FC<Props> = ({
  isOpen, onClose, onSubmit, partySize, selectedDate, selectedTime,
  depositAmount, tableCount, preOrderTotal, isLargeGroup
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    note: '', // BE dùng 'note' thay vì 'notes'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kết hợp ngày giờ đã chọn từ bước 1 để gửi lên
    onSubmit({
      ...formData,
      reservationTime: `${selectedDate}T${selectedTime}`,
      partySize,
    });
  };

  const formattedDeposit = new Intl.NumberFormat('vi-VN').format(depositAmount);

  return (
    <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-hide">

        <header className="text-center mb-6">
          <h2 className="text-2xl font-black uppercase italic text-dark-gray">Confirm Details</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Final step to secure your table</p>
        </header>

        {/* Bảng tóm tắt đặt chỗ - Hiển thị cho cả 2 luồng để khách check lại */}
        <div className="bg-gray-50 rounded-3xl p-5 mb-6 border border-gray-100 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200">
            <div>
              <p className="text-[9px] font-black uppercase text-gray-400">Schedule</p>
              <p className="text-xs font-bold text-dark-gray">{selectedDate} @ {selectedTime}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-gray-400">Guests</p>
              <p className="text-xs font-bold text-dark-gray">{partySize} People ({tableCount} Tables)</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400 uppercase">Pre-order Food</span>
              <span className="text-dark-gray">{new Intl.NumberFormat('vi-VN').format(preOrderTotal)}đ</span>
            </div>
            {depositAmount > 0 && (
              <div className="flex justify-between text-[10px] font-black text-burgundy">
                <span className="uppercase">Required Deposit (10%)</span>
                <span>{formattedDeposit}đ</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Full Name</label>
              <input
                required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
                placeholder="Ex: John Doe"
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Phone Number</label>
              <input
                required
                type="tel"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
                placeholder="090xxxxxxx"
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Email Address</label>
              <input
                required
                type="email"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
                placeholder="your@email.com"
                onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Special Note</label>
              <textarea
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20 h-20 resize-none"
                placeholder="Allergies, high chair, anniversary..."
                onChange={e => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-dark-gray text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Confirm & Book
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-gray-400 font-black text-[10px] uppercase tracking-widest py-2 hover:text-dark-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationFormModal;