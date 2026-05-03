import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// redirects users who should not see a page
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="container py-5">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
