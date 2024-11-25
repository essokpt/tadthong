import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';

interface SerachModalProps {  
  queryData: (str: any) => void
}

export const ToolBar: React.FC<SerachModalProps> = ({
  queryData

}) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  
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
          onChange={(event) =>
            setQuery(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Button
        variant='outline'
        size='sm'
        className='h-8 border text-white'   
        onClick={() => queryData(query)}
      >
        <SearchIcon className='mr-2 h-4 w-4' />
        Search
      </Button>
      {query && (
      <Button
            variant='ghost'
            onClick={reset}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
      )}
       
      </div>
     

      <Button
        variant='outline'
        size='sm'
        className='h-8 border text-white bg-primary'   
        onClick={() => navigate('/master/customer/new')}
      >
        <PlusCircledIcon className='mr-2 h-4 w-4' />
        New
      </Button>
    </div>
  )
}
