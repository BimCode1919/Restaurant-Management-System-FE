import { useState, useEffect } from 'react';
import { MenuItem, OrderItem } from '../types';
import { customerApi } from '../services/customerApi';
import { getAIFoodSuggestions } from '../services/geminiService';

export const useCustomerMenu = (store: any) => {
    // 1. Basic UI States
    const [activeTab, setActiveTab] = useState<'MENU' | 'AI' | 'STATUS'>('MENU');
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<OrderItem[]>([]);

    // 2. Modal & Interaction States
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // 3. AI States
    const [aiResponse, setAiResponse] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [query, setQuery] = useState('');

    // --- LOGIC FETCH MENU ---
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const res: any = await customerApi.getAvailableMenu();

                if (res.data && res.data.data) {
                    setMenu(res.data.data);
                } else if (Array.isArray(res.data)) {
                    setMenu(res.data);
                }
            } catch (error) {
                console.error("Lỗi tải menu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // --- LOGIC GIỎ HÀNG ---
    const addToCart = (item: MenuItem) => {
        setCart(prev => {
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

    const updateCartQty = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0)); 
    };

    // --- LOGIC ĐẶT MÓN ---
    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        // billId lấy từ store (mặc định là 1 nếu chưa có từ QR)
        const billId = store?.currentBillId || 1;

        const request = {
            billId: billId,
            orderType: 'AT_TABLE' as const,
            items: cart.map(i => ({
                itemId: i.id,
                quantity: i.quantity,
                notes: ""
            }))
        };

        try {
            setLoading(true);
            await customerApi.createOrder(request);
            setCart([]);
            setIsReviewOpen(false); // Đóng modal review sau khi đặt thành công
            alert("Đặt món thành công! Vui lòng chờ nhà bếp xác nhận.");
            setActiveTab('STATUS');
        } catch (error: any) {
            console.error("Lỗi đặt món:", error);
            alert(error.response?.data?.message || "Không thể gửi đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC AI ---
    const askAI = async () => {
        if (!query.trim()) return;
        setLoadingAI(true);
        try {
            const res = await getAIFoodSuggestions(query, menu);
            setAiResponse(res || "Culina AI chưa tìm thấy gợi ý phù hợp.");
        } catch (e) {
            setAiResponse("Lỗi kết nối với trí tuệ nhân tạo.");
        } finally {
            setLoadingAI(false);
        }
    };

    // Trả về tất cả dữ liệu và hàm cần thiết cho UI
    return {
        activeTab,
        setActiveTab,
        menu,
        loading,
        cart,
        addToCart,
        updateCartQty,
        cartTotal: cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
        
        // Modal states
        isReviewOpen,
        setIsReviewOpen,
        selectedItem,
        setSelectedItem,
        
        // Actions
        handlePlaceOrder,
        ai: { 
            query, 
            setQuery, 
            response: aiResponse, 
            setResponse: setAiResponse, 
            loading: loadingAI, 
            askAI 
        }
    };
};