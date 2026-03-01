import React from 'react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import MenuModal from '../components/MenuModal';
import ManualOrderOverlay from '../components/ManualOrderOverlay';
import MenuView from '../components/MenuView';

const AdminDashboard: React.FC<{ store: any }> = ({ store }) => {
    const adminData = useAdminDashboard(store);

    // 1. Định nghĩa nhãn cho Header
    const navItems = [
        { id: 'DASHBOARD', label: 'Dashboard' },
        { id: 'MENU', label: 'Menu Management' },
        { id: 'INVENTORY', label: 'Inventory' },
        { id: 'REPORTS', label: 'Reports' },
        { id: 'STAFF', label: 'Staff' },
        { id: 'VOUCHER', label: 'Vouchers' },
    ];
    const currentLabel = navItems.find(n => n.id === adminData.activeTab)?.label;

    // 2. Hàm render nội dung chính dựa trên Tab đang chọn
    const renderContent = () => {
        switch (adminData.activeTab) {
            case 'MENU':
                return (
                    <MenuView
                        menu={adminData.menu}
                        loading={adminData.loading}
                        menuSearch={adminData.menuSearch}
                        setMenuSearch={adminData.setMenuSearch}
                        onEdit={(item) => { 
                            adminData.setEditingMenuItem(item); 
                            adminData.setIsMenuModalOpen(true); 
                        }}
                        onDelete={adminData.deleteMenuItem}
                        onAddNew={() => { 
                            adminData.setEditingMenuItem(null); 
                            adminData.setIsMenuModalOpen(true); 
                        }}
                    />
                );
            case 'DASHBOARD':
                return (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-bold uppercase tracking-widest">Dashboard Overview - Coming Soon</p>
                    </div>
                );
            default:
                return (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest italic">
                            {adminData.activeTab} Module is under construction
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Thanh điều hướng bên trái */}
            <AdminSidebar
                activeTab={adminData.activeTab}
                setActiveTab={adminData.setActiveTab}
                user={store.user}
                logout={store.logout}
            />

            {/* Vùng nội dung chính bên phải */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                <AdminHeader activeTab={adminData.activeTab} label={currentLabel} />
                
                <div className="p-10 flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>

            {/* Modal để Thêm/Sửa món ăn (Chỉ để 1 cái) */}
            <MenuModal
                isOpen={adminData.isMenuModalOpen}
                onClose={() => adminData.setIsMenuModalOpen(false)}
                editingItem={adminData.editingMenuItem}
                onSubmit={adminData.handleMenuSubmit}
            />

            {/* Overlay cho Manual Order (POS) */}
            {adminData.isManualOrderOpen && (
                <ManualOrderOverlay
                    onClose={() => adminData.setIsManualOrderOpen(false)}
                    cart={adminData.manualCart}
                    tables={store.tables}
                    menu={adminData.menu}
                    selectedTable={adminData.selectedTable}
                    onSelectTable={adminData.setSelectedTable}
                    onAddToCart={adminData.addToManualCart}
                    onRemoveFromCart={adminData.removeFromManualCart}
                    onSubmitOrder={adminData.submitManualOrder}
                />
            )}
        </div>
    );
};

export default AdminDashboard;