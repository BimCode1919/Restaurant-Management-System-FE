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

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;