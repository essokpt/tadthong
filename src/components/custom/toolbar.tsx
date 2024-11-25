import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from './button'
import { Input } from '../ui/input'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'

interface SerachModalProps {
  queryData: (str: any) => void
  link: string
  selectedMainFilter: (enable: boolean) => void
}

export const ToolBar: React.FC<SerachModalProps> = ({
  queryData,
  link,
  selectedMainFilter,
}) => {
  const [query, setQuery] = useState('')
  const [enableMainFilter, setEnableMainFilter] = useState(false)

  const navigate = useNavigate()

  const handleFilterMain = () => {
    setEnableMainFilter(!enableMainFilter)
    selectedMainFilter(enableMainFilter)
  }
  const reset = () => {
    queryData('')
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
<div className='flex items-center space-x-2'>
          <Checkbox
            id='terms'
            checked={enableMainFilter}
            onCheckedChange={handleFilterMain}
          />
          <label
            htmlFor='terms'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Filter Items
          </label>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='h-8 px-2 lg:px-3'
          onClick={() => queryData(query)}
        >
          <SearchIcon className='mr-2 h-4 w-4' />
          Search
        </Button>

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
