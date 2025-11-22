import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logger } from '../../../utils/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user came from home screen (has navigation state)
    const isAuthorized = location.state?.fromHome === true;

    if (!isAuthorized) {
      // Redirect to home if trying to access chat directly
      logger.debug('[ProtectedRoute] Unauthorized access to /chat, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  // Only render children if authorized
  const isAuthorized = location.state?.fromHome === true;
  
  return isAuthorized ? <>{children}</> : null;
};
