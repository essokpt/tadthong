import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './master/components/dataTable'
import { columns } from './master/components/columns'
import { MasterReport } from './master/components/schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconReport } from '@tabler/icons-react'
//import { TablePagination } from '@/components/custom/pagination'
//import { PaginationType } from 'types/pagination'
import { getMasterReport } from '@/services/reportApi'
import { ToolBar } from './master/components/toolbar'

// const initialValue = {
//   pageSize: 10,
//   currentPage: 1,
//   totalRecord: 1,
//   totalPage: 1,
// }
const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear()

export default function MasterReports() {
  const [data, setData] = useState<MasterReport[]>([])
  //const [pagination, setPagination] = useState<PaginationType>(initialValue)
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    // console.log(
    //   'Get Forecasts data',
    //   pagination.pageSize / pagination.totalRecord
    // )
    getMasterReport(selectedYear,selectedMonth).then((data) => {
      setData(data)
      //setPagination(data.paginations)
    })
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

  const handleChangeMonth = (e:any) => {
    console.log("handleChangeMonth", e);
    setSelectedMonth(parseInt(e))
    //getData(parseInt(e), selectedYear);
  }

  const handleChangeYear = (e:any) => {
    console.log("handleChangeYear", e);
    setSelectedYear(parseInt(e))
    //getData(selectedMonth,parseInt(e));
  }

  // const queryData = () => {
  //   setData([])
  //   if (str == '') {
  //     getMasterReport(2024,8).then((data) => setData(data))

  //   } else {
  //     getMasterReport(2024,8).then((data) => setData(data))
  //   }
  // }

  useEffect(() => {
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Master Report'
          icon={<IconReport size={45} className='mt-2 ' />}
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
