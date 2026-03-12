import React, { useState } from 'react';
import { ReservationRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ReservationRequest, 'tableId'>) => void;
  partySize: number;
  depositAmount?: number; // Thêm prop depositAmount nếu cần hiển thị trong form

}

const ReservationFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, partySize, depositAmount, }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    reservationTime: '',
    notes: '',
    depositAmount: depositAmount || 0 // Khởi tạo depositAmount trong formData nếu có prop truyền vào
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      partySize,
      reservationTime: new Date(formData.reservationTime).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
        <h2 className="text-2xl font-black uppercase italic text-dark-gray mb-2 text-center">Reservation Information</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-8">Please provide your contact information</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Customer Name</label>
            <input 
              required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              placeholder="e.g., John Doe"
              onChange={e => setFormData({...formData, customerName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Email</label>
            <input 
              required
              type="email"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              placeholder="email@gmail.com"
              onChange={e => setFormData({...formData, customerEmail: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Phone Number</label>
            <input 
              required
              type="tel"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              placeholder="090xxxxxxx"
              onChange={e => setFormData({...formData, customerPhone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Arrival Time</label>
            <input 
              required
              type="datetime-local"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20"
              onChange={e => setFormData({...formData, reservationTime: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-4 mb-1">Notes (if any)</label>
            <textarea 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-burgundy/20 h-20"
              placeholder="Special requests about seating, allergies..."
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button type="submit" className="w-full bg-burgundy text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-burgundy/20 active:scale-95 transition-all">
              Confirm Information
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