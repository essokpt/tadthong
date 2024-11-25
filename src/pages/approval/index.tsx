import { Layout, LayoutBody } from '@/components/custom/layout'
import { getApproveMaterial } from '@/services/approveMaterialApi'
import { ApproveMaterialType } from './components/type'
import { useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'

export default function Approval() {  
 const [data, setData] = useState<ApproveMaterialType[]>([]) 
  useEffect(() => {  
    getApproveMaterial().then((data) => setData(data))
  }, [])   

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Approval</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your items for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
        
          <DataTable data={data} columns={columns} />
             
        </div>
      </LayoutBody>
    </Layout>
  )
}
