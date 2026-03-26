import { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { MenuItem, AdminTab, OrderItem  } from '../types';


export const useAdminDashboard = (store: any) => {
    // --- DATA STATES ---
    const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    // --- DASHBOARD DATA STATES ---
    const [dailyRevenue, setDailyRevenue] = useState<{ date: string; revenue: number }[]>([]);
    // --- UI & MODAL STATES ---
    const [menuSearch, setMenuSearch] = useState('');
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

    // --- MANUAL ORDER (POS) STATES ---
    const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
    const [manualCart, setManualCart] = useState<OrderItem[]>([]);
    const [selectedTable, setSelectedTable] = useState('1');

    // ================= 1. FETCH DATA (READ) =================

        const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getAllItems(0, 50);

            // Cách 1: Nếu Axios của bạn chưa bóc tách (response.data là ApiResponse)
            if (response.data && response.data.data && response.data.data.content) {
                setMenu(response.data.data.content);
            }
            // Cách 2: Nếu Axios interceptor đã bóc tách (response là ApiResponse)
            else if ((response as any).data?.content) {
                setMenu((response as any).data.content);
            }
        } catch (error) {
            console.error("Fail to get menu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'MENU') {
            fetchMenu();
        }

    }, [activeTab]);

    // ================= 2. MENU ACTIONS (CREATE / UPDATE / DELETE) =================

    const handleMenuSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Parse dữ liệu từ form sang định dạng Backend yêu cầu
        const imageUrlValue = (formData.get('imageUrl') as string | null) || '';

        if (!imageUrlValue) {
            alert('Please upload a dish image before saving.');
            setLoading(false);
            return;
        }

        const itemData = {
            name: formData.get('name') as string,
            price: Number(formData.get('price')),
            unit: formData.get('unit') as string,
            categoryId: Number(formData.get('categoryId')),
            description: formData.get('description') as string,
            imageUrl: imageUrlValue,
            available: formData.get('available') === 'true'
        };

        try {
            setLoading(true);
            if (editingMenuItem) {
                // Gọi API Update (Nếu bạn đã có adminApi.updateItem)
                await adminApi.updateItem(editingMenuItem.id, itemData);
                alert("Update successful!");
            } else {
                // Gọi API Create
                await adminApi.createItem(itemData);
                alert("New dish added successfully!");
            }

            // Thành công thì đóng modal và reset
            setIsMenuModalOpen(false);
            setEditingMenuItem(null);
            await fetchMenu(); // Load lại danh sách mới
        } catch (error: any) {
            console.error("Error saving dish:", error);
            alert(error.response?.data?.message || "Cannot save dish. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteMenuItem = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this dish?")) {
            try {
                setLoading(true);
                await adminApi.deleteItem(id);
                await fetchMenu();
            } catch (error) {
                console.error("Failed to delete dish:", error);
                alert("Cannot delete this dish.");
            } finally {
                setLoading(false);
            }
        }
    };
    // ================= 3. MANUAL ORDER ACTIONS (POS) =================
    const addToManualCart = (item: MenuItem) => {
        setManualCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                );
            }
            return [...prev, { ...item, quantity: 1 } as OrderItem];
        });
    };

    const removeFromManualCart = (id: number) => {
        setManualCart(prev => prev.filter(item => item.id !== id));
    };

    const submitManualOrder = async () => {
        if (manualCart.length === 0) return alert("Your cart is empty!");

        try {
            console.log("Submitting manual order for table:", selectedTable, manualCart);
            // TODO: Call adminApi.createManualOrder({ table: selectedTable, items: manualCart })
            setManualCart([]);
            setIsManualOrderOpen(false);
            alert("Order submitted successfully!");
        } catch (error) {
            alert("Error occurred while creating the order.");
        }
    };

    // ================= EXPORTS =================
return {
    activeTab,
    setActiveTab,
    menu,
    loading,
    fetchMenu,
    //MENU SEARCH
    menuSearch,
    setMenuSearch,
    //MENU MODAL
    isMenuModalOpen,
    setIsMenuModalOpen,
    editingMenuItem,
    setEditingMenuItem,
    handleMenuSubmit,
    deleteMenuItem,
    //ORDER
    isManualOrderOpen,
    setIsManualOrderOpen,
    manualCart,
    selectedTable,
    setSelectedTable,
    addToManualCart,
    removeFromManualCart,
    submitManualOrder,

};
};