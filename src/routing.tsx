import { createBrowserRouter, Route , createRoutesFromElements } from "react-router-dom";
//import SignIn2 from "./pages/auth/sign-in-2";
import Dashboard from "./pages/dashboard";
import AppShell from "./components/layouts/app-shell";
import GeneralError from "./pages/errors/general-error";
import AutenticateRoute from "./pages/auth/autenticateRoute";
import ResetPassword from "./pages/auth/reset-password";
import masterRoute from "./route/masterRoute";
import ModuleRoute from "./pages/auth/moduleRoute";
import Tasks from "./pages/tasks";
import SignIn from "./pages/auth/sign-in";
import ForgotPassword from "./pages/auth/forgot-password";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      
        <Route element={ <AutenticateRoute/>} >
          <Route 
            element={<AppShell/>}
            errorElement={<GeneralError/>}
          >           
           
            <Route path="/" element={<Dashboard />} />          
              {masterRoute.map((route: any, index: number) => (
                <Route
                  key={index}
                  index={route.index}
                  path={route.path}
                  element={  
                    //  <route.element />
                    <ModuleRoute requireRoles={route.requireRoles}>
                      <route.element />
                    </ModuleRoute>
                  }
                />
              ))}            
              <Route path="/tasks" element={<Tasks />} />    
            <Route path="*" element={<GeneralError/>} />
          </Route>
        </Route> 

        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/500" element={<GeneralError />} />
     
      </>
    )
  );