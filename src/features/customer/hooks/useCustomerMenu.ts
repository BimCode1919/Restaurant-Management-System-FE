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
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(true);

    // Initial Session Setup
    const handleInitializeSession = async (partySize: number) => {
        // 1. Kiểm tra tableId từ store (được truyền từ AppRouter)
        const tableId = store?.tableId;

        if (!tableId) {
            alert("Table ID not found in token. Please scan QR again.");
            return;
        }

        try {
            setLoading(true);

            // 2. Ép kiểu về number và đưa vào mảng theo đúng format BE yêu cầu
            const payload = {
                tableIds: [Number(tableId)], // BE nhận mảng: [10]
                partySize: Number(partySize),
                reservationId: null
            };

            console.log("Sending Payload:", payload); // Debug xem có bị null không

            const res: any = await customerApi.createBill(payload);

            // Lưu Bill ID để dùng cho các bước sau
            const newBillId = res.data?.data?.id || res.data?.id;
            setCurrentBillId(newBillId);
            setIsPartyModalOpen(false);

        } catch (error) {
            console.error("Create Bill Error:", error);
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
            } finally {
                setLoading(false);
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
        const billId = currentBillId || Number(localStorage.getItem('activeBillId'));

        if (!billId) {
            alert("No active session found. Please refresh.");
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
            alert("Order create successfully!");
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