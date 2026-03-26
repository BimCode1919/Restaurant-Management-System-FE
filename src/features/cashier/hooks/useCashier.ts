import { useState, useCallback } from 'react';
import { cashierApi } from '../services/cashierApi';
import { BillResponse, PaymentMethod, MergeBillRequest } from '../types';
import { toast } from 'react-hot-toast';

export const useCashier = () => {
  const [bill, setBill] = useState<BillResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Tải dữ liệu hóa đơn (Giữ nguyên)
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

  // 2. Áp dụng mã giảm giá (Giữ nguyên)
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

  // 3. Xử lý thanh toán (Giữ nguyên)
  const processCheckout = async (method: PaymentMethod) => {
    if (!bill) return;
    setLoading(true);
    if (method === PaymentMethod.CASH) {
        toast.success("Payment completed!");
        setBill(null); // Gán null để Sidebar đóng lại
      }
    
    setLoading(true);
    try {
      const request = {
        billId: bill.id,
        paymentMethod: method,
        returnUrl: `${window.location.origin}/cashier/payment-callback`
      };
      const payment = await cashierApi.createPayment(request);
      if (method === PaymentMethod.CASH) {
        toast.success("Payment completed with Cash!");
        setBill(prev => prev ? { ...prev, status: 'PAID' as any } : null);
      } else if (method === PaymentMethod.MOMO && payment.paymentUrl) {
        toast.loading("Redirecting to MoMo...");
        window.location.href = payment.paymentUrl;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 4. XỬ LÝ GỘP BILL
   * Nhận vào mảng billIds để tiến hành gộp
   */
  const handleMergeBills = async (billIds: number[]) => {
    if (billIds.length < 2) {
      toast.error("Select at least 2 tables to merge");
      return;
    }

    setLoading(true);
    try {
      const request: MergeBillRequest = { billIds };
      const res = await cashierApi.mergeBills(request);

      // Sau khi gộp thành công, cập nhật bill đang hiển thị là Bill mới gộp
      setBill(res.data);
      toast.success("Bills merged successfully!");
      return res.data; // Trả về data để UI có thể xử lý thêm nếu cần
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Merge failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUnmergeBill = async (billId: number) => {
    if (!billId) {
      toast.error("No bill selected to unmerge");
      return;
    }

    setLoading(true);
    try {
      const res = await cashierApi.unmergeBill(billId);
      toast.success("Bill unmerged successfully!");

      if (res.data) {
        // API có thể trả về bảng đã khôi phục, lấy bảng đầu tiên nếu là array hoặc object
        const restored = Array.isArray(res.data) ? res.data[0] : res.data;
        setBill(restored as any);
      }

      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unmerge failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    bill,
    setBill,
    setLoading,
    loading,
    loadBill,
    handleApplyDiscount,
    processCheckout,
    handleMergeBills,
    handleUnmergeBill
  };
};