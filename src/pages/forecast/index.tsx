import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { Forecast } from './components/schema'
import { getForecast, searchForecast } from '@/services/forecastApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconCoin } from '@tabler/icons-react'
import { TablePagination } from '@/components/custom/pagination'
import { PaginationType } from 'types/pagination'

const initialValue = {
  pageSize: 10,
  currentPage: 1,
  totalRecord: 1,
  totalPage: 1,
}

export default function Forecasts() {
  const [data, setData] = useState<Forecast[]>([])
  const [pagination, setPagination] = useState<PaginationType>(initialValue)

  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = (pageReq: number) => {
    setData([])
    console.log(
      'Get Forecasts data',
      pagination.pageSize / pagination.totalRecord
    )
    getForecast(pageReq, pagination.pageSize).then((data) => {
      setData(data.data)
      setPagination(data.paginations)
    })
    setRefresh(false)
  }

  const getPageSize = (sizeReq: number) => {
    console.log('Get Forecasts data', pagination)
    getForecast(1, sizeReq).then((data) => {
      setData(data.data)
      setPagination(data.paginations)
    })
    setRefresh(false)
  }

  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData(1)
    } else {
      searchForecast(str).then((data) => setData(data))
    }
  }

  useEffect(() => {
    getData(1)
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Forecasts'
          icon={<IconCoin size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={data}
            columns={columns}
            queryData={(e) => queryData(e)}
          />
          <br></br>
          <TablePagination
            data={pagination}
            onChangePage={(e) => getData(e)}
            onChangeSize={(e) => getPageSize(e)}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
