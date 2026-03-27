import axiosClient from '../../../api/axiosClient';

export const discountApi = {
  getActiveDiscounts: () => {
    return axiosClient.get('/discounts/active');
  },
  applyDiscountToBill: (billId, discountId) => {
    return axiosClient.post(`/discounts/apply/${billId}/${discountId}`);
  },
};
