import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { Bom } from './components/schema'
import { getBom, searchBom } from '@/services/bomApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconTestPipe } from '@tabler/icons-react'

export default function Boms() {  
  const [data, setData] = useState<Bom[]>([]) 
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log("Get bom data");    
    getBom().then((data) => setData(data))
    setRefresh(false)
  }

  const queryData = (str:any) => {
    setData([])
    if(str == ''){
      getData(); 
    } else{
      searchBom(str).then((data) => setData(data))
    }    
  }
 
 useEffect(() => {  
    getData();  
    
  }, [refresh])   
   

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
      <PageHeader
          label='Boms'
          icon={<IconTestPipe size={45} className='mt-2 ' />}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
        
          <DataTable data={data} columns={columns} queryData={(e) => queryData(e)}/>
             
        </div>
      </LayoutBody>
    </Layout>
  )
}
