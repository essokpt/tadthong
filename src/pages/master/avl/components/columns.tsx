import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
import { Avl} from './schema'
import { CellAction } from './cell-action'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Avl>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Item Name' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('name')}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: 'vender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='List' />
    ),
    cell: ({ row }) => {   
      return (
        <div className='flex space-x-2'>
         
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          <Badge className='border-primary' variant='outline'>Venders {row.original.itemVenderLists?.length}</Badge>
          </span>
        </div>
      )
    },
  },   
  // {
  //   accessorKey: 'venders.code',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Venders' />
  //   ),
  //   cell: ({ row, getValue }) => {
  //     return (
  //       <>
  //         {row.getCanExpand() ? (
  //               <button
  //                 {...{
  //                   onClick: row.getToggleExpandedHandler(),
  //                   style: { cursor: 'pointer' },
  //                 }}
  //               >
  //                 {row.getIsExpanded() ? '👇' : '👉'}
  //               </button>
  //             ) : (
  //               '🔵'
  //             )}{' '}
  //             {getValue<boolean>()}
  //       </>
  //     );
  //   },
  // }, 
  {
    id: 'actions',
    cell: ({row}) => <CellAction row={row.original} />,
  },
]
