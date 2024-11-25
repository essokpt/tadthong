import { Outlet, Navigate, useLocation } from "react-router-dom";


export const AutenticateRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  if (token === undefined) {
    return null; // or loading indicator/spinner/etc
  }
    // user is not authenticated
    return token 
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;

  
};
export default AutenticateRoute