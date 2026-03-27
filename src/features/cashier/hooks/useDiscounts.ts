import { useState } from 'react';
import { discountApi } from '../services/discountApi';
import { toast } from 'react-hot-toast';

export interface Discount {
  id: number;
  name: string;
  description: string;
  discountType: string;
  valueType: string;
  value: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  minPartySize: number | null;
  maxPartySize: number | null;
  tierConfig: string | null;
  applicableDays: string | null;
  applyToSpecificItems: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  calculatedAmount: number | null;
}

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActiveDiscounts = async () => {
    setLoading(true);
    try {
      const res = await discountApi.getActiveDiscounts();
      setDiscounts(res.data || []);
    } catch (e) {
      toast.error('Failed to load discounts');
    } finally {
      setLoading(false);
    }
  };

  const applyDiscount = async (billId: number, discountId: number) => {
    console.log('[APPLY DISCOUNT]', { billId, discountId });
    setLoading(true);
    try {
      await discountApi.applyDiscountToBill(billId, discountId);
      toast.success('Discount applied!');
      return true;
    } catch (e) {
      toast.error('Failed to apply discount');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { discounts, loading, fetchActiveDiscounts, applyDiscount };
};