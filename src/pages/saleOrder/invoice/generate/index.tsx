import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './dataTable'
import { columns } from './columns'
import { saleOrderItems } from './schema'
import { getSaleOrderItems, searchSaleOrderItems } from '@/services/saleOrderApi'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

export default function GenerateInvoice() {  
  const [data, setData] = useState<saleOrderItems[]>([]) 
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log('Get Invoices data')
    getSaleOrderItems().then((data) => setData(data))
    setRefresh(false)
  }

  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData()
    } else {
      searchSaleOrderItems(str).then((data) => setData(data))
    }
  }

  useEffect(() => {  
    getData()
  }, [refresh])   

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
       
        <PageHeader
          label='Generate Invoice'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
        
          <DataTable data={data} columns={columns}  queryData={(e) => queryData(e)}/>
             
        </div>
      </LayoutBody>
    </Layout>
  )
}
