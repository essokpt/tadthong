import { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseRequestItem } from './schema'
import { CellAction } from './cell-action'
import { toCurrency } from '@/lib/utils'

export const columns: ColumnDef<PurchaseRequestItem>[] = [
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
  //     <DataTableColumnHeader column={column} title='Select' />
  //   ),
  //   cell: ({ row }) => <div className='w-[15px]'>{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'purchaseRequests.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ref-PR' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.purchaseRequests?.code}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'vender.companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vender' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.vender?.companyName}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'itemMaster.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.itemMaster?.code}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'itemMaster.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.itemMaster?.name}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('quantity'))}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unit Price' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('price'))}
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
            {toCurrency(row.getValue('amount'))}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'specification',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Specification' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('specification')}
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
    id: 'actions',
    cell: ({row}) => <CellAction row={row.original} />,
  },
]
