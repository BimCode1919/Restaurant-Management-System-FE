import { jwtDecode } from 'jwt-decode';

export const getGuestInfo = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    const { token } = JSON.parse(userData);
    try {
        // Decode token để lấy claims (tableId, tableNumber từ BE gửi về)
        const decoded: any = jwtDecode(token);
        return {
            tableId: decoded.tableId,
            tableNumber: decoded.tableNumber,
            // Nếu BE trả về billId hiện tại của bàn trong token thì lấy luôn
            currentBillId: decoded.currentBillId 
        };
    } catch (e) {
        return null;
    }
};