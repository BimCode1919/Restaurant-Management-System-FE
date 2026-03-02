import React from 'react';
import { ItemResponse, TableResponse, TableStatus } from '../types';

interface NewOrderModalProps {
  // Thêm PARTY_SIZE vào union type
  step: 'TABLE' | 'PARTY_SIZE' | 'MENU';
  tables: TableResponse[];
  menu: ItemResponse[];
  cart: any[];
  selectedTable: TableResponse | null;
  partySize: number; // Thêm prop này
  onClose: () => void;
  onSelectTable: (table: TableResponse) => void;
  setPartySize: (size: number) => void; // Thêm hàm set
  setOrderStep: (step: 'TABLE' | 'PARTY_SIZE' | 'MENU') => void;
  onAddToCart: (item: ItemResponse) => void;
  onUpdateCartQty: (id: number, delta: number) => void;
  onRemoveFromCart: (id: number) => void;
  onUpdateNote: (id: number, note: string) => void;
  onFinalize: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = (props) => {
  const {
    step, tables, menu, cart, selectedTable, partySize,
    onClose, onSelectTable, setPartySize, setOrderStep,
    onAddToCart, onUpdateCartQty, onRemoveFromCart, onUpdateNote, onFinalize
  } = props;

  // Header Title Logic
  const getHeaderTitle = () => {
    if (step === 'TABLE') return 'Select Table';
    if (step === 'PARTY_SIZE') return `Table ${selectedTable?.tableNumber}: Guest Count`;
    return `Ordering for Table ${selectedTable?.tableNumber}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-500 flex flex-col">
      <header className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">{getHeaderTitle()}</h2>
          <p className="text-gray-400 font-bold text-sm">
            Step {step === 'TABLE' ? '1' : step === 'PARTY_SIZE' ? '2' : '3'} of 3
          </p>
        </div>
        <button onClick={onClose} className="material-symbols-outlined text-gray-400 hover:text-dark-gray text-3xl">close</button>
      </header>

      <div className="flex-1 overflow-y-auto p-10">
        {/* STEP 1: SELECT TABLE */}
        {step === 'TABLE' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {tables.map((t) => {
              const isOccupied = String(t.status).toUpperCase() === 'OCCUPIED';

              return (
                <button
                  key={t.id}
                  // Chặn click nếu bàn đã có khách
                  onClick={() => !isOccupied && onSelectTable(t)}
                  // Thêm style disabled và cursor-not-allowed
                  className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition-all ${isOccupied
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-white border-gray-100 text-dark-gray hover:border-cheese hover:scale-105 shadow-sm'
                    }`}
                >
                  <span className={`text-4xl font-black ${isOccupied ? 'text-gray-300' : 'text-dark-gray'}`}>
                    {t.tableNumber}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isOccupied ? 'text-red-400' : 'text-olive'}`}>
                    {isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
                  </span>
                  {isOccupied && (
                    <span className="material-symbols-outlined text-sm">lock</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2: PARTY SIZE */}
        {step === 'PARTY_SIZE' && (
          <div className="flex flex-col items-center justify-center h-full py-10 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-black text-gray-400 uppercase mb-8">How many guests?</h3>
            <div className="flex items-center gap-8 bg-gray-50 p-8 rounded-[40px] border border-gray-100 shadow-inner">
              <button
                onClick={() => setPartySize(Math.max(1, partySize - 1))}
                className="size-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl font-black hover:bg-burgundy hover:text-white transition-all active:scale-90"
              >-</button>
              <span className="text-8xl font-black text-dark-gray w-32 text-center select-none">{partySize}</span>
              <button
                onClick={() => setPartySize(partySize + 1)}
                className="size-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl font-black hover:bg-burgundy hover:text-white transition-all active:scale-90"
              >+</button>
            </div>
            <div className="mt-12 flex gap-4">
              <button onClick={() => setOrderStep('TABLE')} className="px-8 py-4 font-black uppercase text-gray-400">Back</button>
              <button
                onClick={() => setOrderStep('MENU')}
                className="px-12 py-4 bg-dark-gray text-white font-black rounded-2xl shadow-xl hover:bg-burgundy transition-colors uppercase tracking-widest"
              >Next: Select Items</button>
            </div>
          </div>
        )}

        {/* STEP 3: MENU & CART */}
        {step === 'MENU' && (
          <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto h-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* ... Phần Menu Giữ nguyên từ code cũ của bạn, chỉ cần sửa kiểu dữ liệu id thành number ... */}
            <div className="flex-1 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-400">Menu Available</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onAddToCart(item)}
                    className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 text-left hover:border-burgundy transition-all hover:shadow-lg group"
                  >
                    <div className="size-16 rounded-xl bg-cover shrink-0 bg-gray-100" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                    <div className="flex-1">
                      <p className="font-bold text-dark-gray">{item.name}</p>
                      <p className="text-burgundy font-black text-sm">${item.price}</p>
                    </div>
                    <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* TICKET / CART SECTION */}
            <div className="w-full lg:w-[450px] flex flex-col bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl sticky top-0 h-fit max-h-[80vh]">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-tighter text-dark-gray">Order Summary</h3>
                  <span className="bg-dark-gray text-white text-[10px] px-3 py-1 rounded-full font-black">
                    {cart.length} ITEMS
                  </span>
                </div>
              </div>

              {/* DANH SÁCH MÓN ĐÃ CHỌN */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                    <span className="material-symbols-outlined text-6xl mb-2">shopping_basket</span>
                    <p className="font-bold uppercase text-xs tracking-widest">Cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-black text-dark-gray text-sm leading-tight">{item.name}</p>
                          <p className="text-burgundy font-bold text-xs">${item.price}</p>
                        </div>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Bộ tăng giảm số lượng */}
                        <div className="flex items-center gap-3 bg-white rounded-xl p-1 border border-gray-100">
                          <button
                            onClick={() => onUpdateCartQty(item.id, -1)}
                            className="size-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold"
                          >-</button>
                          <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQty(item.id, 1)}
                            className="size-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold"
                          >+</button>
                        </div>

                        {/* Tổng tiền món đó */}
                        <p className="font-black text-dark-gray text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Ô nhập ghi chú (Note) */}
                      <input
                        type="text"
                        placeholder="Add note..."
                        value={item.note || ''}
                        onChange={(e) => onUpdateNote(item.id, e.target.value)}
                        className="mt-1 w-full bg-transparent border-none p-0 text-[11px] font-bold text-gray-400 focus:ring-0 placeholder:text-gray-300"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* PHẦN TỔNG TIỀN & NÚT GỬI */}
              <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtotal</p>
                    <p className="text-[10px] text-gray-400 font-bold">Tax included</p>
                  </div>
                  <p className="text-4xl font-black text-burgundy tracking-tighter">
                    ${cart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={onFinalize}
                  disabled={cart.length === 0}
                  className="w-full py-5 bg-dark-gray text-white font-black uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-30 disabled:grayscale transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">restaurant</span>
                  Send to Kitchen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};