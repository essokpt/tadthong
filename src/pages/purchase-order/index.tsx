import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'

import { PurchaseOrder } from './components/schema'
import {
  getPurchaseOrder,
  getPurchaseOrderItems,
  searchPurchaseOrder,
} from '@/services/purchaseOrderApi'
import { ExpandTable } from './components/table'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { ToolBar } from '@/components/custom/toolbar'
import { PageHeader } from '@/components/layouts/header'
import { IconShoppingBag } from '@tabler/icons-react'
import { ItemsDataTable } from './components/itemList/dataTable'
import { PurchaseOrderItems } from './components/itemList/schema'
import { columns } from './components/itemList/columns'
import { TablePagination } from '@/components/custom/pagination'
import { PaginationType } from 'types/pagination'

const initialValue = {
  pageSize: 5,
  currentPage: 1,
  totalRecord: 1,
  totalPage: 1,
}

export default function PurchaseOrders() {
  const [data, setData] = useState<PurchaseOrder[]>([])
  const [enableMainFilter, setEnableMainFilter] = useState(false)
  const [pagination, setPagination] = useState<PaginationType>(initialValue)

  const [poItems, setPoItems] = useState<PurchaseOrderItems[]>([])

  const { refresh, setRefresh } = useContext(ApiContext) as ApiType
  const [search, setSearch] = useState(false)

  const getData = (pageReq: number) => {
    setData([])
    console.log('Get PO data')
    getPurchaseOrder(pageReq, pagination.pageSize).then((data) =>     {
      setData(data.data)
      setPagination(data.paginations)
    })
    setRefresh(false)
  }
  const queryData = (str: any) => {
    setData([])
    console.log('check enable main filter', enableMainFilter)
    if (str == '') {
      setSearch(false)
      getData(1)
    } else if (enableMainFilter) {
      setSearch(true)
      searchPurchaseOrder(str).then((data) => setData(data))
    } else {
      setSearch(true)
      getPurchaseOrderItems(str).then((data) => setPoItems(data))
    }
  }

  const getPageSize = (sizeReq: number) => {
    console.log('Get Forecasts data', pagination)
    getPurchaseOrder(1, sizeReq).then((data) => {
      setData(data.data)
      setPagination(data.paginations)
    })
    setRefresh(false)
  }

  useEffect(() => {
    getData(1)
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Purchase Orders'
          icon={<IconShoppingBag size={45} className='mt-2 ' />}
        />
        <ToolBar
          queryData={(e) => queryData(e)}
          selectedMainFilter={(e) => setEnableMainFilter(e)}
          link=''
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {search && !enableMainFilter ? (
            <ItemsDataTable data={poItems} columns={columns} />
          ) : (
            <>
            <ExpandTable data={data} />
            <br></br>
            <TablePagination
              data={pagination}
              onChangePage={(e) => getData(e)}
              onChangeSize={(e) => getPageSize(e)}
            />
            </>
          )}
        </div>
      </LayoutBody>
    </Layout>
  )
}
