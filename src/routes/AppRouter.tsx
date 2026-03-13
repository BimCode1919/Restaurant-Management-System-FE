import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../features/auth/pages/Login'
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import CustomerPage from '../features/customer/pages/CustomerMenu';
import StaffDashboard from '../features/staff/pages/StaffDashboard';
import { Toaster } from 'react-hot-toast';
import CheckoutView from '../features/cashier/pages/CheckoutView';
import PaymentCallback from '../features/cashier/pages/PaymentCallback';
import GuestLanding from '../features/auth/pages/GuestLanding';
import { getGuestInfo } from '../features/customer/jwtUtils';
import KitchenPage from '../features/kitchen/pages/KitchenPage';
import WelcomePage from '../features/customer/pages/WelcomePage';
import ReservationFlow from '../features/customer/pages/ReservationFlow';
import PaymentCallbackCustomer from '../features/customer/pages/PaymentCallback';

// Import tạm các Page (Bạn sẽ thay thế bằng code của bạn)
const Unauthorized = () => <div>Where ur permission?</div>;

const AppRouter = () => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const guestInfo = getGuestInfo();

  // Tạo một object store giả lập hoặc lấy hàm logout từ context/service
  const mockStore = {
    tableNumber: guestInfo?.tableNumber || "N/A",
    tableId: guestInfo?.tableId,
    orders: [], // Bạn sẽ thay thế bằng logic lấy orders thật từ API hoặc context
    user: user?.info || {},
    logout: () => {
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
  };

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={true}
        gutter={12}
        containerStyle={{ zIndex: 99999, top: 40, right: 40 }}
        toastOptions={{
          style: {
            borderRadius: '1.5rem', // Bo tròn lớn giống card bàn
            background: '#ffffff',
            color: '#333',
            border: '1px solid #f3f4f6',
            boxShadow: '0 25px 50px -12px rgba(128, 0, 32, 0.15)', // Shadow hơi đỏ burgundy nhẹ
            padding: '0px', // Để custom nội dung bên trong trán viền
            maxWidth: '400px'
          },
        }}
      />
      <Routes>
        {/* welcome page */}
        <Route path="/" element={<WelcomePage />} />

        {/* Reservation */}
        <Route path="/reservation-flow" element={<ReservationFlow />} />
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/customer" element={<CustomerPage store={mockStore} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/session/:qrCode" element={<GuestLanding />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />

        {/* Private Routes: Admin & Manager */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
          <Route path="/admin" element={<AdminDashboard store={mockStore} />} />
        </Route>

        {/* Private Routes: Kitchen */}
        <Route element={<ProtectedRoute allowedRoles={['CHEF', 'ADMIN']} />}>
          <Route path="/kitchen" element={<KitchenPage store={mockStore} />} />
        </Route>

        {/* Private Routes: Staff */}
        <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
          <Route path="/staff" element={<StaffDashboard />} />
        </Route>

        {/* Private Routes: Cashier & Payment Handling */}
        <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'CASHIER']} />}>
          {/* Dashboard chính của Thu ngân */}
          <Route path="/cashier" element={<CheckoutView />} />

          {/* Route nhận kết quả trả về từ cổng thanh toán MoMo */}
          <Route path="/cashier/payment-callback" element={<PaymentCallback />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/WelcomePage" replace />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;