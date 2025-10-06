import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="one">
        <div className="two"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}