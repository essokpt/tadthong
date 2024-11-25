
import { Layout, LayoutHeader, LayoutBody } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { tasks } from './data/tasks'
import { TopNav } from '@/components/layouts/top-nav'
import ThemeSwitch from '@/components/layouts/theme-switch'
import { Search } from '@/components/layouts/search'
import { UserNav } from '@/components/layouts/user-nav'

export default function Tasks() {
  return (  
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={tasks} columns={columns} />
        </div>
      </LayoutBody>
    </Layout>
  )
}

