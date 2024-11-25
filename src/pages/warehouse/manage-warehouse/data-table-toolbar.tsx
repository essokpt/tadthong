import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { DataTableViewOptions } from '../components/data-table-view-options';
//import { DataTableViewOptions } from './data-table-view-options'

// import { priorities, statuses } from '../mockdata/data'
// import { DataTableFacetedFilter } from './data-table-faceted-filter'


interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchData: (str: any) => void
  link: string  
}

export function DataTableToolbar<TData>({
  table,searchData, link
}: DataTableToolbarProps<TData>) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const reset = () => {
    searchData('')
    setQuery('')
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Button
          variant='outline'
          size='sm'        
          className='h-8 px-2 lg:px-3'
          onClick={() => searchData(query)}
        >
          <SearchIcon className='mr-2 h-4 w-4' />
          Search
        </Button>
        <DataTableViewOptions table={table} />

        {query && (
          <Button variant='ghost' onClick={reset} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      {link && (
      <Button
        variant='outline'
        size='sm'
        className='h-8 border bg-button text-white'
        onClick={() => navigate(link)}
      >
        <PlusCircledIcon className='mr-2 h-4 w-4' />
        New
      </Button>
      )}
    </div>
  )
}
