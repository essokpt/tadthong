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

    localStorage.removeItem('accessToken')
    localStorage.removeItem('permisstions')

    navigate('/login', { replace: true })
  }

  return (
    <header className='topheader fixed top-0 z-40 w-full border-b bg-primary text-white dark:bg-background'>
      <div className='container flex h-16 items-center space-x-2 sm:justify-between sm:space-x-0'>
        <MainNav items={siteConfig.mainNav} />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-1'>
            {/* <Link
              to={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link> */}
            {/* <Link
              to={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-4 w-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link> */}
            <ThemeSwitch />
            {/* <Button
              onClick={() => logout()}
            >
              <div className= "flex items-center text-sm font-medium text-muted-foreground"  >             
                <span >Logout</span>
              </div>
            </Button> */}
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
              onClick={ () => navigate('/user/profile', { replace: true })}
              >
              <IconUserPentagon size={25} />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
