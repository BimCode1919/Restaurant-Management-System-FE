import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Hooks & Services
import { useReservation } from '../hooks/useReservation';
import { customerApi } from '../services/customerApi';
import { reservationApi } from '../services/reservationApi';

// Components
import TimeSelectionView from '../components/TimeSelectionView';
import TableView from '../components/TableView';
import MenuListView from '../components/MenuListView';
import AIView from '../components/AIView';
import ReservationFormModal from '../components/ReservationFormModal';
import OrderReviewModal from '../components/OrderReviewModal';

// Types
import { MenuItem, ReservationResponse } from '../types';

const ReservationFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialIsLargeGroup = location.state?.isLargeGroup || false;

  // Custom Hook for centralized logic
  const {
    step, setStep, nextStep, prevStep,
    isLargeGroup,
    bookingDate, setBookingDate,
    bookingTime, setBookingTime,
    partySize, setPartySize,
    selectedTables, toggleTable,
    cart, setCart,
    depositAmount,
    preOrderTotal,
    prepareRequest
  } = useReservation(initialIsLargeGroup);

  // --- Local States ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationResult, setReservationResult] = useState<ReservationResponse | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    customerApi.getAvailableMenu().then(res => setMenuItems(res.data));
  }, []);

  useEffect(() => {
    if (!bookingTime) return;

    const now = new Date();
    const todayString = format(now, 'yyyy-MM-dd');

    if (bookingDate !== todayString) {
      return;
    }

    const [hour, minute] = bookingTime.split(':').map(Number);
    const slotMinutes = hour * 60 + minute;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (slotMinutes <= currentMinutes) {
      setBookingTime('');
    }
  }, [bookingDate, bookingTime, setBookingTime]);

  // --- Handlers ---

  const handleExecuteBooking = async (formData: any) => {
    try {
      setIsProcessing(true);
      // Combine form data (name, phone) with Hook data (tables, items, time)
      const requestBody = prepareRequest(formData);
      const response = await reservationApi.createReservation(requestBody);

      const data = (response as any).data || response;
      setReservationResult(data);

      if (data.depositRequired) {
        setShowReview(true);
      } else {
        setStep('DONE' as any);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Reservation failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsFormOpen(false);
      setIsReviewOpen(false);
    }
  };

  const handleFinalPayment = async () => {
    if (!reservationResult?.id) return;
    setIsProcessing(true);
    try {
      const paymentResponse = await reservationApi.payDepositMomo(reservationResult.id);
      if (paymentResponse?.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      }
    } catch (error) {
      toast.error("Error initializing payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- UI Logic ---

  // 1. Deposit Review Screen
  if (showReview && reservationResult) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col animate-in fade-in">
        <header className="mb-8">
          <h2 className="text-3xl font-black italic uppercase text-dark-gray">Confirm Deposit</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #{reservationResult.id}</p>
        </header>
        <div className="flex-1 space-y-6">
          <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm font-bold">
              <div><p className="text-[9px] text-gray-400 uppercase">Customer</p>{reservationResult.customerName}</div>
              <div><p className="text-[9px] text-gray-400 uppercase">Tables</p>{reservationResult.tableNumbers?.join(', ')}</div>
              <div className="col-span-2"><p className="text-[9px] text-gray-400 uppercase">Time</p>{new Date(reservationResult.reservationTime).toLocaleString('en-US')}</div>
            </div>
          </div>
          <div className="bg-burgundy/5 rounded-2xl p-5 flex justify-between items-center border border-burgundy/10">
            <p className="text-sm font-black text-burgundy uppercase">Deposit (10%)</p>
            <p className="text-2xl font-black text-burgundy">{new Intl.NumberFormat('vi-VN').format(reservationResult.depositAmount || 0)}đ</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/')} className="py-5 rounded-2xl font-black uppercase text-[10px] text-gray-400 border border-gray-100">Cancel</button>
          <button onClick={handleFinalPayment} disabled={isProcessing} className="py-5 bg-dark-gray text-white rounded-2xl font-black uppercase text-[10px] shadow-xl">
            {isProcessing ? 'Processing...' : 'Pay with MOMO'}
          </button>
        </div>
      </div>
    );
  }

  // 2. Success Screen
  if (step === ('DONE' as any)) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <div className="size-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl">
            <span className="material-symbols-outlined text-5xl">check</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase text-dark-gray mb-4">Completed!</h2>
          <button onClick={() => navigate('/')} className="w-full py-5 bg-dark-gray text-white rounded-2xl font-black uppercase text-xs">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      <header className="p-6 bg-white border-b flex items-center gap-4 sticky top-0 z-40">
        <button onClick={prevStep} className="size-10 flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-black uppercase italic text-dark-gray">
          {isLargeGroup ? 'Party Booking' : 'Online Reservation'}
        </h1>
      </header>

      {/* Stepper Indicator */}
      <div className="flex px-6 py-4 gap-2 overflow-x-auto no-scrollbar bg-white border-b sticky top-[73px] z-30">
        {['Time', 'Tables', 'Menu'].map((label, idx) => {
          const steps: any[] = ['SELECT_TIME', 'SELECT_TABLE', 'SELECT_MENU'];
          const isActive = steps[idx] === step;
          return (
            <div key={label} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${isActive ? 'bg-burgundy text-white' : 'bg-gray-100 text-gray-400'}`}>
              {idx + 1}. {label}
            </div>
          );
        })}
      </div>

      <main className="p-6 max-w-2xl mx-auto">
        {step === 'SELECT_TIME' && (
          <TimeSelectionView
            date={bookingDate}
            time={bookingTime}
            partySize={partySize}
            onDateChange={setBookingDate}
            onTimeChange={setBookingTime}
            onSizeChange={setPartySize}
            onNext={nextStep}
          />
        )}

        {step === 'SELECT_TABLE' && (
          <div className="space-y-6">
            <TableView
              onSelect={toggleTable}
              selectedIds={selectedTables.map(t => t.id)}
              minCapacity={partySize}
              selectedTime={bookingTime}
              selectedEndTime={(() => {
                if (!bookingDate || !bookingTime) return undefined;
                // Tính endTime giống như prepareRequest (cộng 2 tiếng)
                const [h, m] = bookingTime.split(":");
                const start = new Date(`${bookingDate}T${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`);
                const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
                return end.toTimeString().slice(0, 8); // "HH:mm:ss"
              })()}
            />
            <button
              disabled={selectedTables.length === 0}
              onClick={nextStep}
              className="w-full py-5 bg-dark-gray text-white rounded-2xl font-black uppercase text-xs disabled:opacity-30"
            >
              Confirm {selectedTables.length} Table(s)
            </button>
          </div>
        )}

        {step === 'SELECT_MENU' && (
          <>
            {isLargeGroup && (
              <div className="flex gap-2 mb-6">
                <button className="flex-1 py-3 bg-dark-gray text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic">Menu</button>
                <button className="flex-1 py-3 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest italic">AI Suggestions</button>
              </div>
            )}
            <MenuListView
              items={menuItems}
              onAdd={(item) => setCart(prev => [...prev, { ...item, quantity: 1 } as any])}
              onView={() => { }}
            />
          </>
        )}
      </main>

      {/* Floating Action Button for Menu Step */}
      {step === 'SELECT_MENU' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-50">
          <button
            onClick={() => setIsReviewOpen(true)}
            className="w-full bg-burgundy text-white p-5 rounded-[2rem] shadow-2xl flex justify-between items-center"
          >
            <span className="font-black text-[10px] bg-white/20 px-3 py-1 rounded-full">{cart.length} Items</span>
            <span className="font-black italic uppercase text-sm">Review & Book</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      {/* Cart Review Modal */}
      <OrderReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        cart={cart}
        updateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))}
        total={preOrderTotal}
        onSubmit={async () => setIsFormOpen(true)} // Transition to customer info form
      />

      {/* Final Customer Info Modal */}
      <ReservationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleExecuteBooking}

        // Old props
        partySize={partySize}
        tableCount={selectedTables.length}
        preOrderTotal={preOrderTotal}
        isLargeGroup={isLargeGroup}

        // New props for TS compatibility
        selectedDate={bookingDate}     // From useReservation hook
        selectedTime={bookingTime}     // From useReservation hook
        depositAmount={depositAmount}  // From useReservation hook
      />
    </div>
  );
};

export default ReservationFlow;