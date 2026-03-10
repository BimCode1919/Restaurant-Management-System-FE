import { useState, useEffect } from 'react';
import { MenuItem, OrderItem } from '../types';
import { customerApi } from '../services/customerApi';

export const useCustomerMenu = (store: any) => {
    const [activeTab, setActiveTab] = useState<'MENU' | 'AI' | 'STATUS'>('MENU');
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [currentBillId, setCurrentBillId] = useState<number | null>(null);

    // UI States
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Đặt mặc định là false để tránh bị "nháy" modal trước khi check xong
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

    // --- LOGIC 1: Kiểm tra trạng thái bàn khi load trang ---
    useEffect(() => {
        const checkExistingBill = async () => {
            if (!store?.tableId) return;

            try {
                // Chúng ta gọi API lấy hóa đơn hiện tại của bàn
                // Lưu ý: Route này cần trả về Bill nếu bàn đang OCCUPIED
                const res: any = await customerApi.getOrdersByBill(store.tableId);

                // Nếu Backend trả về dữ liệu bill (tức là bàn đã có người)
                if (res.data && (res.data.id || (Array.isArray(res.data) && res.data.length > 0))) {
                    const billId = res.data.id || res.data[0].billId;
                    console.log("Table is Occupied. Found Bill ID:", billId);

                    setCurrentBillId(billId);
                    localStorage.setItem('activeBillId', billId.toString());
                    setIsPartyModalOpen(false); // Đóng modal
                } else {
                    console.log("Table is Available. Opening modal...");
                    setIsPartyModalOpen(true); // Mở modal nhập số người
                }
            } catch (error) {
                console.log("No active bill found or Error. Opening modal...");
                setIsPartyModalOpen(true);
            } finally {
                setLoading(false);
            }
        };

        checkExistingBill();
    }, [store?.tableId]);

    // --- LOGIC 2: Tạo Bill mới (Khi khách nhấn Start Ordering) ---
    const handleInitializeSession = async (partySize: number) => {
        if (!store?.tableId) return;

        try {
            setLoading(true);
            const payload = {
                tableIds: [Number(store.tableId)],
                partySize: Number(partySize),
                reservationId: null
            };

            const res: any = await customerApi.createBill(payload);

            // Lấy ID từ cấu trúc ApiResponse của bạn
            const newBillId = res.data?.data?.id || res.data?.id;

            if (newBillId) {
                console.log("Bill created successfully:", newBillId);
                setCurrentBillId(newBillId);
                localStorage.setItem('activeBillId', newBillId.toString());

                // QUAN TRỌNG: Cập nhật state để đóng modal ngay lập tức
                setIsPartyModalOpen(false);
            }
        } catch (error) {
            console.error("Create Bill Error:", error);
            alert("Could not start session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Load Menu
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res: any = await customerApi.getAvailableMenu();
                setMenu(res.data?.data || res.data || []);
            } catch (error) {
                console.error("Menu Loading Error:", error);
            }
        };
        fetchMenu();
    }, []);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 } as OrderItem];
        });
    };

    const updateCartQty = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    // Place Order Logic
    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        // Lấy billId từ state hoặc local storage
        const billId = currentBillId || Number(localStorage.getItem('activeBillId'));

        if (!billId) {
            setIsPartyModalOpen(true); // Nếu mất session, bắt chọn lại người để tạo bill
            return;
        }

        try {
            setLoading(true);
            await customerApi.createOrder({
                billId: billId,
                orderType: 'AT_TABLE',
                items: cart.map(i => ({
                    itemId: i.id,
                    quantity: i.quantity,
                    notes: ""
                }))
            });
            setCart([]);
            setIsReviewOpen(false);
            setActiveTab('STATUS');
            alert("Order created successfully!");
        } catch (error: any) {
            alert(error.response?.data?.message || "Order failed.");
        } finally {
            setLoading(false);
        }
    };

    return {
        activeTab, setActiveTab,
        menu, loading,
        cart, addToCart, updateCartQty,
        cartTotal: cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
        isReviewOpen, setIsReviewOpen,
        selectedItem, setSelectedItem,
        isPartyModalOpen, handleInitializeSession,
        currentBillId, handlePlaceOrder
    };
};