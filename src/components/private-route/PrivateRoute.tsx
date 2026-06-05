import { useAppSelector } from "@/hooks/store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;