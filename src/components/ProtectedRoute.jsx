import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any route that requires the user to be logged in.
// If they aren't, they get redirected to /login automatically.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
