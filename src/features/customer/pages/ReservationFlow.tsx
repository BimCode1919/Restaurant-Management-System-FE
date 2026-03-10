import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TableView from '../components/TableView';
import ReservationFormModal from '../components/ReservationFormModal';
import MenuListView from '../components/MenuListView';
import OrderReviewModal from '../components/OrderReviewModal';
import { Table, MenuItem, OrderItem, ReservationRequest } from '../types';
import { customerApi } from '../services/customerApi';
import { reservationApi } from '../services/reservationApi';
import { cashierApi } from '../../cashier/services/cashierApi';
import { PaymentMethod } from '../../cashier/types';
import { toast } from 'react-hot-toast';

const ReservationFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLargeGroup = location.state?.isLargeGroup || false;

  // States
  const [step, setStep] = useState<'SELECT_TABLE' | 'SELECT_MENU' | 'DONE'>('SELECT_TABLE');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Tránh double-click
  
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

  // Handlers
  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (customerData: Omit<ReservationRequest, 'tableId'>) => {
    setCustomerInfo(customerData); // Quan trọng: lưu lại để dùng cho bước Deposit
    
    if (!isLargeGroup) {
      try {
        const finalData = { ...customerData, tableId: selectedTable?.id };
        await reservationApi.createReservation(finalData as ReservationRequest);
        setStep('DONE');
      } catch (error) {
        toast.error("Error creating reservation. Please try again.");
      }
    } else {
      setIsFormOpen(false);
      setStep('SELECT_MENU');
    }
  };

  const handlePlaceOrderWithDeposit = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Chuẩn bị dữ liệu lưu tạm (Khớp với ReservationWithDepositRequest)
      const reservationData = {
        ...customerInfo,
        tableId: selectedTable?.id,
        depositAmount: 200000,
        orderItems: cart.map(item => ({ 
          itemId: item.id, // Đổi từ menuItemId thành itemId cho khớp types.ts
          quantity: item.quantity,
          notes: item.notes || ''
        }))
      };
      
      localStorage.setItem('pending_reservation', JSON.stringify(reservationData));

      // 2. Gọi API tạo Payment
      const response = await cashierApi.createPayment({
        billId: 0, 
        paymentMethod: PaymentMethod.MOMO,
        returnUrl: `${window.location.origin}/payment-callback` 
      });

      // 3. Điều hướng
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        throw new Error("Can not get payment URL.");
      }
    } catch (error) {
      console.error("Deposit Error:", error);
      toast.error("Cannot initialize deposit payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  // UI cho màn hình DONE (Đã tối ưu hóa)
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
            We will contact you soon to confirm.
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
        <button onClick={() => step === 'SELECT_MENU' ? setStep('SELECT_TABLE') : navigate(-1)} className="text-gray-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-black uppercase italic text-dark-gray tracking-tight">
          {isLargeGroup ? 'Đặt Tiệc Lớn' : 'Đặt Bàn Nhỏ'}
        </h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        {step === 'SELECT_TABLE' && <TableView onSelect={handleTableSelect} />}
        {step === 'SELECT_MENU' && (
          <MenuListView 
            items={menuItems} 
            onAdd={(item) => {
              setCart(prev => {
                const existing = prev.find(i => i.id === item.id);
                if (existing) return prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
                return [...prev, {...item, quantity: 1}];
              });
            }} 
            onView={() => {}} 
          />
        )}
      </main>

      <ReservationFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        partySize={customerInfo.partySize}
        onSubmit={handleFormSubmit}
      />

      {isLargeGroup && step === 'SELECT_MENU' && cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-40">
          <button 
            onClick={() => setIsReviewOpen(true)}
            className="w-full bg-burgundy text-white p-5 rounded-[2rem] shadow-2xl flex justify-between items-center active:scale-95 transition-transform"
          >
            <span className="font-black uppercase text-[10px] tracking-widest bg-white/20 px-3 py-1 rounded-full">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} items in Cart
            </span>
            <span className="font-black italic uppercase text-sm">Continue to Payment</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      <OrderReviewModal 
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        cart={cart}
        updateQty={(id, delta) => {
          setCart(prev => prev.map(i => i.id === id ? {...i, quantity: i.quantity + delta} : i).filter(i => i.quantity > 0));
        }}
        total={cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
        onSubmit={handlePlaceOrderWithDeposit}
      />
    </div>
  );
};

export default ReservationFlow;