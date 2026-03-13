import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TableView from '../components/TableView';
import ReservationFormModal from '../components/ReservationFormModal';
import MenuListView from '../components/MenuListView';
import OrderReviewModal from '../components/OrderReviewModal';
import { Table, MenuItem, OrderItem, ReservationRequest, PaymentResponse } from '../types';
import { customerApi } from '../services/customerApi';
import { reservationApi } from '../services/reservationApi';
import { PaymentMethod } from '../../cashier/types';
import { toast } from 'react-hot-toast';
import AIView from '../components/AIView';

const ReservationFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLargeGroup = location.state?.isLargeGroup || false;

  // --- States ---
  const [step, setStep] = useState<'SELECT_TABLE' | 'SELECT_MENU' | 'SELECT_AI' | 'DONE'>('SELECT_TABLE');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // States cho luồng Xác nhận & Thanh toán mới
  const [showReview, setShowReview] = useState(false);
  const [tempReservation, setTempReservation] = useState<any>(null);

  const [customerInfo, setCustomerInfo] = useState<Omit<ReservationRequest, 'tableId'>>({
    customerName: '',
    customerPhone: '',
    reservationTime: '',
    notes: '',
    partySize: isLargeGroup ? 6 : 2
  });

  useEffect(() => {
    if (isLargeGroup) {
      customerApi.getAvailableMenu().then(res => setMenuItems(res.data));
    }
  }, [isLargeGroup]);

  // --- Handlers ---

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (customerData: Omit<ReservationRequest, 'tableId'>) => {
    setCustomerInfo(customerData);

    if (!isLargeGroup) {
      try {
        const finalData = {
          ...customerData,
          requestedTableIds: selectedTable?.id ? [selectedTable.id] : []
        };
        await reservationApi.createReservation(finalData as any);
        setStep('DONE');
      } catch (error) {
        toast.error("Error creating reservation. Please try again.");
      }
    } else {
      setIsFormOpen(false);
      setStep('SELECT_MENU');
    }
  };

  const handleAddToCart = (item: MenuItem | OrderItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 } as OrderItem];
    });
  };

  // Bước A: Tạo đơn đặt bàn tạm thời để lấy Deposit Amount
  const handlePlaceOrderWithDeposit = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const reservationData = {
        ...customerInfo,
        requestedTableIds: selectedTable?.id ? [selectedTable.id] : [],
        preOrderItems: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity
        }))
      };

      const res = await reservationApi.createReservationWithDeposit(reservationData as any);
      const responseData = (res as any).data || res;

      setTempReservation(responseData);
      setShowReview(true); // Chuyển sang màn hình Review
      setIsReviewOpen(false);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create reservation.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bước B: Thanh toán thực sự (Gọi API mới /deposit)
  const handleFinalPayment = async () => {
    if (!tempReservation?.id) return;
    setIsProcessing(true);

    try {
      const paymentResponse = await reservationApi.payReservationDeposit(
        tempReservation.id,
        PaymentMethod.MOMO
      );

      console.log("Actual Response in Component:", paymentResponse);

      if (paymentResponse && paymentResponse.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        toast.error("Payment URL not found in server response.");
      }
    } catch (error: any) {
      console.error("Payment Flow Error:", error);
      toast.error("Failed to initialize payment. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Hàm Hủy (Sử dụng @PutMapping và truyền reason qua param)
  const handleCancelReservation = async () => {
    if (!tempReservation?.id) return;
    setIsProcessing(true);

    try {
      await reservationApi.cancelReservation(tempReservation.id, "User changed mind at review step");
      toast.success("Reservation cancelled.");
      setShowReview(false);
      setTempReservation(null);
    } catch (error: any) {
      toast.error("Cannot cancel reservation now.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- UI Renders ---

  // Màn hình Review Thông tin & Món ăn
  if (showReview && tempReservation) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col animate-in slide-in-from-right duration-500">
        <header className="mb-8">
          <button onClick={() => setShowReview(false)} className="text-gray-400 mb-4">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-3xl font-black italic uppercase text-dark-gray">Review Order</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Confirm details & deposit</p>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Info Card */}
          <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase">Customer</p>
                <p className="font-bold text-sm text-dark-gray">{tempReservation.customerName}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase">Phone</p>
                <p className="font-bold text-sm text-dark-gray">{tempReservation.customerPhone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] font-black text-gray-400 uppercase">Arrival Time</p>
                <p className="font-bold text-sm text-dark-gray">
                  {new Date(tempReservation.reservationTime).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="px-2">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Your Selection ({cart.length})</p>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-600">x{item.quantity} {item.name}</span>
                  <span className="font-bold text-dark-gray">
                    {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deposit Summary */}
          <div className="mt-auto pt-6 border-t border-dashed">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-400">Total Bill</span>
              <span className="font-bold text-gray-400">
                {new Intl.NumberFormat('vi-VN').format(cart.reduce((s, i) => s + i.price * i.quantity, 0))}đ
              </span>
            </div>
            <div className="bg-burgundy/5 rounded-2xl p-5 flex justify-between items-center border border-burgundy/10">
              <div>
                <p className="text-[10px] font-black text-burgundy uppercase">Required Deposit</p>
                <p className="text-[9px] text-burgundy/60 uppercase font-bold tracking-tighter">Secure your reservation</p>
              </div>
              <p className="text-2xl font-black text-burgundy">
                {new Intl.NumberFormat('vi-VN').format(tempReservation.depositAmount || 0)}đ
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            disabled={isProcessing}
            onClick={handleCancelReservation}
            className="py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 border border-gray-100 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={isProcessing}
            onClick={handleFinalPayment}
            className="py-5 bg-dark-gray text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {isProcessing ? 'Wait...' : 'Pay Deposit'}
            <span className="material-symbols-outlined text-sm">payments</span>
          </button>
        </div>
      </div>
    );
  }

  // Màn hình Thành công
  if (step === 'DONE') {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
          <div className="size-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl shadow-green-100">
            <span className="material-symbols-outlined text-5xl">check</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase text-dark-gray mb-4 tracking-tighter">Success!</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Your table reservation request for <span className="text-dark-gray font-bold">{customerInfo.customerName}</span> has been received.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-5 bg-dark-gray text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      <header className="p-6 bg-white border-b flex items-center gap-4 sticky top-0 z-30">
        <button
          onClick={() => (step === 'SELECT_MENU' || step === 'SELECT_AI') ? setStep('SELECT_TABLE') : navigate(-1)}
          className="text-gray-400"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-black uppercase italic text-dark-gray tracking-tight">
          {isLargeGroup ? 'Party Reservation' : 'Table Reservation'}
        </h1>
      </header>

      {/* Tabs navigation cho Large Group */}
      {isLargeGroup && (step === 'SELECT_MENU' || step === 'SELECT_AI') && (
        <div className="flex bg-white border-b sticky top-[73px] z-20 p-1">
          <button 
            onClick={() => setStep('SELECT_MENU')} 
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${step === 'SELECT_MENU' ? 'bg-dark-gray text-white rounded-xl shadow-md' : 'text-gray-400'}`}
          >
            Menu List
          </button>
          <button 
            onClick={() => setStep('SELECT_AI')} 
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${step === 'SELECT_AI' ? 'bg-burgundy text-white rounded-xl shadow-md' : 'text-gray-400'}`}
          >
            AI Suggestion
          </button>
        </div>
      )}

      <main className="p-6 max-w-2xl mx-auto">
        {step === 'SELECT_TABLE' && <TableView onSelect={handleTableSelect} minCapacity={isLargeGroup ? 6 : 2} />}
        
        {step === 'SELECT_MENU' && (
          <MenuListView
            items={menuItems}
            onAdd={handleAddToCart}
            onView={() => { }}
          />
        )}

        {step === 'SELECT_AI' && (
          <AIView 
            menu={menuItems} 
            cart={cart}
            onAdd={handleAddToCart}
          />
        )}
      </main>

      <ReservationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        partySize={customerInfo.partySize}
        onSubmit={handleFormSubmit}
        depositAmount={0}
        tableCount={selectedTable ? 1 : 0}
        preOrderTotal={cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
        isLargeGroup={isLargeGroup}
      />

      {isLargeGroup && (step === 'SELECT_MENU' || step === 'SELECT_AI') && cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-40">
          <button
            onClick={() => setIsReviewOpen(true)}
            className="w-full bg-burgundy text-white p-5 rounded-[2rem] shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="font-black uppercase text-[10px] tracking-widest bg-white/20 px-3 py-1 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>
            <span className="font-black italic uppercase text-sm">Review Order</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      <OrderReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        cart={cart}
        updateQty={(id, delta) => {
          setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0));
        }}
        total={cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
        onSubmit={handlePlaceOrderWithDeposit}
      />
    </div>
  );
};

export default ReservationFlow;