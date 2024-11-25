import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseRequestItems } from './schema'
import { CellAction } from './cell-action'

export const columns: ColumnDef<PurchaseRequestItems>[] = [
  {
    accessorKey: 'purchaseRequests.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PR-Code' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.purchaseRequests?.code}
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
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.itemMaster?.code}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'vender.companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vender Name' />
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
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('quantity')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('price')}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
          {row.getValue('total')}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: 'includeVat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vat' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('includeVat')}
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
            {row.getValue('amount')}
          </span>
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction row={row.original} />,
  },
]
