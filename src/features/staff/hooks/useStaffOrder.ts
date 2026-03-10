// src/features/staff/hooks/useStaffOrder.ts
import { useState, useCallback, useMemo } from 'react';
import { staffApi } from '../services/staffApi';
import {
  TableResponse, ItemResponse, OrderType,
  TableStatus, ApiResponse, BillResponse, ItemStatus
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

  const cancelOrderItem = useCallback(async (orderDetailId: number) => {
    setLoading(true);
    try {
      // Gửi trực tiếp enum string "CANCELLED" cho backend
      await staffApi.updateItemStatus(orderDetailId, ItemStatus.CANCELLED);

      // Sau khi hủy xong, load lại dữ liệu để cập nhật UI
      await refreshData();
      return { success: true };
    } catch (error: any) {
      console.error("Cancel item failed", error);
      alert(error.response?.data?.message || "Failed to cancel item");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  const fetchFullBillDetails = useCallback(async (billId: number) => {
    setLoading(true);
    try {
      const response = await staffApi.getOrdersByBill(billId);
      return response.data; // Trả về OrderResponse[]
    } catch (error) {
      console.error("Failed to fetch bill details:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const massUpdateOrderStatus = useCallback(async (orderId: number) => {
    setLoading(true);
    try {
      const response = await staffApi.massUpdateOrderStatus(orderId);
      await refreshData(); // Refresh lại trạng thái bàn sau khi cập nhật thành công
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Mass update failed", error);
      alert(error.response?.data?.message || "Failed to send order to kitchen");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  // Quan trọng: Bọc actions trong useMemo để tránh re-render loop
  const actions = useMemo(() => ({
    setIsOrdering,
    setOrderStep,
    setSelectedTable,
    setPartySize,
    setCart,
    refreshData,
    finalizeOrder,
    resetOrderFlow,
    cancelOrderItem,
    fetchFullBillDetails,
    massUpdateOrderStatus
  }), [refreshData, finalizeOrder, resetOrderFlow, massUpdateOrderStatus]);

  return {
    state: { tables, menu, isOrdering, orderStep, selectedTable, partySize, cart, loading },
    actions
  };
};