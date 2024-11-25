import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { MasterReport} from './schema'
//import { CellAction } from './cell-action'

export const columns: ColumnDef<MasterReport>[] = [
   
  {
    accessorKey: 'itemCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('itemCode')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'itemName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='itemName' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('itemName')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'descriptions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('descriptions')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day1' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day1')}

          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'day2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day2' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day2')}
          </span>
        </div>
      )
    },
  },   
  {
    accessorKey: 'day3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day3' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day3')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day4',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day4' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day4')}
          </span>
        </div>
      )
    },
  },  
  
  // {
  //   id: 'actions',
  //   cell: ({row}) => <CellAction row={row.original} />,
  // },
  {
    accessorKey: 'day5',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day5' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day5')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'day6',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day6' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day6')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'day7',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day7 ' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day7')}
          </span>
        </div>
      )
    },
  }, 
 
  {
    accessorKey: 'day8',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day8' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day8')}

          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'day9',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day9' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day9')}
          </span>
        </div>
      )
    },
  },   
  {
    accessorKey: 'day10',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day10' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day10')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day11',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day11' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day11')}
          </span>
        </div>
      )
    },
  }, 


  {
    accessorKey: 'day12',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day12' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day12')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day13',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day13' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day13')}
          </span>
        </div>
      )
    },
  }, 



  {
    accessorKey: 'day14',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day14' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day14')}

          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'day15',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day15' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day15')}
          </span>
        </div>
      )
    },
  },   
  {
    accessorKey: 'day16',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day16' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day16')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day17',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day17' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day17')}
          </span>
        </div>
      )
    },
  },  
  
  // {
  //   id: 'actions',
  //   cell: ({row}) => <CellAction row={row.original} />,
  // },
  {
    accessorKey: 'day18',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day18' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day18')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'day19',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day19' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day19')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'day20',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day20 ' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day20')}
          </span>
        </div>
      )
    },
  }, 
 
  {
    accessorKey: 'day21',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day21' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day21')}

          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'day22',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day22' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day22')}
          </span>
        </div>
      )
    },
  },   
  {
    accessorKey: 'day23',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day23' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day23')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day24',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day24' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day24')}
          </span>
        </div>
      )
    },
  }, 


  {
    accessorKey: 'day25',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day25' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('day25')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day26',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day26' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day26')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day27',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day27' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day27')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day28',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day28' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day28')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day29',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day29' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day29')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day30',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day30' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day30')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'day31',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='day31' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('day31')}
          </span>
        </div>
      )
    },
  }, 
]
