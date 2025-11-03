import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { ImportMaterial } from '../../components/schema' 
import { CellAction } from './cell-action'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<ImportMaterial>[] = [
  
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
    accessorKey: 'importDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {format(row.original.importDate,"dd-MM-yyyy")}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'user.firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Request By' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.user.firstName}
          </span>
        </div>
      )
    },
  },
   {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            <Badge className='bg-wait hover:bg-wait text-white' variant='default'> 
              {formatCurrency(row.getValue('amount'))}
            </Badge>
           
          </span>
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
              <AppStatus status={row.original.status?.toLocaleLowerCase()}/>
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'remark',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Remark' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('remark')}
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
