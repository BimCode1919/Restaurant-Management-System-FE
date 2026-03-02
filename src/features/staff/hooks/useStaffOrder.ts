// src/features/staff/hooks/useStaffOrder.ts
import { useState, useCallback, useMemo } from 'react';
import { staffApi } from '../services/staffApi';
import { 
  TableResponse, ItemResponse, OrderType, 
  TableStatus, ApiResponse, BillResponse 
} from '../types';

export const useStaffOrder = () => {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [menu, setMenu] = useState<ItemResponse[]>([]);

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStep, setOrderStep] = useState<'TABLE' | 'PARTY_SIZE' | 'MENU'>('TABLE');
  const [selectedTable, setSelectedTable] = useState<TableResponse | null>(null);
  const [partySize, setPartySize] = useState<number>(1);
  const [cart, setCart] = useState<any[]>([]);

  const refreshData = useCallback(async () => {
    // Không set loading liên tục nếu là polling ngầm để tránh giật lag UI
    try {
      const [tableRes, menuRes] = await Promise.all([
        staffApi.getTables(),
        staffApi.getAvailableItems()
      ]);

      if (tableRes.data) setTables(tableRes.data as TableResponse[]);
      if (menuRes.data) setMenu(menuRes.data as ItemResponse[]);
    } catch (error) {
      console.error("Fetch data failed", error);
    }
  }, []);

  const resetOrderFlow = useCallback(() => {
    setIsOrdering(false);
    setOrderStep('TABLE');
    setSelectedTable(null);
    setPartySize(1);
    setCart([]);
  }, []);

  const finalizeOrder = useCallback(async () => {
    if (!selectedTable) return;
    setLoading(true);
    try {
      let activeBillId: number | undefined;

      if (selectedTable.status === TableStatus.AVAILABLE) {
        const billRes = (await staffApi.createBill({
          tableIds: [selectedTable.id],
          partySize: partySize
        })) as ApiResponse<BillResponse>;
        activeBillId = billRes.data.id;
      } else {
        // Lấy bill ID từ dữ liệu bàn có sẵn (Backend trả về currentBillId)
        activeBillId = (selectedTable as any).currentBillId || (selectedTable as any).currentBill?.id; 
      }

      if (!activeBillId) throw new Error("Could not find or create a Bill.");

      await staffApi.createOrder({
        billId: activeBillId,
        orderType: OrderType.AT_TABLE,
        items: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          notes: item.note || ""
        }))
      });

      resetOrderFlow();
      await refreshData();
      return { success: true };
    } catch (error: any) {
      alert(error.response?.data?.message || "Order failed!");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedTable, partySize, cart, refreshData, resetOrderFlow]);

  // Quan trọng: Bọc actions trong useMemo để tránh re-render loop
  const actions = useMemo(() => ({
    setIsOrdering,
    setOrderStep,
    setSelectedTable,
    setPartySize,
    setCart,
    refreshData,
    finalizeOrder,
    resetOrderFlow
  }), [refreshData, finalizeOrder, resetOrderFlow]);

  return {
    state: { tables, menu, isOrdering, orderStep, selectedTable, partySize, cart, loading },
    actions
  };
};