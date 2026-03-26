import axiosClient from '../../../api/axiosClient'; // Path to your config file
import {
    ApiResponse,
    BillResponse,
    PaymentResponse,
    CreatePaymentRequest,
    MergeBillRequest,
    TableResponse
} from '../types';

export const cashierApi = {
    /**
     * Get detailed information of a bill
     * @GetMapping("/bills/{id}")
     */
    getBillDetails: (billId: number): Promise<ApiResponse<BillResponse>> => {
        return axiosClient.get(`/bills/${billId}`);
    },

    /**
     * Automatically apply the best discount code for the bill
     * @PostMapping("/bills/{id}/apply-best-discount")
     */
    applyBestDiscount: (billId: number): Promise<ApiResponse<BillResponse>> => {
        return axiosClient.post(`/bills/${billId}/apply-best-discount`);
    },

    /**
     * Create payment request (Cash or MoMo)
     * @PostMapping("/payments")
     * Note: Result returns PaymentResponse directly according to your Controller structure
     */
    createPayment: (request: CreatePaymentRequest): Promise<PaymentResponse> => {
        // Because Controller returns PaymentResponse directly (not wrapped in ApiResponse)
        // and axiosClient already returns response.data, so we get the correct object here.
        return axiosClient.post('/payments', request);
    },

    mergeBills: (request: MergeBillRequest): Promise<ApiResponse<BillResponse>> => {
        return axiosClient.post('/bills/merge', request);
    },

    unmergeBill: (billId: number): Promise<ApiResponse<BillResponse>> => {
        // API path from swagger: DELETE /bills/unmerge with body { billId }
        return axiosClient.delete('/bills/unmerge', { data: { billId } });
    },

    getAllTables: (): Promise<ApiResponse<TableResponse[]>> => {
        return axiosClient.get('/tables');
    },
    
    // Add this function to cashierApi
    checkPaymentStatus: (paymentId: number): Promise<PaymentResponse> => {
        return axiosClient.get(`/payments/${paymentId}/status`);
    },
};