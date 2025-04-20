import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/custom/button'
//import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,  
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SerachModalProps {
  queryData: () => void
  filterMonth: (str: any) => void
  filterYear: (str: any) => void
  link: string
}

const monthly = [
  { id: 1, label: 'January' },
  { id: 2, label: 'February' },
  { id: 3, label: 'March' },
  { id: 4, label: 'April' },
  { id: 5, label: 'May' },
  { id: 6, label: 'June' },
  { id: 7, label: 'July' },
  { id: 8, label: 'August' },
  { id: 9, label: 'September' },
  { id: 10, label: 'October' },
  { id: 11, label: 'November' },
  { id: 12, label: 'December' },
]

const yearOptions = Array.from({ length: 20 }, (_, i) => ({
  label: String(new Date().getFullYear() - i),
  value: new Date().getFullYear() - i
}));

export const ToolBar: React.FC<SerachModalProps> = ({ queryData, filterMonth,filterYear, link }) => {
 // const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // const reset = () => {
  //   queryData()
  //   //setQuery('')
  // }
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Select onValueChange={filterMonth}>
          <SelectTrigger className='w-[280px] text-muted-foreground'>
            <SelectValue placeholder='Filter Month' />
          </SelectTrigger>
          <SelectContent>
           
            {monthly.map((item) => (
              <SelectItem value={item.id.toString()} key={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={filterYear}>
          <SelectTrigger className='w-[280px] text-muted-foreground'>
            <SelectValue placeholder='Filter Year' />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((item) => (
              <SelectItem value={item.value.toString()} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <Input
          placeholder='Filter Item'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        /> */}
        <Button
          variant='outline'
          size='sm'
          className='h-8 px-2 lg:px-3'
          onClick={() => queryData()}
        >
          <SearchIcon className='mr-2 h-4 w-4' />
          Search
        </Button>
        {/* {query && (
          <Button variant='ghost' onClick={reset} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )} */}
      </div>
      {link && (
        <Button
          variant='outline'
          size='sm'
          className='h-8 border bg-primary text-white'
          onClick={() => navigate(link)}
        >
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          New
        </Button>
      )}
    </div>
  )
}
