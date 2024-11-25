import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './dataTable'
import { columns } from './columns'
import { getOnHandStock, searchStock } from '@/services/inventoryApi'
import { StockOnhand } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconServer2 } from '@tabler/icons-react'

export default function Stock() {
  const [data, setData] = useState<StockOnhand[]>([])
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log('Get Stock data')
    getOnHandStock().then((data) => setData(data))
    setRefresh(false)
  }

  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData()
    } else {
      searchStock(str).then((data) => setData(data))
    }
  }

  useEffect(() => {
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        
        <PageHeader
          label='Stock'
          icon={<IconServer2 size={45} className='mt-2 ' />}
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
