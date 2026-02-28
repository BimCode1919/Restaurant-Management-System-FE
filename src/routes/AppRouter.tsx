import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Import tạm các Page (Bạn sẽ thay thế bằng code của bạn)
const Login = () => <div>Login Page</div>;
const CustomerMenu = () => <div>Customer Menu (Public)</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const KitchenBoard = () => <div>Kitchen Board</div>;
const StaffOrder = () => <div>Staff Order View</div>;
const Unauthorized = () => <div>Bạn không có quyền truy cập!</div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Private Routes: Admin & Manager */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
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