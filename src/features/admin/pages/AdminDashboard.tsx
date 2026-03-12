import React from 'react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useInventory } from '../hooks/useInventory';

import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import MenuModal from '../components/MenuModal';
import ManualOrderOverlay from '../components/ManualOrderOverlay';

import MenuView from '../components/MenuView';
import DashboardView  from "../components/DashboardView";
import { InventoryView } from "../components/InventoryView";
import  InventoryModal  from "../components/InventoryModal";
import StaffView from '../components/StaffView';
import { useStaff } from '../hooks/useStaff';
import StaffModal from '../components/StaffModal';

const AdminDashboard: React.FC<{ store: any }> = ({ store }) => {

    const adminData = useAdminDashboard(store);
    const inventory = useInventory();
    const staffData = useStaff();

    const [editingIngredient, setEditingIngredient] = React.useState<any>(null);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = React.useState(false);

    const navItems = [
        { id: 'DASHBOARD', label: 'Dashboard' },
        { id: 'MENU', label: 'Menu Management' },
        { id: 'INVENTORY', label: 'Inventory' },
        { id: 'REPORTS', label: 'Reports' },
        { id: 'STAFF', label: 'Staff' },
        { id: 'VOUCHER', label: 'Vouchers' },
    ];

    const currentLabel = navItems.find(n => n.id === adminData.activeTab)?.label;

    const renderContent = () => {

        switch (adminData.activeTab) {

            case 'DASHBOARD':
                return <DashboardView 
                 />;
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

            case 'INVENTORY':
                return (
                    <InventoryView
                        ingredients={inventory.ingredients}
                        loading={inventory.loading}
                        search={inventory.search}
                        setSearch={inventory.setSearch}
                        onEdit={(ingredient) => {
                            setEditingIngredient(ingredient);
                            setIsInventoryModalOpen(true);
                        }}
                        onDelete={inventory.deleteIngredient}
                        onAddNew={() => {
                            setEditingIngredient(null);
                            setIsInventoryModalOpen(true);
                        }}
                    />
                );

            case 'STAFF':
                return (
                <StaffView
                    staff={staffData.staff}
                    loading={staffData.loading}
                    onDelete={staffData.deleteStaff}
                    onEdit={staffData.openEditModal} 
                    onAddNew={staffData.openAddModal}
                />);

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

            <AdminSidebar
                activeTab={adminData.activeTab}
                setActiveTab={adminData.setActiveTab}
                user={store.user}
                logout={store.logout}
            />

            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">

                <AdminHeader activeTab={adminData.activeTab} label={currentLabel} />

                <div className="p-10 flex-1 overflow-y-auto">
                    {renderContent()}
                </div>

            </main>

            <MenuModal
                isOpen={adminData.isMenuModalOpen}
                onClose={() => adminData.setIsMenuModalOpen(false)}
                editingItem={adminData.editingMenuItem}
                onSubmit={adminData.handleMenuSubmit}
            />

            <InventoryModal
                ingredient={editingIngredient}
                isOpen={isInventoryModalOpen}   
                onClose={() => setIsInventoryModalOpen(false)}
                onSuccess={inventory.fetchIngredients}
            />
            <StaffModal 
                isOpen={staffData.isModalOpen} 
                onClose={() => staffData.setIsModalOpen(false)} 
                onSuccess={staffData.fetchStaff} 
                editingStaff={staffData.selectedStaff} 
            />

            {adminData.isManualOrderOpen && (
                <ManualOrderOverlay
                    onClose={() => adminData.setIsManualOrderOpen(false)}
                    cart={adminData.manualCart}
                    tables={store.tables}
                    menu={adminData.menu}
                    selectedTable={adminData.selectedTable}
                    onSelectTable={(id) => adminData.setSelectedTable(String(id))}
                    onAddToCart={adminData.addToManualCart}
                    onRemoveFromCart={adminData.removeFromManualCart}
                    onSubmitOrder={adminData.submitManualOrder}
                />
            )}

        </div>
    );
};

export default AdminDashboard;