import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/dataTable/data-table-pagination'
import { Button } from '@/components/custom/button'
import { SearchIcon } from 'lucide-react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/custom/loading'
import { DataTableViewOptions } from './data-table-view-options'
import { ConvertModal } from './convert-modal'
import { PurchaseRequestItem } from './schema'
import { createPurchaseOrder } from '@/services/purchaseOrderApi'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import usePermission from '@/hooks/use-permission'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  queryData: (str: any) => void
 
}

type AlertData = {
  title: string
  error: boolean
}

const intial = {
  title: '',
  error: false,
}

export function DataTable<TData, TValue>({
  columns,
  data,
  queryData,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [query, setQuery] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [onLoading, setOnLoading] = React.useState(false)

  const [validate, setValidate] = React.useState<AlertData>(intial)
  const [dataConvertSelected, setDataConvertSelected] = React.useState<PurchaseRequestItem[]>([])

  const rule: any = usePermission('purchaseRequest')

  let today = new Date()
  let branchid: any = localStorage.getItem('branchId')
  let userid: any = localStorage.getItem('userId')
  let dateCode = format(today, 'yyyy-MM-dd')
  let newCode = dateCode.split('-')
  const navigate = useNavigate()
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const reset = () => {
    queryData('')
    setQuery('')
  }

  const handleConfirmConvert = async() => {
    console.log('Confirm to Convert');
    setOnLoading(true)
    const data = {
      code: 'PO'+ newCode[0]+newCode[1]+newCode[2],
      amount:1,
      branchId: parseInt(branchid),
      userId : parseInt(userid),
      cause: null,
      companyId:1,
      venderId: dataConvertSelected[0].venderId,
      createAt : format(today, 'yyyy-MM-dd'),
      currency: dataConvertSelected[0].vender?.currency,
      deliveryDate: "2024-08-24",
      description:"New Order",
      discount: 0,
      locationId:10,
      paymentTerm:dataConvertSelected[0].vender?.paymentTerm,
      paymentType:dataConvertSelected[0].vender?.venderType,
      purchaseOrderItems : dataConvertSelected
    }
    const response = await createPurchaseOrder(data)
    if(response?.status == 200){
      console.log('Convert completed');
      setTimeout(() => {
        setValidate(intial)
        setDataConvertSelected([])
        setOnLoading(false)
        setIsOpen(false)
      }, 1000)

      navigate('/purchase-order', { replace: true })

    }
    setOnLoading(false)

  }

  const handleConvert = () => {
   
    let rowSelected:any = []
    if(table.getSelectedRowModel().rows.length > 0){
      for (let index = 0; index < table.getSelectedRowModel().rows.length; index++) {
        rowSelected.push(table.getSelectedRowModel().rows[index].original)        
      }
      
      const firstVenderId:any= rowSelected[0].venderId 
      const invalidVender = rowSelected.find((x:any) => x.venderId != firstVenderId )

      if(invalidVender){
        setValidate({
          error: true,
          title: 'Invalid vender Please try again.'
        })
      }else{
        setValidate({
          error: false,
          title: 'Ready to convert'
        })
        setDataConvertSelected(rowSelected)
      }
      console.log('rowSelected',dataConvertSelected)

    }else{
      setValidate({
        error: true,
        title: 'No data selected Please try again.'
      })
    }
    setIsOpen(true)
  }

  const closeConvertModal = () => {
    setIsOpen(false)
    setValidate(intial)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder='Filter'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
          <Button
            variant='outline'
            size='sm'
            className='h-8 px-2 lg:px-3'
            onClick={() => queryData(query)}
          >
            <SearchIcon className='mr-2 h-4 w-4' />
            Search
          </Button>
          <DataTableViewOptions table={table} />

          {query && (
            <Button
              variant='ghost'
              onClick={reset}
              className='h-8 px-2 lg:px-3'
            >
              Reset
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>

        <Button
         disabled={!rule[0]?.canCreate}
          variant='outline'
          size='sm'
          className='h-8 border bg-primary text-white'
          onClick={handleConvert}
        >
          Convert
        </Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader className='bg-secondary'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className='text-foreground'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <Loading timeout={7000} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      <ConvertModal
        isOpen={isOpen}
        onClose={closeConvertModal}
        onConfirm={handleConfirmConvert}
        loading={onLoading}
        data={validate}
      />
    </div>
  )
}
