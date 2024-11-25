import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useEffect, useState } from 'react'
import { DataTable } from './dataTable'
import { columns } from './columns'
import { getStockHistory, searchHistory } from '@/services/inventoryApi'
import { StockHistory } from './schema'
import { PageHeader } from '@/components/layouts/header'
import { IconHistoryToggle } from '@tabler/icons-react'

export default function History() {  
  const [data, setData] = useState<StockHistory[]>([]) 

  function getdata(){
    getStockHistory().then((data) => setData(data))
  }
  const queryData = (str:any) => {
    setData([])
    if(str == ''){
      getdata(); 
    } else{
      searchHistory(str).then((data) => setData(data))
    }    
  }

  useEffect(() => {  
    getdata()
  }, [])   

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        
        <PageHeader
          label='History'
          icon={<IconHistoryToggle size={45} className='mt-2 ' />}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
        
          <DataTable data={data} columns={columns} queryData={(e) => queryData(e)} />
             
        </div>
      </LayoutBody>
    </Layout>
  )
}
