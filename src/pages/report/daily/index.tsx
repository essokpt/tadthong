import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { MasterReport } from './components/schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconReportAnalytics } from '@tabler/icons-react'
//import { TablePagination } from '@/components/custom/pagination'
//import { PaginationType } from 'types/pagination'
import { getDailyReport } from '@/services/reportApi'
import { ToolBar } from './components/toolbar'

// const initialValue = {
//   pageSize: 10,
//   currentPage: 1,
//   totalRecord: 1,
//   totalPage: 1,
// }
const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear()

export default function DailyReports() {
  const [data, setData] = useState<MasterReport[]>([])
  //const [pagination, setPagination] = useState<PaginationType>(initialValue)
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    getDailyReport(selectedYear, selectedMonth).then((data) => setData(data))
    setRefresh(false)
  }

  // const getPageSize = (sizeReq: number) => {
  //   console.log('Get Forecasts data', pagination)
  //   getForecast(1, sizeReq).then((data) => {
  //     setData(data.data)
  //     setPagination(data.paginations)
  //   })
  //   setRefresh(false)
  // }
  const handleChangeMonth = (e: any) => {
    console.log('handleChangeMonth', e)
    setSelectedMonth(parseInt(e))
    //getData(parseInt(e), selectedYear);
  }

  const handleChangeYear = (e: any) => {
    console.log('handleChangeYear', e)
    setSelectedYear(parseInt(e))
    //getData(selectedMonth,parseInt(e));
  }

  // const queryData = (str: any) => {
  //   setData([])
  //   if (str == '') {
  //     getDailyReport(2024,8).then((data) => setData(data))

  //   } else {
  //     getDailyReport(2024,8).then((data) => setData(data))
  //   }
  // }

  useEffect(() => {
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Daily Report'
          icon={<IconReportAnalytics size={45} className='mt-2 ' />}
        />
        <ToolBar
          queryData={() => getData()}
          filterMonth={(e) => handleChangeMonth(e)}
          filterYear={(e) => handleChangeYear(e)}
          link=''
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={data}
            columns={columns}
            // queryData={(e) => queryData(e)}
          />
          <br></br>
          {/* <TablePagination
            data={pagination}
            onChangePage={(e) => getData(e)}
            onChangeSize={(e) => getPageSize(e)}
          /> */}
        </div>
      </LayoutBody>
    </Layout>
  )
}
