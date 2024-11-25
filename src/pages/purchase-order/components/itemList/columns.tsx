import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { PurchaseOrderItems } from './schema'
import { CellAction } from './cell-action'

export const columns: ColumnDef<PurchaseOrderItems>[] = [
  {
    accessorKey: 'purchaseOrder.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PO-Code' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.purchaseOrder?.code}
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
    accessorKey: 'itemMaster.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
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
    accessorKey: 'discountPercent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount(%)' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('discountPercent')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'discountUnit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount/unit' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('discountUnit')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'discountTotal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount Total' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('discountTotal')}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: 'vat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vat' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
          {row.getValue('vat')}
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
