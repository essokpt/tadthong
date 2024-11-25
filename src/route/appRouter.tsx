import { createBrowserRouter } from 'react-router-dom'
import GeneralError from '../pages/errors/general-error'
import NotFoundError from '../pages/errors/not-found-error'
import MaintenanceError from '../pages/errors/maintenance-error'
import AutenticateRoute from '../pages/auth/autenticateRoute'


const appRouter = createBrowserRouter([
  {
    path: '/login',
    lazy: async () => ({
      Component: (await import('../pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/forgot',
    lazy: async () => ({
      Component: (await import('../pages/auth/forgot-password')).default,
    }),
  },
  // Main routes
  {
    path: '/',  
    element: <AutenticateRoute/>, 
   
    errorElement: <GeneralError />,
    children: [    
     {
      lazy: async () => {
        const AppShell = await import('../components/layouts/app-shell')
        return { Component: AppShell.default }
      },
      errorElement: <GeneralError />,
      children: [
        {
          path: '/',
          lazy: async () => ({
            Component: (await import('../pages/dashboard')).default,
          }),
        },  
    
        //Master management
        {
          path: 'master',
          errorElement: <GeneralError />,
          children: [
            {
              index: true,
              lazy: async () => ({
                Component: (await import('../pages/master/user')).default,
              }),
            },
            {
              path: 'user',
              lazy: async () => ({
                Component: (await import('../pages/master/user')).default,
              }),
             
            },
            {
              path: 'customer',
              lazy: async () => ({
                Component: (await import('../pages/master/customer')).default,
              }),
             
            },  
            {
              path: 'vender',
              lazy: async () => ({
                Component: (await import('../pages/master/vender')).default,
              }),
            },            
            {
              path: 'supplier',
              lazy: async () => ({
                Component: (await import('../pages/master/supplier'))
                  .default,
              }),
            },
            {
              path: 'role',
              lazy: async () => ({
                Component: (await import('../pages/master/role')).default,
              }),
            },        
          ],
        },
      ],
    }
    ]

  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default appRouter
