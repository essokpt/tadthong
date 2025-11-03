/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { SaleOrder } from './components/schema'
import { getSaleOrder, searchSaleOrder } from '@/services/saleOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconListDetails } from '@tabler/icons-react'
import { isValidDate } from '@/lib/utils'
import SaleOrderProvider from './context/so-context'

export default function SaleOrders() {
  const [data, setData] = useState<SaleOrder[]>([])
 // const { setCountRow } = useSaleOrder();
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log('Get SaleOrders data')
    getSaleOrder().then((data) => setData(data))
   // setCountRow(data.length || 0)
    setRefresh(false)
  }

  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData()
    } else {
     // console.log('search:', str);
      if(isValidDate(str)) {
        const dateParts = str.split("-");
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        console.log('Formatted Date:', formattedDate);
        searchSaleOrder(formattedDate).then((data) => setData(data))
        
      }else{
        searchSaleOrder(str).then((data) => setData(data))
      }
    
    }
  }

  useEffect(() => {
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <SaleOrderProvider>
        <PageHeader
          label='Sale Orders'
          icon={<IconListDetails size={45} className='mt-2 ' />}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={data}
            columns={columns}
            queryData={(e) => queryData(e)}
          />
        </div>
        </SaleOrderProvider>
      </LayoutBody>
    </Layout>
  )
}
