import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { SaleOrderReport } from './schema'
import { toCurrency } from '@/lib/utils'
import { format } from 'date-fns'
//import { AppStatus } from '@/components/custom/status'

export const columns: ColumnDef<SaleOrderReport>[] = [
  
  {
    accessorKey: 'soNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SO-Number' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('soNumber')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'custoemrCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Code' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('custoemrCode')}
          </span>
        </div>
      )
    },
  },  
 
  {
    accessorKey: 'soDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SO-Date' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {format(row.getValue('soDate'), 'dd-MM-yyy')}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('customerName')}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'customerPO',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer-PO' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('customerPO')}
          </span>
        </div>
      )
    },
  },  
  
  {
    accessorKey: 'driverName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Driver Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('driverName')}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'licensePlate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='License Plate' />
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
    accessorKey: 'soStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SO-Status' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('soStatus')}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'scaleNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Scale Number' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('scaleNumber')}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'workorderNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Work Order No' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('workorderNo')}
          </span>
        </div>
      )
    },
  },

  //
  {
    accessorKey: 'itemNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Number' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('itemNumber')}
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
    accessorKey: 'unitPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unit Price' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('unitPrice'))}
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
  ///

  {
    accessorKey: 'humidityQtyDeduct',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Humidity Qty Deduct' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('humidityQtyDeduct'))}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'adulterationQtyDeduct',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Adulteration Qty Deduct' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('adulterationQtyDeduct'))}
          </span>
        </div>
      )
    },
  },  
 
  {
    accessorKey: 'otherQtyDeduct',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Other Qty Deduct' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('otherQtyDeduct'))}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'customerQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Quantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('customerQuantity'))}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'weightPriceDeduct',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Weight Price Deduct' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('weightPriceDeduct'))}
          </span>
        </div>
      )
    },
  }, 
  ////

  {
    accessorKey: 'shipPriceDeduct',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ship Price Deduct' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('shipPriceDeduct'))}
          </span>
        </div>
      )
    },
  },  
  {
    accessorKey: 'otherPriceDeduct',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Other Price Deduct' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('otherPriceDeduct'))}
          </span>
        </div>
      )
    },
  },  
 
  {
    accessorKey: 'customerUnitPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Unit Price' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('customerUnitPrice'))}
          </span>
        </div>
      )
    },
  }, 
  
  {
    accessorKey: 'customerAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Amount' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('customerAmount'))}
          </span>
        </div>
      )
    },
  }, 

  {
    accessorKey: 'diffQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Diff Quantity' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {toCurrency(row.getValue('diffQuantity'))}
          </span>
        </div>
      )
    },
  }, 
  
 /////
 {
  accessorKey: 'diffUnitPrice',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Diff Unit Price' />
  ),
  cell: ({ row }) => {   
    return (
      <div className='flex space-x-2'>
       
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('diffUnitPrice'))}
        </span>
      </div>
    )
  },
},  
{
  accessorKey: 'destinationHumidity',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Destination Humidity' />
  ),
  cell: ({ row }) => {   
    return (
      <div className='flex space-x-2'>
       
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {toCurrency(row.getValue('destinationHumidity'))}
        </span>
      </div>
    )
  },
},  

{
  accessorKey: 'customerScaleNumber',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Customer Scale Number' />
  ),
  cell: ({ row }) => {   
    return (
      <div className='flex space-x-2'>
       
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('customerScaleNumber')}
        </span>
      </div>
    )
  },
}, 

{
  accessorKey: 'invoiceNumber',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title='Invoice Number' />
  ),
  cell: ({ row }) => {   
    return (
      <div className='flex space-x-2'>
       
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
        {row.getValue('invoiceNumber')}
        </span>
      </div>
    )
  },
}, 

]
