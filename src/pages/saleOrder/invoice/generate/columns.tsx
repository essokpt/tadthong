import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { saleOrderItems } from './schema'

export const columns: ColumnDef<saleOrderItems>[] = [
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Id' />
  //   ),
  //   cell: ({ row }) => {   
  //     return (
  //       <div className='flex space-x-2'>
         
  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
  //         {row.getValue('id')}
  //                   </span>
  //       </div>
  //     )
  //   },
  // }, 
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
  
  {
    accessorKey: 'saleOrderItems.saleOrder.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sale Order No' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.saleOrder?.code}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'saleOrder.createAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sale Order Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.saleOrder?.createAt}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'saleOrderItems.saleOrder.customer.companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.saleOrder?.customer?.companyName}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'saleOrder.carRegistration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Car Registration' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
            {row.original.saleOrder?.carRegistration}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'destinationWeighingScale',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Weighing Scale No.' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[100rem]'>
          {row.getValue('destinationWeighingScale')}
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
    accessorKey: 'destinationWeighingScale',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Weight' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('destinationWeighingScale')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'afterCutPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='AfterCut Price' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('afterCutPrice')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'afterAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='After Amount' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('afterAmount')}
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
 
]
