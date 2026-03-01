import { useState, useMemo } from 'react';
import { Order, OrderStatus, MenuItem, OrderItem } from '../types';

export const useStaffOrder = (store: any) => {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStep, setOrderStep] = useState<'TABLE' | 'MENU'>('TABLE');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (!store?.orders) return [];
    return store.orders.filter((o: Order) => {
      if (o.status === 'SERVED' || o.status === 'CANCELLED') return false;
      const matchesSearch = o.tableId.includes(search) || o.id.includes(search);
      const matchesFilter = filter === 'ALL' || o.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [store.orders, search, filter]);

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: Math.random().toString(),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        note: ""
      }];
    });
  };

  const finalizeOrder = () => {
    if (!selectedTable || cart.length === 0) return;
    store.addItemsToOrder(selectedTable, cart);
    resetOrderState();
  };

  const resetOrderState = () => {
    setIsOrdering(false);
    setOrderStep('TABLE');
    setSelectedTable(null);
    setCart([]);
  };

  return {
    state: { filter, search, isOrdering, orderStep, selectedTable, cart, viewingOrder, filteredOrders },
    actions: { 
        setFilter, setSearch, setIsOrdering, setOrderStep, 
        setSelectedTable, setCart, setViewingOrder, 
        handleAddToCart, finalizeOrder, resetOrderState 
    }
  };
};