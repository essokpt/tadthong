import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './dataTable'
import { columns } from '../components/columns'
import { Warehouse } from '../components/schema'
import {
  getWarehouseByBranch,
  searchWarehouseByBranch,
} from '@/services/warehouseApi'
import { PageHeader } from '@/components/layouts/header'
import { IconHome } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

export default function ManageWarehouses() {
  const [data, setData] = useState<Warehouse[]>([])
  // const [branchId, setBranchId] = useState<number>()
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const branchId: any = localStorage.getItem('branchId')
  const id = parseInt(branchId)
  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData()
    } else {
      searchWarehouseByBranch(id, str).then((data) => setData(data))
    }
  }
  const getData = () => {
    setData([])

    console.log('Get Warehouses data')
    getWarehouseByBranch(id).then((data) => setData(data))

    setRefresh(false)
  }

  useEffect(() => {
    // const branchId:any = localStorage.getItem('branchId')
    //setBranchId(branchId)
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Warehouses By Branch'
          icon={<IconHome size={45} className='mt-2 ' />}
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
