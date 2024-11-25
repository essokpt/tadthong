import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './dataTable'
import { columns } from '../components/columns'
import { Locations } from '../components/schema'
import { getLocationByBranch, searchLocationByBranch } from '@/services/locationApi'
import { PageHeader } from '@/components/layouts/header'
import { IconMapPin } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

export default function ManageLocation() {
  const [data, setData] = useState<Locations[]>([])
  const branchId: any = localStorage.getItem('branchId')
  const id = parseInt(branchId)

  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData()
    } else {
      searchLocationByBranch(id, str).then((data) => setData(data))
    }
  }
  const getData = () => {
    setData([])

    console.log('Get Warehouses data')
    getLocationByBranch(id).then((data) => setData(data))

    setRefresh(false)
  }

  useEffect(() => {
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Location'
          icon={<IconMapPin size={45} className='mt-2 ' />}
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
