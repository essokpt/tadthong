import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { PurchaseOrder } from '../components/schema'
import { getPurchaseOrderApprove, searchPurchaseOrderApproved } from '@/services/purchaseOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconFileCheck } from '@tabler/icons-react'

export default function ApprovePurchaseOrder() {  
  const [data, setData] = useState<PurchaseOrder[]>([]) 
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log("Get Vender data");    
    getPurchaseOrderApprove().then((data) => setData(data))
    setRefresh(false)
  }
  const queryData = (str:any) => {
    setData([])
    if(str == ''){
      getData(); 
    } else{
      searchPurchaseOrderApproved(str).then((data) => setData(data))
    }    
  }


  useEffect(() => {  
    getData();  
    
  }, [refresh])   

 
  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
       
        <PageHeader
          label='Approve Purchase Order'
          icon={<IconFileCheck size={45} className='mt-2 ' />}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
        
          <DataTable data={data} columns={columns} queryData={(e) => queryData(e)}/>
             
        </div>
      </LayoutBody>
    </Layout>
  )
}
