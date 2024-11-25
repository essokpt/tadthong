import { ColumnDef } from '@tanstack/react-table'
import { priorities } from '../data/data'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { ApproveMaterial} from './schema'
import { CellAction } from './cell-action'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<ApproveMaterial>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='ID' />
  //   ),
  //   cell: ({ row }) => <div className='w-[40px]'>{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('code')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('description')}
          </span>
        </div>
      )
    },
  }, 
  // {
  //   accessorKey: 'priority',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Priority' />
  //   ),
  //   cell: ({ row }) => {   
  //     return (
  //       <div className='flex space-x-2'>
         
  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //         {row.getValue('priority')}
  //         </span>
  //       </div>
  //     )
  //   },
  // }, 
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )

      if (!priority) {
        return null
      }

      return (
        <div className='flex items-center'>
         

          {priority.icon && (
            <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <Badge className={`bg-${priority.color}`} variant='outline'>{priority.label}</Badge>
          {/* <span>{priority.label}</span> */}
        </div>
      )
    },  
  },    
   
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('status')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Create Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('createAt')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'approveDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Update' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('approveDate')}
          </span>
        </div>
      )
    },
  },  
  {
    id: 'actions',
    cell: ({row}) => <CellAction row={row.original} />,
  },
]
