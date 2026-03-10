import React, { useEffect, useState } from 'react';
import { useStaffOrder } from '../../staff/hooks/useStaffOrder';
import { TableSelectionGrid } from '../components/TableSelectionGrid';
import { BillDetailSidebar } from '../components/BillDetailSidebar';
import { MergeBillModal } from '../components/MergeBillModal'; // Component mới
import { useCashier } from '../hooks/useCashier';
import { TableResponse, TableStatus } from '../types';

const CheckoutView: React.FC = () => {
  const { state: staffState, actions: staffActions } = useStaffOrder();
  const { bill, loading, loadBill, handleApplyDiscount, processCheckout, handleMergeBills } = useCashier();

  const [selectedTableId, setSelectedTableId] = useState<number | undefined>(undefined);
  const [showMergeModal, setShowMergeModal] = useState(false);

  useEffect(() => {
    staffActions.refreshData();
    const interval = setInterval(() => staffActions.refreshData(), 5000);
    return () => clearInterval(interval);
  }, [staffActions]);

  const occupiedTables = staffState.tables.filter(t => t.status === TableStatus.OCCUPIED);

  const handleSelectTable = (table: TableResponse) => {
    if (table.status === TableStatus.OCCUPIED && table.currentBill?.id) {
      setSelectedTableId(table.id);
      loadBill(table.currentBill.id);
    }
  };

  const onConfirmMerge = async (billIds: number[]) => {
    const newBill = await handleMergeBills(billIds);
    if (newBill) {
      setShowMergeModal(false);
      staffActions.refreshData(); // Refresh để cập nhật lại danh sách bàn
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-display">
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-burgundy italic leading-none">
              Cashier Terminal
            </h1>
            <p className="text-gray-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">
              Process payments or merge bills for customers
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Nút Merge Bill */}
            <button
              onClick={() => setShowMergeModal(true)}
              className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 hover:border-olive group transition-all"
            >
              <span className="material-symbols-outlined text-olive group-hover:rotate-180 transition-transform duration-500">call_merge</span>
              <span className="text-[10px] font-black text-dark-gray uppercase tracking-widest">Merge Bills</span>
            </button>

            {/* Logout (đã tối ưu UI) */}
            <button onClick={() => window.confirm("Logout?") && (window.location.href = '/login')} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:text-burgundy">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <TableSelectionGrid
          tables={occupiedTables}
          onSelect={handleSelectTable}
          selectedTableId={selectedTableId}
        />

        {occupiedTables.length === 0 && (
          <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[3rem] opacity-40">
            <span className="text-5xl mb-4 italic font-black text-gray-200">EMPTY</span>
            <p className="font-black uppercase text-[10px] tracking-widest text-gray-400 italic">No active bills found</p>
          </div>
        )}
      </main>

      {/* Sidebar Chi tiết Bill */}
      <aside className={`w-[480px] bg-white transition-all duration-500 border-l border-gray-100 shadow-2xl flex flex-col ${bill ? 'translate-x-0' : 'translate-x-full'}`}>
        {bill ? (
          <div className="flex-1 overflow-hidden">
            <BillDetailSidebar
              bill={bill}
              loading={loading}
              onApplyDiscount={handleApplyDiscount}
              onCheckout={processCheckout}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-12 text-center opacity-20">
            <p className="text-dark-gray font-black uppercase text-xs italic tracking-widest leading-loose">
              Select a table<br />to begin checkout
            </p>
          </div>
        )}
      </aside>

      {/* Modal gộp Bill */}
      {showMergeModal && (
        <MergeBillModal
          tables={occupiedTables}
          isProcessing={loading}
          onClose={() => setShowMergeModal(false)}
          onConfirm={onConfirmMerge}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[300] bg-white/60 backdrop-blur-md flex items-center justify-center">
          <div className="size-16 border-8 border-burgundy border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default CheckoutView;