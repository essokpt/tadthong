/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './dataTable'
import { columns } from './columns'
import { getInventoryTransfer, searchTransfer } from '@/services/inventoryApi'
import { Transfer } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconTransfer } from '@tabler/icons-react'
import { isValidDate } from '@/lib/utils'

export default function StockTransfer() {
  const [data, setData] = useState<Transfer[]>([])
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log('Get StockTransfer data')
    getInventoryTransfer().then((data) => setData(data))
    setRefresh(false)
  }
  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData()
    } else {
      if (isValidDate(str)) {
        const dateParts = str.split('-')
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        console.log('Formatted Date:', formattedDate)
        searchTransfer(formattedDate).then((data) => setData(data))
      } else {
        searchTransfer(str).then((data) => setData(data))
      }
    }
  }
  useEffect(() => {
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Transfers'
          icon={<IconTransfer size={45} className='mt-2 ' />}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={data}
            columns={columns}
            queryData={(e) => queryData(e)}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
