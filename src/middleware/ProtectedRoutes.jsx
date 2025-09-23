import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../common/store/authStore";
import validToken from "./validToken";
import useNotification from "../hooks/useNotifications";
import { useEffect } from "react";

export const ProtectedRoute = ({ isAllowed, children, redirectTo = "/" }) => {
  const location = useLocation()
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { logout, token } = useAuthStore();

  const handleLogout = async () => {
    const isValidToken = await validToken(token);
    /* if ((!isAllowed || !isValidToken) && location.pathname !== "/") {
      logout();
      notify("Su sesión expiró. Por favor inicie de nuevo!", "error");
      navigate(redirectTo);
    } */
  };

  useEffect(() => {
    handleLogout();
  }, [isAllowed, logout, navigate, redirectTo, token]);

  return isAllowed ? (children ? children : <Outlet />) : <Navigate to={redirectTo} />;
};
