import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './dataTable'
import { columns } from './columns'
import { WorkOrder } from '../components/schema'
import { getProduction, searchProduction } from '@/services/workOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconChecklist } from '@tabler/icons-react'

export default function Productions() {  
  const [data, setData] = useState<WorkOrder[]>([]) 
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log("Get Productions data");    
    getProduction().then((data) => setData(data))
    setRefresh(false)
  }  

  const queryData = (str:any) => {
    setData([])
    if(str == ''){
      getData(); 
    } else{
      searchProduction(str).then((data) => setData(data))
    }    
  }

  useEffect(() => {  
    getData();      
  }, [refresh])   

  
  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
       
        <PageHeader
          label='Production'
          icon={<IconChecklist size={45} className='mt-2 ' />}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
        
          <DataTable data={data} columns={columns} queryData={(e) => queryData(e)}/>
            
        </div>
      </LayoutBody>
    </Layout>
  )
}
