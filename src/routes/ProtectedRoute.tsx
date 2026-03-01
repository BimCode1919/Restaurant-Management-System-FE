import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Chuyển role về Uppercase để so sánh chính xác với BE
  const userRole = user.role?.toUpperCase(); 
  const formattedAllowedRoles = allowedRoles.map(role => role.toUpperCase());

  if (!formattedAllowedRoles.includes(userRole)) {
    console.warn(`Access Denied. User role: ${userRole}, Required: ${formattedAllowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;