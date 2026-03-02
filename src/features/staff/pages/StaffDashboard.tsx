// src/features/staff/pages/StaffDashboard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useStaffOrder } from '../hooks/useStaffOrder';
import { StaffHeader } from '../components/StaffHeader';
import { OrderCard } from '../components/OrderCard';
import { NewOrderModal } from '../components/NewOrderModal';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { TableStatus, BillResponse } from '../types';
import { TableGrid } from '../components/TableGrid';
import { FilterType, TableFilterBar } from '../components/TableFilterBar';

const StaffDashboard: React.FC = () => {
  const { state, actions } = useStaffOrder();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [viewingBill, setViewingBill] = useState<BillResponse | null>(null);

  // Chỉ chạy 1 lần khi mount, sau đó chạy qua Interval
  useEffect(() => {
    actions.refreshData();
    const interval = setInterval(() => {
      actions.refreshData();
    }, 30000);
    return () => clearInterval(interval);
  }, [actions.refreshData]); // Dependency là hàm đã được useCallback

  const displayTables = useMemo(() => {
    return state.tables.filter(table => {
      // Lọc theo số bàn
      const matchesSearch = table.tableNumber.toLowerCase().includes(search.toLowerCase());

      // Lọc theo Status Enum
      const tableStatus = String(table.status).toUpperCase();
      const matchesFilter = filter === 'ALL' || tableStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [state.tables, search, filter]);

  const handleAddMore = (bill: BillResponse) => {
    const table = state.tables.find(t => t.tableNumber === bill.tableNumbers[0]);
    if (table) {
      actions.setSelectedTable(table);
      actions.setOrderStep('MENU');
      actions.setIsOrdering(true);
      setViewingBill(null);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F8F9FA] font-display">
      <StaffHeader
        user={{ fullName: "Staff Member", avatar: "" }}
        onNewOrder={() => {
          actions.resetOrderFlow();
          actions.setIsOrdering(true);
        }}
        onLogout={() => window.location.href = '/login'}
      />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col xl:flex-row gap-8 mb-10 justify-between items-start xl:items-end">
          <div>
            <h1 className="text-dark-gray text-4xl font-black uppercase tracking-tighter text-burgundy">Floor Status</h1>
            <p className="text-gray-500 font-bold text-sm mt-1">
              Active Tables: {state.tables.filter(t => t.status === TableStatus.OCCUPIED).length}
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <span className="text-2xl font-black text-olive">SYSTEM OK</span>
            <div className="size-3 rounded-full bg-olive animate-pulse"></div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR COMPONENT */}
      <TableFilterBar 
        search={search} 
        setSearch={setSearch} 
        filter={filter} 
        setFilter={setFilter} 
      />

        {/* TABLES GRID */}
        <TableGrid
          tables={displayTables}
          onSelectTable={(table) => {
            actions.setSelectedTable(table);
            actions.setOrderStep('PARTY_SIZE');
            actions.setIsOrdering(true);
          }}
          onViewDetail={(bill) => setViewingBill(bill)}
        />
      </main>

      {/* MODALS */}
      {state.isOrdering && (
        <NewOrderModal
          step={state.orderStep}
          tables={state.tables}
          menu={state.menu}
          cart={state.cart}
          selectedTable={state.selectedTable}
          partySize={state.partySize}
          onClose={actions.resetOrderFlow}
          onSelectTable={(table) => {
            actions.setSelectedTable(table);
            actions.setOrderStep(table.status === TableStatus.AVAILABLE ? 'PARTY_SIZE' : 'MENU');
          }}
          setPartySize={actions.setPartySize}
          setOrderStep={actions.setOrderStep}
          onAddToCart={(item) => {
            actions.setCart(prev => {
              const existing = prev.find(i => i.id === item.id);
              if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
              return [...prev, { ...item, quantity: 1, note: '' }];
            });
          }}
          onUpdateCartQty={(id, delta) => actions.setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))}
          onRemoveFromCart={(id) => actions.setCart(prev => prev.filter(i => i.id !== id))}
          onUpdateNote={(id, note) => actions.setCart(prev => prev.map(i => i.id === id ? { ...i, note } : i))}
          onFinalize={actions.finalizeOrder}
        />
      )}

      {viewingBill && (
        <OrderDetailsModal
          bill={viewingBill}
          onClose={() => setViewingBill(null)}
          onAddMore={handleAddMore}
        />
      )}
    </div>
  );
};

export default StaffDashboard;