import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'

import { PurchaseRequest } from './components/schema'
import {
  getPurchaseRequest,
  getPurchaseRequestItems,
  searchPurchaseRequest,
} from '@/services/purchaseRequestApi'
import { ExpandTable } from './components/table'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { ToolBar } from '@/components/custom/toolbar'
import { PageHeader } from '@/components/layouts/header'
import { IconHexagonalPrismPlus } from '@tabler/icons-react'
import { ItemsDataTable } from './components/itemList/dataTable'
import { columns } from './components/itemList/columns'
import { PurchaseRequestItems } from './components/itemList/schema'
import { TablePagination } from '@/components/custom/pagination'
import { PaginationType } from 'types/pagination'

const initialValue = {
  pageSize: 5,
  currentPage: 1,
  totalRecord: 1,
  totalPage: 1,
}

export default function PurchaseRequests() {
  const [pagination, setPagination] = useState<PaginationType>(initialValue)
  const [data, setData] = useState<PurchaseRequest[]>([])
  const [search, setSearch] = useState(false)
  const [enableMainFilter, setEnableMainFilter] = useState(true)
  const [prItems, setPrItems] = useState<PurchaseRequestItems[]>([])

  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getPageSize = (sizeReq: number) => {
    console.log('Get Forecasts data', pagination)
    getPurchaseRequest(1, sizeReq).then((data) => {
      setData(data.data)
      setPagination(data.paginations)
    })
    setRefresh(false)
  }
  const getData = (pageReq: number) => {
    setData([])
    console.log('Get PR data')
    getPurchaseRequest(pageReq, pagination.pageSize).then((data) => {
      setData(data.data)
      setPagination(data.paginations)
    })
    setRefresh(false)
  }
  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      setSearch(false)
      getData(1)
    } else if (enableMainFilter) {
      setSearch(true)
      searchPurchaseRequest(str).then((data) => setData(data))
    } else {
      setSearch(true)
      getPurchaseRequestItems(str).then((data) => setPrItems(data))
    }
  }

  useEffect(() => {
    setSearch(false)
    getData(1)
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Purchase Request'
          icon={<IconHexagonalPrismPlus size={45} className='mt-2 ' />}
        />
        <ToolBar
          queryData={(e) => queryData(e)}
          link='/purchase-request/new'
          selectedMainFilter={(e) => setEnableMainFilter(e)}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {/* <DataTable data={data} columns={columns} /> */}

          {search && !enableMainFilter ? (
            <ItemsDataTable data={prItems} columns={columns} />
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
