import { useState, useCallback } from 'react';
import { cashierApi } from '../services/cashierApi';
import { BillResponse, PaymentMethod, PaymentStatus } from '../types';
import { toast } from 'react-hot-toast';

export const useCashier = () => {
  const [bill, setBill] = useState<BillResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Tải dữ liệu hóa đơn
  const loadBill = useCallback(async (billId: number) => {
    setLoading(true);
    try {
      const res = await cashierApi.getBillDetails(billId);
      setBill(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load bill");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Áp dụng mã giảm giá
  const handleApplyDiscount = async () => {
    if (!bill) return;
    setLoading(true);
    try {
      const res = await cashierApi.applyBestDiscount(bill.id);
      setBill(res.data);
      toast.success("Best discount applied!");
    } catch (error: any) {
      toast.error("Could not apply discount");
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý thanh toán
  const processCheckout = async (method: PaymentMethod) => {
    if (!bill) return;
    
    setLoading(true);
    try {
      const request = {
        billId: bill.id,
        paymentMethod: method,
        // URL để MoMo quay lại sau khi thanh toán xong
        returnUrl: `${window.location.origin}/cashier/payment-callback` 
      };

      const payment = await cashierApi.createPayment(request);

      if (method === PaymentMethod.CASH) {
        toast.success("Payment completed with Cash!");
        // Cập nhật local state hoặc redirect
        setBill(prev => prev ? { ...prev, status: 'PAID' as any } : null);
      } else if (method === PaymentMethod.MOMO && payment.paymentUrl) {
        toast.loading("Redirecting to MoMo...");
        // Chuyển hướng sang trang thanh toán của MoMo
        window.location.href = payment.paymentUrl;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    bill,
    loading,
    loadBill,
    handleApplyDiscount,
    processCheckout
  };
};