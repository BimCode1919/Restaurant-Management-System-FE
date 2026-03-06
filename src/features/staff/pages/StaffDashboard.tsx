import React, { useEffect, useMemo, useState } from 'react';
import { useStaffOrder } from '../hooks/useStaffOrder';
import { StaffHeader } from '../components/StaffHeader';
import { TableStatus, BillResponse, TableResponse } from '../types';
import { TableGrid } from '../components/TableGrid';
import { FilterType, TableFilterBar } from '../components/TableFilterBar';
import { TableActionModal } from '../components/TableActionModal';
import { NewOrderModal } from '../components/NewOrderModal';
import { Toaster, toast } from 'react-hot-toast';

const StaffDashboard: React.FC = () => {
  const { state, actions } = useStaffOrder();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [manageModal, setManageModal] = useState<{ show: boolean, table: TableResponse | null, fullBillData: any }>({
    show: false, table: null, fullBillData: null
  });
  const notifiedItems = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!state.tables || state.tables.length === 0) return;

    state.tables.forEach(table => {
      // Truy xuất sâu: Table -> Bill -> Orders -> Items
      const orders = table.currentBill?.orders || [];

      orders.forEach(order => {
        const items = order.items || [];

        items.forEach(item => {
          const itemId = String(item.id);
          // Kiểm tra trạng thái READY
          const isReady = item.itemStatus === 'READY';

          // Nếu món READY và ID này chưa có trong danh sách đã thông báo
          if (isReady && !notifiedItems.current.has(itemId)) {

            // Gọi hàm thông báo của bạn
            notifyDishReady(item.itemName, table.tableNumber);

            // Lưu ID vào Ref để lần polling sau (5s tới) không hiện lại nữa
            notifiedItems.current.add(itemId);
          }

          // Nếu món đã phục vụ (SERVED), xóa khỏi Ref để reset
          if (item.itemStatus === 'SERVED' && notifiedItems.current.has(itemId)) {
            notifiedItems.current.delete(itemId);
          }
        });
      });
    });
  }, [state.tables]);

  useEffect(() => {
    actions.refreshData();
    const interval = setInterval(() => actions.refreshData(), 5000);
    return () => clearInterval(interval);
  }, [actions.refreshData]);

  const displayTables = useMemo(() => {
    return state.tables.filter(table => {
      const matchesSearch = table.tableNumber.toLowerCase().includes(search.toLowerCase());
      const tableStatus = String(table.status).toUpperCase();
      const matchesFilter = filter === 'ALL' || tableStatus === filter;
      return matchesSearch && matchesFilter;
    });
  }, [state.tables, search, filter]);

  // HÀM QUAN TRỌNG: Fetch dữ liệu món ăn trước khi mở modal
  const handleManageTable = async (table: TableResponse) => {
    const billId = table.currentBill?.id;
    if (!billId) {
      alert("No active bill found for this table.");
      return;
    }

    try {
      const orders = await actions.fetchFullBillDetails(billId);
      setManageModal({
        show: true,
        table: table,
        fullBillData: { ...table.currentBill, orders }
      });
    } catch (error) {
      alert("Failed to load table items. Please try again.");
    }
  };

  const notifyDishReady = (dishName: string, tableNumber: string) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
      w-full bg-white rounded-[1.5rem] pointer-events-auto flex overflow-hidden border border-gray-100 shadow-2xl`}
      >
        {/* Vạch màu bên trái: Dùng màu Olive (Xanh lá) vì đây là trạng thái Hoàn Thành */}
        <div className="w-3 bg-olive" />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-[10px] font-black text-olive uppercase tracking-[0.2em] mb-1 italic">
                Kitchen Ready
              </h3>
              <p className="text-sm font-bold text-dark-gray leading-tight">
                Table <span className="text-burgundy text-lg italic">#{tableNumber}</span>
              </p>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-tighter">
                {dishName}
              </p>
            </div>

            {/* Chấm tròn nháy nháy giống trên card bàn */}
            <div className="size-2 bg-burgundy rounded-full animate-pulse shadow-[0_0_8px_rgba(128,0,32,0.4)]"></div>
          </div>
        </div>

        {/* Nút đóng được thiết kế tối giản */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="border-l border-gray-50 px-6 flex items-center justify-center text-[10px] font-black text-gray-300 hover:text-burgundy transition-colors uppercase tracking-widest"
        >
          Close
        </button>
      </div>
    ), {
      duration: Infinity, // Giữ nguyên yêu cầu không tự tắt của bạn
      id: `ready-${dishName}-${tableNumber}`
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F8F9FA] font-display">
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      <StaffHeader
        user={{ fullName: "Staff Member", avatar: "" }}
        onNewOrder={() => { actions.resetOrderFlow(); actions.setIsOrdering(true); }}
        onLogout={() => window.location.href = '/login'}
      />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-burgundy italic">Floor Status</h1>
            <p className="text-gray-500 font-bold text-sm mt-1">Active Tables: {state.tables.filter(t => t.status === TableStatus.OCCUPIED).length}</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <span className="text-2xl font-black text-olive italic">SYSTEM OK</span>
            <div className="size-3 rounded-full bg-olive animate-pulse"></div>
          </div>
        </div>

        <TableFilterBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />

        <TableGrid
          tables={displayTables}
          onSelectTable={(table) => { actions.setSelectedTable(table); actions.setOrderStep('PARTY_SIZE'); actions.setIsOrdering(true); }}
          onManageTable={handleManageTable}
        />

        {manageModal.show && manageModal.table && (
          <TableActionModal
            tableNumber={manageModal.table.tableNumber}
            billData={manageModal.fullBillData}
            onClose={() => setManageModal({ show: false, table: null, fullBillData: null })}
            onUpdateOrder={() => {
              actions.setSelectedTable(manageModal.table);
              actions.setOrderStep('MENU');
              actions.setIsOrdering(true);
              setManageModal({ show: false, table: null, fullBillData: null });
            }}
            onCancelItem={async (id) => {
              const res = await actions.cancelOrderItem(id);
              if (res?.success) handleManageTable(manageModal.table!);
            }}
          />
        )}
      </main>

      {/* Loading Overlay */}
      {state.loading && (
        <div className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-[2rem] shadow-2xl">
            <div className="size-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
            <p className="text-dark-gray font-black uppercase text-[10px] tracking-widest">Processing...</p>
          </div>
        </div>
      )}

      {/* Các Modal Order khác giữ nguyên... */}
      {state.isOrdering && (
        <NewOrderModal
          step={state.orderStep} tables={state.tables} menu={state.menu} cart={state.cart}
          selectedTable={state.selectedTable} partySize={state.partySize}
          onClose={actions.resetOrderFlow} onFinalize={actions.finalizeOrder}
          setPartySize={actions.setPartySize} setOrderStep={actions.setOrderStep}
          onAddToCart={(item) =>
            actions.setCart(prev => {
              const existing = prev.find(i => i.id === item.id);

              if (existing) {
                return prev.map(i =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                );
              }

              return [...prev, { ...item, quantity: 1 }];
            })
          }
          onUpdateCartQty={(index, d) =>
            actions.setCart(prev =>
              prev.map((item, i) =>
                i === index
                  ? { ...item, quantity: Math.max(1, item.quantity + d) }
                  : item
              )
            )
          }
          onRemoveFromCart={(id) => actions.setCart(p => p.filter(i => i.id !== id))}
          onUpdateNote={(id, n) => actions.setCart(p => p.map(i => i.id === id ? { ...i, note: n } : i))}
          onSelectTable={(table) => {
            actions.setSelectedTable(table);
            actions.setOrderStep(table.status === TableStatus.AVAILABLE ? 'PARTY_SIZE' : 'MENU');
          }}
        />
      )}
    </div>
  );
};

export default StaffDashboard;