import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../features/auth/pages/Login'
import AdminDashboard from '../features/admin/pages/AdminDashboard';

// Import tạm các Page (Bạn sẽ thay thế bằng code của bạn)
const CustomerMenu = () => <div>Customer Menu (Public)</div>;
const KitchenBoard = () => <div>Kitchen Board</div>;
const StaffOrder = () => <div>Staff Order View</div>;
const Unauthorized = () => <div>Bạn không có quyền truy cập!</div>;

const AppRouter = () => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // Tạo một object store giả lập hoặc lấy hàm logout từ context/service
  const mockStore = {
    user: user?.info || {}, // Thông tin user từ BE
    logout: () => {
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
    // Các dữ liệu khác Dashboard cần (nếu chưa chuyển hết sang hook)
    tables: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }], 
    menu: [] 
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Private Routes: Admin & Manager */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
          <Route path="/admin" element={<AdminDashboard store={mockStore} />} />
        </Route>

        {/* Private Routes: Kitchen */}
        <Route element={<ProtectedRoute allowedRoles={['kitchen', 'admin']} />}>
          <Route path="/kitchen" element={<KitchenBoard />} />
        </Route>

        {/* Private Routes: Staff */}
        <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
          <Route path="/staff" element={<StaffOrder />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;