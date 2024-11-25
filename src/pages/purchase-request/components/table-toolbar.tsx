
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { IconSearch } from '@tabler/icons-react'
//import { DataTableViewOptions } from './data-table-view-options'

// import { priorities, statuses } from '../mockdata/data'
// import { DataTableFacetedFilter } from './data-table-faceted-filter'


export function TableToolbar() {

  const navigate = useNavigate()
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
       
        <Input
          placeholder='Filter tasks...'
          // onChange={(event) =>
          //   table.getColumn('code')?.setFilterValue(event.target.value)
          // }
          className='h-8 w-[150px] lg:w-[250px]'
        />       
      
          <Button
            variant='outline'
            // onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3 bg-primary'
          >
            Serach
            <IconSearch className='ml-2 h-4 w-4' />
          </Button>
       
      </div>
      {/* <DataTableViewOptions table={table} /> */}

      <Button
        variant='outline'
        size='sm'
        className='h-8 border text-white bg-primary'
        onClick={() => navigate('/purchase-request/new')}
      >
        {/* <PlusCircledIcon className='mr-2 h-4 w-4' /> */}
        New
      </Button>
    </div>
  )
}
