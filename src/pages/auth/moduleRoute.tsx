import { isRole } from "@/services/service";
import { Navigate } from "react-router-dom";

export const ModuleRoute = ({children, requireRoles}:any) => {  
     // user is not authenticated
    return !isRole(requireRoles)
    ? children
    : <Navigate to="/500" replace  />;
  
};
export default ModuleRoute


  
