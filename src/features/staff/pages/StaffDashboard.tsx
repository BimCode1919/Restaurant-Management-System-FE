// src/features/staff/pages/StaffDashboard.tsx
import React from 'react';
import { useStaffOrder } from '../hooks/useStaffOrder';
import { StaffHeader } from '../components/StaffHeader';
import { OrderCard } from '../components/OrderCard';
import { NewOrderModal } from '../components/NewOrderModal';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { OrderStatus } from '../types';

const StaffDashboard: React.FC<{ store: any }> = ({ store }) => {
  const { state, actions } = useStaffOrder(store);

  // Loading state nếu cần
  if (!store) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-gray-400 animate-pulse">Initializing System...</div>;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F8F9FA] font-display">
      {/* 1. Header Section */}
      <StaffHeader 
        user={store.user} 
        onNewOrder={() => actions.setIsOrdering(true)} 
        onLogout={store.logout} 
      />

      <main className="flex-1 overflow-y-auto p-8">
        {/* 2. Stats Section */}
        <div className="flex flex-col xl:flex-row gap-8 mb-10 justify-between items-start xl:items-end">
          <div>
            <h1 className="text-dark-gray text-4xl font-black uppercase tracking-tighter">Active Floor Orders</h1>
            <p className="text-gray-500 font-bold text-sm mt-1">Real-time synchronization with Kitchen & POS.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kitchen Load</p>
               <div className="flex items-center gap-2">
                 <span className="text-2xl font-black text-burgundy">BUSY</span>
                 <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(i => <div key={i} className={`h-4 w-1 rounded-full ${i <= 3 ? 'bg-burgundy' : 'bg-gray-100'}`}></div>)}
                 </div>
               </div>
             </div>
             <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Open Tickets</p>
               <span className="text-2xl font-black text-dark-gray">{state.filteredOrders.length}</span>
             </div>
          </div>
        </div>

        {/* 3. Filter & Search Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-full lg:w-96 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-burgundy/20" 
              placeholder="Find Table # or Order ID..." 
              value={state.search} 
              onChange={e => actions.setSearch(e.target.value)} 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto p-1">
            {(['ALL', 'PENDING', 'PREPARING', 'READY'] as const).map(s => (
              <button 
                key={s}
                onClick={() => actions.setFilter(s)}
                className={`whitespace-nowrap h-11 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${state.filter === s ? 'bg-burgundy text-white shadow-lg shadow-burgundy/20' : 'bg-white border border-gray-200 text-gray-400 hover:text-dark-gray'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Orders Grid */}
        {state.filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.filteredOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onView={actions.setViewingOrder}
                onUpdateStatus={store.updateOrderStatus}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-200">inbox</span>
            <p className="mt-4 font-black uppercase text-gray-300 tracking-[0.2em]">No Active Orders</p>
          </div>
        )}
      </main>

      {/* 5. Modals Section */}
      {state.isOrdering && (
        <NewOrderModal 
          step={state.orderStep}
          tables={store.tables || []}
          menu={store.menu || []}
          cart={state.cart}
          selectedTable={state.selectedTable}
          onClose={actions.resetOrderState}
          onSelectTable={(id) => { actions.setSelectedTable(id); actions.setOrderStep('MENU'); }}
          onAddToCart={actions.handleAddToCart}
          onUpdateCartQty={(id, delta) => actions.setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))}
          onRemoveFromCart={(id) => actions.setCart(prev => prev.filter(item => item.id !== id))}
          onUpdateNote={(id, note) => actions.setCart(prev => prev.map(item => item.id === id ? { ...item, note } : item))}
          onFinalize={actions.finalizeOrder}
        />
      )}

      {state.viewingOrder && (
        <OrderDetailsModal 
          order={state.viewingOrder} 
          onClose={() => actions.setViewingOrder(null)} 
          onAddMore={(tableId) => {
            actions.setSelectedTable(tableId);
            actions.setOrderStep('MENU');
            actions.setIsOrdering(true);
            actions.setViewingOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffDashboard;