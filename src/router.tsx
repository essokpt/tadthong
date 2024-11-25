import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
//import AutenticateRoute from './pages/auth/autenticateRoute'

const router = createBrowserRouter([
 
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/login',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  // {
  //   path: '/sign-up',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-up')).default,
  //   }),
  // },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },

  // Main routes
  {
    path: '/',  
    // element: <AutenticateRoute/>, 
    lazy: async () => {
      const AppShell = await import('./components/layouts/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
   
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'tasks',
        lazy: async () => ({
          Component: (await import('./pages/tasks')).default,
        }),
      },
      {
        path: 'chats',
        lazy: async () => ({
          Component: (await import('@/components/layouts/coming-soon')).default,
        }),
      },
      {
        path: 'users',       
        lazy: async () => ({
          Component: (await import('@/components/layouts/coming-soon')).default,
        }),
      },
      {
        path: 'analysis',
        lazy: async () => ({
          Component: (await import('@/components/layouts/coming-soon')).default,
        }),
      },
      {
        path: 'extra-components',
        lazy: async () => ({
          Component: (await import('@/pages/extra-components')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },
      //Master management
      {
        path: 'master',
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/master/user')).default,
            }),
          },
          {
            path: 'user',
            lazy: async () => ({
              Component: (await import('./pages/master/user')).default,
            }),
          },
          {
            path: 'customer',
            lazy: async () => ({
              Component: (await import('./pages/master/customer')).default,
            }),
          },  
          {
            path: 'vender',
            lazy: async () => ({
              Component: (await import('./pages/master/vender')).default,
            }),
          },            
          {
            path: 'supplier',
            lazy: async () => ({
              Component: (await import('./pages/master/supplier'))
                .default,
            }),
          },
          {
            path: 'role',
            lazy: async () => ({
              Component: (await import('./pages/master/role')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },
    ],
  
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
