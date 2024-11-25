import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { MasterReport} from './schema'
//import { CellAction } from './cell-action'
import { format } from 'date-fns'

export const columns: ColumnDef<MasterReport>[] = [
   
  {
    accessorKey: 'createDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {format(row.original.createDate,"dd-MM-yyyy")}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'itemName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Name' />
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
    accessorKey: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer ' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('customer')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'queueNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('queueNo')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'licensePlate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='licensePlate' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('licensePlate')}

          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'sourceQty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='source Qty' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('sourceQty')}
          </span>
        </div>
      )
    },
  },   
  {
    accessorKey: 'customerQty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='customerQty' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('customerQty')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'diffQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='diffQuantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('diffQuantity')}
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
    accessorKey: 'sourceHumandity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='sourceHumandity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('sourceHumandity')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'customerHumandity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='customerHumandity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('customerHumandity')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'invoiceNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='invoiceNo ' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('invoiceNo')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'invoiceDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='invoiceDate' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.original.invoiceDate? format(row.original.invoiceDate,"dd-MM-yyyy") : ""}
          </span>
      </div>
      )
    },
  }, 
  {
    accessorKey: 'unitPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='unitPrice' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('unitPrice')}

          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'customerPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='customerPrice' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('customerPrice')}
          </span>
        </div>
      )
    },
  },   
  {
    accessorKey: 'diffPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='diffPrice' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('diffPrice')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'amountBeforVat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='amountBeforVat' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('amountBeforVat')}
          </span>
        </div>
      )
    },
  }, 


  {
    accessorKey: 'vat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='vat' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('vat')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='amount' />
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
]
