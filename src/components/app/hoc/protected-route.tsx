import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { Path } from '../../../constants/path';

interface ProtectedRouteProps {
  onlyForUnauth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyForUnauth = false,
  children
}) => {
  const isAuthenticated = false;
  const location = useLocation();

  if (onlyForUnauth && isAuthenticated) {
    const from = location.state?.from || { pathname: Path.home };
    return <Navigate to={from} replace />;
  }

  if (!onlyForUnauth && !isAuthenticated) {
    return <Navigate to={Path.login} state={{ from: location }} replace />;
  }

  return children;
};
