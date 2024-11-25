import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { Supplier } from './components/schema'
import { getSupplier } from '@/services/supplierApi'
//import { useGetCustomer } from '@/hooks/useCustomer'

export default function Venders() {
  const [data, setData] = useState<Supplier[]>([])
  useEffect(() => {
    getSupplier().then((data) => setData(data))
  }, [])  

  //const { data, isLoading, isError } = useGetCustomer()
  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Supplier</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
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
