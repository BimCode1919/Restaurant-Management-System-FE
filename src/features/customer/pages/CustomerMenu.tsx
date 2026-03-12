import React from 'react';
import { useCustomerMenu } from '../hooks/useCustomerMenu';
import MenuListView from '../components/MenuListView';
import AIView from '../components/AIView';
import OrderStatusView from '../components/OrderStatusView';
import OrderReviewModal from '../components/OrderReviewModal';
import PartySizeModal from '../components/PartySizeModal'

const CustomerPage: React.FC<{ store: any }> = ({ store }) => {
  const menuData = useCustomerMenu(store);

  if (menuData.loading && menuData.menu.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
        <p className="ml-3 font-bold text-gray-500 uppercase text-[10px] tracking-widest">
          Loading menu...
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (menuData.activeTab) {
      case 'MENU':
        return (
          <MenuListView
            items={menuData.menu}
            onAdd={menuData.addToCart}
            onView={(item) => menuData.setSelectedItem(item)}
          />
        );
      case 'STATUS':
        return <OrderStatusView billId={menuData.currentBillId || Number(localStorage.getItem('activeBillId')) || 0} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans relative">

      <PartySizeModal
        isOpen={menuData.isPartyModalOpen}
        onConfirm={menuData.handleInitializeSession}
      />

      <header className="bg-white p-6 sticky top-0 z-50 flex justify-between items-center border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-burgundy rounded-xl flex items-center justify-center text-white shadow-lg shadow-burgundy/20">
            <span className="material-symbols-outlined text-xl">restaurant</span>
          </div>
          <h1 className="text-xl font-black text-dark-gray uppercase tracking-tighter italic">Culina</h1>
        </div>

        <div className="px-4 py-2 bg-burgundy/10 rounded-full text-[10px] font-black uppercase tracking-widest text-burgundy border border-burgundy/20">
          Table {store?.tableNumber || "N/A"}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-[89px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 flex p-2 gap-2">
        {['MENU', 'STATUS'].map(tab => (
          <button
            key={tab}
            onClick={() => menuData.setActiveTab(tab as any)}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${menuData.activeTab === tab
                ? 'bg-burgundy text-white shadow-xl shadow-burgundy/20'
                : 'text-gray-400'
              }`}
          >
            {tab === 'STATUS' ? 'My Orders' : 'Menu'}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-6 pb-32 max-w-2xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Floating Review Button - Change: open modal instead of placing order immediately */}
      {menuData.cart.length > 0 && menuData.activeTab === 'MENU' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-50 animate-in slide-in-from-bottom-10">
          <button
            onClick={() => menuData.setIsReviewOpen(true)}
            className="w-full bg-gray-900 text-white p-5 rounded-[2rem] shadow-2xl flex items-center justify-between group active:scale-95 transition-all border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 bg-burgundy rounded-xl flex items-center justify-center text-white font-black animate-pulse shadow-lg shadow-burgundy/30">
                {menuData.cart.reduce((a, b) => a + b.quantity, 0)}
              </div>

              <div className="text-left">
                <span className="block font-black uppercase text-[10px] tracking-widest text-white/60 leading-none mb-1">
                  View Cart
                </span>
                <span className="block font-black uppercase text-xs tracking-widest italic text-burgundy-light">
                  Review your items
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter leading-none">
                Total
              </p>
              <span className="text-xl font-black">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(menuData.cartTotal)}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 1. Dish detail modal */}
      {menuData.selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-sm w-full shadow-2xl animate-in zoom-in-95">

            <div
              className="w-full h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url(${menuData.selectedItem.imageURL && menuData.selectedItem.imageURL !== 'string'
                    ? menuData.selectedItem.imageURL
                    : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500'
                  })`
              }}
            />

            <div className="p-8 text-center">
              <h3 className="text-2xl font-black text-dark-gray mb-2 italic uppercase">
                {menuData.selectedItem.name}
              </h3>

              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-4">
                {menuData.selectedItem.categoryName}
              </p>

              <p className="text-gray-500 text-sm mb-8 leading-relaxed italic">
                {menuData.selectedItem.description ||
                  "A signature dish carefully prepared using the freshest ingredients of the day."}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    menuData.addToCart(menuData.selectedItem!);
                    menuData.setSelectedItem(null);
                  }}
                  className="w-full bg-burgundy text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-burgundy/20 hover:scale-[1.02] transition-transform"
                >
                  Add to Cart — {new Intl.NumberFormat('vi-VN').format(menuData.selectedItem.price)}
                </button>

                <button
                  onClick={() => menuData.setSelectedItem(null)}
                  className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] py-2"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Review & Confirm Order Modal */}
      <OrderReviewModal
        isOpen={menuData.isReviewOpen}
        onClose={() => menuData.setIsReviewOpen(false)}
        cart={menuData.cart}
        updateQty={menuData.updateCartQty}
        total={menuData.cartTotal}
        onSubmit={menuData.handlePlaceOrder}
      />
    </div>
  );
};

export default CustomerPage;