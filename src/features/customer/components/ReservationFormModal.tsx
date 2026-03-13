import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  partySize: number;
  depositAmount: number;
  tableCount: number;
  preOrderTotal: number;
  isLargeGroup: boolean; // Để biết có cần hiển thị tiền cọc ngay tại đây không
}

const ReservationFormModal: React.FC<Props> = ({
  isOpen, onClose, onSubmit, partySize, depositAmount, tableCount, preOrderTotal, isLargeGroup
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationTime: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isoDateTime = formData.reservationTime + ":00";
    onSubmit({
      ...formData,
      partySize,
      reservationTime: isoDateTime,
    });
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black uppercase italic text-dark-gray mb-2 text-center">Reservation Details</h2>
        
        {/* Chỉ hiển thị bảng tóm tắt nếu là đặt chỗ thông thường (vì bước này là kết thúc luồng đó) */}
        {!isLargeGroup && (
          <div className="bg-gray-50 rounded-3xl p-5 mb-6 border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest text-center">Reservation Summary</p>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Party Size</span>
              <span>{partySize} People</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span>Tables</span>
              <span>{tableCount} Table</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Full Name</label>
            <input required className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              placeholder="Enter your name" onChange={e => setFormData({ ...formData, customerName: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Email</label>
            <input required type="email" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              placeholder="email@example.com" onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Phone Number</label>
            <input required type="tel" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              placeholder="090xxxxxxx" onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Arrival Time</label>
            <input required type="datetime-local" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              onChange={e => setFormData({ ...formData, reservationTime: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Notes</label>
            <textarea className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20 h-20"
              placeholder="Any special requests?" onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button type="submit" className="w-full bg-burgundy text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-burgundy/20 active:scale-95 transition-all">
              {isLargeGroup ? 'Continue to Menu' : 'Confirm Reservation'}
            </button>
            <button type="button" onClick={onClose} className="text-gray-400 font-black text-[10px] uppercase tracking-widest py-2">
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationFormModal;