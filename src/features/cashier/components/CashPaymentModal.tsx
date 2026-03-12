import React, { useState } from 'react';

interface CashPaymentModalProps {
  totalAmount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CashPaymentModal: React.FC<CashPaymentModalProps> = ({ totalAmount, onClose, onConfirm }) => {
  const [receivedAmount, setReceivedAmount] = useState<string>("");

  const changeAmount = Number(receivedAmount) - totalAmount;

  const handleNumpadClick = (val: string) => {
    if (val === "000") {
      setReceivedAmount(prev => prev + "000");
    } else {
      setReceivedAmount(prev => prev + val);
    }
  };

  const clearAmount = () => setReceivedAmount("");

  return (
    <div className="fixed inset-0 z-[300] bg-dark-gray/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Cột trái: Thông tin số tiền */}
        <div className="flex-1 p-10 bg-gray-50 flex flex-col justify-between border-r border-gray-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Cash Transaction</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Total Bill</label>
                <p className="text-3xl font-black text-dark-gray italic">{totalAmount.toLocaleString()}₫</p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-burgundy block mb-1">Received</label>
                <p className="text-4xl font-black text-burgundy italic bg-white p-4 rounded-2xl border-2 border-burgundy/10 shadow-inner">
                  {Number(receivedAmount || 0).toLocaleString()}₫
                </p>
              </div>

              <div className={`transition-opacity ${Number(receivedAmount) >= totalAmount ? 'opacity-100' : 'opacity-30'}`}>
                <label className="text-[10px] font-bold uppercase text-olive block mb-1">Change to Customer</label>
                <p className="text-3xl font-black text-olive italic">
                  {changeAmount > 0 ? changeAmount.toLocaleString() : 0}₫
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-dark-gray transition-colors mt-8"
          >
            ← Cancel and back
          </button>
        </div>

        {/* Cột phải: Numpad cảm ứng */}
        <div className="flex-1 p-8 bg-white">
          <div className="grid grid-cols-3 gap-3 h-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "000"].map((num) => (
              <button
                key={num}
                onClick={() => handleNumpadClick(num.toString())}
                className="h-16 rounded-2xl bg-gray-50 hover:bg-dark-gray hover:text-white transition-all text-xl font-black italic border border-gray-100 shadow-sm active:scale-95"
              >
                {num === "000" ? ".000" : num}
              </button>
            ))}
            <button
              onClick={clearAmount}
              className="h-16 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-black uppercase border border-red-100 shadow-sm active:scale-95"
            >
              Clear
            </button>

            <button
              disabled={Number(receivedAmount) < totalAmount}
              onClick={onConfirm}
              className="col-span-3 mt-4 py-5 rounded-[2rem] bg-burgundy text-white font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-burgundy/30 disabled:opacity-20 disabled:grayscale transition-all active:scale-95 italic"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};