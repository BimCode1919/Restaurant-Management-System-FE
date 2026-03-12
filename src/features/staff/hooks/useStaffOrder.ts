// src/features/staff/hooks/useStaffOrder.ts
import { useState, useCallback, useMemo } from 'react';
import { staffApi } from '../services/staffApi';
import {
  TableResponse, ItemResponse, OrderType,
  TableStatus, ApiResponse, BillResponse, ItemStatus,
  ReservationResponse,
  CreateBillRequest
} from '../types';
import toast from 'react-hot-toast';

export const useStaffOrder = () => {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [menu, setMenu] = useState<ItemResponse[]>([]);

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStep, setOrderStep] = useState<'TABLE' | 'PARTY_SIZE' | 'MENU'>('TABLE');
  const [selectedTable, setSelectedTable] = useState<TableResponse | null>(null);
  const [partySize, setPartySize] = useState<number>(1);
  const [cart, setCart] = useState<any[]>([]);
  const [reservationDetail, setReservationDetail] = useState<ReservationResponse | null>(null);

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

  const finalizeOrder = useCallback(async (explicitMergedIds?: number[]) => {
    if (!selectedTable) return;
    setLoading(true);

    try {
      let activeBillId: number | undefined;

      if (selectedTable.status === TableStatus.AVAILABLE) {
        // Ưu tiên: 1. Tham số truyền vào -> 2. mergedIds đính kèm trong bàn -> 3. ID của chính bàn đó
        const rawIds = explicitMergedIds || (selectedTable as any).mergedIds || [selectedTable.id];

        // Làm sạch dữ liệu: Đảm bảo là mảng các số nguyên (Long trong Java)
        const tableIdsToSend = Array.isArray(rawIds)
          ? rawIds.map(id => Number(id))
          : [Number(selectedTable.id)];

        const billPayload: CreateBillRequest = {
          tableIds: tableIdsToSend,
          partySize: Number(partySize),
          reservationId: (selectedTable as any).reservationId || null
        };

        const billRes = await staffApi.createBill(billPayload);
        activeBillId = billRes.data?.id;
      } else {
        activeBillId = (selectedTable as any).currentBillId || selectedTable.currentBill?.id;
      }

      if (!activeBillId) throw new Error("Could not initialize Bill ID.");

      // Tạo Order
      await staffApi.createOrder({
        billId: activeBillId,
        orderType: OrderType.AT_TABLE,
        items: cart.map(item => ({
          itemId: Number(item.id),
          quantity: item.quantity,
          notes: item.note || ""
        }))
      });

      toast.success("Order sent to kitchen!");
      resetOrderFlow();
      await refreshData();
      return { success: true };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Order processing failed";
      toast.error(msg);
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

  const fetchReservationByTable = useCallback(async (table: TableResponse) => {
    const reservationId = table.currentBill?.reservationId;
    if (!reservationId) return null;

    setLoading(true);
    try {
      // Gọi API - giả sử nó trả về ApiResponse<ReservationResponse>
      const response = await staffApi.getReservationDetail(reservationId);

      // Bóc tách dữ liệu thực sự (Trường data trong ApiResponse)
      // Dùng ép kiểu 'as any' hoặc ép về đúng type nếu API trả về bọc trong object
      const actualData = (response as any).data || response;

      if (actualData) {
        setReservationDetail(actualData as ReservationResponse);
        return actualData as ReservationResponse;
      }

      return null;
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load reservation details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReservationAction = useCallback(async (type: 'CONFIRM' | 'CHECK_IN' | 'CANCEL' | 'NO_SHOW', id: number, extra?: any) => {
    setLoading(true);
    try {
      if (type === 'CONFIRM') await staffApi.confirmReservation(id);
      if (type === 'CHECK_IN') await staffApi.checkInReservation(id, extra.billId);
      if (type === 'CANCEL') await staffApi.cancelReservation(id, extra?.reason || "No reason provided");
      if (type === 'NO_SHOW') await staffApi.markNoShow(id, extra?.reason || "Customer did not arrive");

      toast.success(`${type} successful`);
      await refreshData();
      return { success: true };
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
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
    massUpdateOrderStatus,
    fetchReservationByTable,
    handleReservationAction,
    setReservationDetail
  }), [refreshData, finalizeOrder, resetOrderFlow, massUpdateOrderStatus]);

  return {
    state: { tables, menu, isOrdering, orderStep, selectedTable, partySize, cart, loading, reservationDetail },
    actions
  };
};