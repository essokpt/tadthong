import { useNavigate } from 'react-router-dom'
import { siteConfig } from '../../../config/site'
import { Button } from '@/components/custom/button'
//import { Icons } from "@/components/ui/icons"
import { MainNav } from '@/components/layouts/main-nav'
import ThemeSwitch from './theme-switch'
import { IconLogout, IconUserPentagon } from '@tabler/icons-react'

export function SiteHeader() {
  const navigate = useNavigate()

  function logout() {
    console.log('logout')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('branchId')
    localStorage.removeItem('role')
    localStorage.removeItem('permisstions')
    localStorage.removeItem('permisstionRole')
    localStorage.removeItem('accessPermissions')

    navigate('/login', { replace: true })
  }

  return (
    <header className='topheader fixed top-0 z-40 w-full border-b bg-primary text-white dark:bg-background'>
      <div className='container flex h-16 items-center space-x-2 sm:justify-between sm:space-x-0'>
        <MainNav items={siteConfig.mainNav} />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-1'>
            <ThemeSwitch />

            <Button
              size='icon'
              variant='ghost'
              className='rounded-full'
              onClick={() => logout()}
            >
              <IconLogout size={25} />
            </Button>

            <Button
              size='icon'
              variant='ghost'
              className='rounded-full'
              onClick={() => navigate('/user/profile', { replace: true })}
            >
              <IconUserPentagon size={25} />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
