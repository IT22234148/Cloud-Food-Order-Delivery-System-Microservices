import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;
