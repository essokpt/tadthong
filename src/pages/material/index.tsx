/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { ImportMaterial } from './components/schema'
import { getMaterial, searchMaterial } from '@/services/materialApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconTruckDelivery } from '@tabler/icons-react'
import { isValidDate } from '@/lib/utils'

export default function Materials() {
  const [data, setData] = useState<ImportMaterial[]>([])
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const getData = () => {
    setData([])
    console.log('Get Vender data')
    getMaterial().then((data) => setData(data))
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
        searchMaterial(formattedDate).then((data) => setData(data))
      } else {
        searchMaterial(str).then((data) => setData(data))
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
          label='Import Weight Scale & Maintain'
          icon={<IconTruckDelivery size={45} className='mt-2 ' />}
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
