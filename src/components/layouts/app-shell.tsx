import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { SiteHeader } from './site-header'
import { ApiProvider } from './api-context'

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <SiteHeader />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-72'} h-full`}
      >
        <div className='col-span-3 mt-12 py-8 lg:col-span-4 lg:border-l '>
          <ApiProvider>
            <Outlet />
          </ApiProvider>
        </div>
      </main>
    </div>
  )
}
