import React, { useEffect, useState } from 'react';
import { useStaffOrder } from '../../staff/hooks/useStaffOrder'; // Tái sử dụng để lấy danh sách bàn
import { TableSelectionGrid } from '../components/TableSelectionGrid';
import { BillDetailSidebar } from '../components/BillDetailSidebar';
import { PaymentActionCard } from '../components/PaymentActionCard';
import { useCashier } from '../hooks/useCashier';
import { TableResponse, TableStatus, PaymentMethod } from '../types';

const CheckoutView: React.FC = () => {
  // Lấy dữ liệu bàn từ hệ thống chung
  const { state: staffState, actions: staffActions } = useStaffOrder();

  // Logic nghiệp vụ của Cashier
  const { bill, loading, loadBill, handleApplyDiscount, processCheckout } = useCashier();

  // Trạng thái bàn đang được chọn trên UI
  const [selectedTableId, setSelectedTableId] = useState<number | undefined>(undefined);

  // Tự động làm mới dữ liệu bàn mỗi 5 giây
  useEffect(() => {
    staffActions.refreshData();
    const interval = setInterval(() => staffActions.refreshData(), 5000);
    return () => clearInterval(interval);
  }, [staffActions]);

  // Xử lý khi click vào bàn
  const handleSelectTable = (table: TableResponse) => {
    if (table.status === TableStatus.OCCUPIED && table.currentBill?.id) {
      setSelectedTableId(table.id);
      loadBill(table.currentBill.id); // Gọi API lấy chi tiết Bill
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-display">
      {/* PHẦN TRÁI: DANH SÁCH BÀN CẦN THANH TOÁN */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-burgundy italic leading-none">
              Cashier Terminal
            </h1>
            <p className="text-gray-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">
              Select an occupied table to process payment
            </p>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <span className="text-[10px] font-black text-olive uppercase italic">System Active</span>
            <div className="size-2 rounded-full bg-olive animate-pulse" />
          </div>
        </header>

        {/* Grid danh sách bàn */}
        <TableSelectionGrid
          tables={staffState.tables.filter(t => t.status === TableStatus.OCCUPIED)}
          onSelect={handleSelectTable}
          selectedTableId={selectedTableId}
        />

        {/* Hiển thị khi không có bàn nào đang bận */}
        {staffState.tables.filter(t => t.status === TableStatus.OCCUPIED).length === 0 && (
          <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[3rem] opacity-40">
            <span className="text-5xl mb-4">🧾</span>
            <p className="font-black uppercase text-[10px] tracking-widest text-gray-400 italic">No active bills found</p>
          </div>
        )}
      </main>

      {/* PHẦN PHẢI: CHI TIẾT HÓA ĐƠN & THANH TOÁN (SIDEBAR) */}
      <aside className={`w-[480px] bg-white transition-all duration-500 ease-in-out transform border-l border-gray-100 shadow-2xl flex flex-col
        ${bill ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {bill ? (
          <div className="flex flex-col h-full">
            {/* Header và Danh sách món nằm trong Sidebar này */}
            <div className="flex-1 overflow-hidden">
              <BillDetailSidebar
                bill={bill}
                loading={loading}
                onApplyDiscount={handleApplyDiscount}
                onCheckout={processCheckout}
              />
            </div>

            {/* Phần Action Card cố định ở dưới cùng sidebar
            <div className="p-8 bg-white border-t border-gray-50">
              <PaymentActionCard
                finalAmount={bill.finalPrice}
                onPay={processCheckout} // Gắn hàm thanh toán MoMo/Cash
                isProcessing={loading}
              />
            </div> lỗi double payment khúc này*/}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-12 text-center">
            <p className="text-gray-300 font-black uppercase text-xs italic tracking-widest">
              Select a table to view payment details
            </p>
          </div>
        )}
      </aside>

      {/* OVERLAY KHI ĐANG XỬ LÝ (REDIRECT MOMO/CASH) */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-white/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
            <div className="size-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-burgundy italic">Processing</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Please wait a moment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutView;