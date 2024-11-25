import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseRequest} from '../../components/schema'
import { CellAction } from './cell-action'
import { format } from 'date-fns'

export const columns: ColumnDef<PurchaseRequest>[] = [
  {
    accessorKey: 'createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {format(row.original.createAt,"dd-MM-yyyy")}
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
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.user.firstName}
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
            {row.getValue('status')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PR-Code' />
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
 
  // {
  //   accessorKey: 'vender.companyName',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Vender' />
  //   ),
  //   cell: ({ row }) => {   
  //     return (
  //       <div className='flex space-x-2'>
         
  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
  //           {row.original.vender.companyName}
  //         </span>
  //       </div>
  //     )
  //   },
  // },  
  
  {
    accessorKey: 'sumQty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.sumQty?.toFixed(2)}

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
          {row.original.amount?.toFixed(2)}
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
