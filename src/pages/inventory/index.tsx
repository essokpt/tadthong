import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './stock/dataTable'
import { columns } from './stock/columns'
import { getOnHandStock } from '@/services/inventoryApi'
import { StockOnhand } from './stock/schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

export default function Overview() {  
  const [data, setData] = useState<StockOnhand[]>([]) 
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log("Get STOCK data");    
    getOnHandStock().then((data) => setData(data))
    setRefresh(false)
  }
  const queryData = (str:any) => {
    setData([])
    if(str == ''){
      getData(); 
    } 
     
  }

  useEffect(() => {  
    getData();  
    
  }, [refresh])   

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Inventory</h2>
            {/* <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p> */}
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
        
          <DataTable data={data} columns={columns}  queryData={(e) => queryData(e)} />
             
        </div>
      </LayoutBody>
    </Layout>
  )
}
