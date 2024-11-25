import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
//import { DataTablePagination } from '@/components/dataTable/data-table-pagination'
//import { DataTableToolbar } from './data-table-toolbar'
//import { IconChevronRight } from '@tabler/icons-react'
import { PurchaseOrder } from './schema'
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from '@/components/ui/collapsible'
import { ExpandData } from './expandData'
import { CellAction } from './cell-action'
import { Loading } from '@/components/custom/loading'
import { format } from 'date-fns'
import { AppStatus } from '@/components/custom/status'
interface DataTableProps {
  data: PurchaseOrder[]
}

export function ExpandTable({ data }: DataTableProps) {
  return (
    <div className='space-y-4'>
      <div className='rounded-md border '>
        <Table className='w-[80rem]'>
          <TableCaption>A list of your recent items.</TableCaption>
          <TableHeader className='bg-secondary'>
            <TableRow>
              <TableHead className='w-[12rem]'>Date</TableHead>
              <TableHead className='w-[12rem]'>Code</TableHead>
              <TableHead className='w-[25rem]'>Vender Name</TableHead>
              <TableHead className='w-[15rem]'>Delivery Date</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Vat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approve By</TableHead>
              <TableHead className='w-[7rem]'>Request By</TableHead>
              <TableHead >Remark</TableHead>

              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length > 0 ? (
              data?.map((item) => (
                <>
                  <TableRow className='bg-cyan-500 text-white hover:bg-sky-500/75'>
                    <TableCell className='font-medium '>
                      {format(item.createAt, 'dd-MM-yyyy')}
                    </TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.vender?.companyName}</TableCell>
                    <TableCell>{item.deliveryDate}</TableCell>
                    <TableCell>{item.discount?.toFixed(2)}</TableCell>
                    <TableCell>{item.amount?.toFixed(2)}</TableCell>
                    <TableCell>{item.vat?.toFixed(2)}</TableCell>
                    <TableCell>
                      <AppStatus status={item.status?.toLocaleLowerCase()}/>
                      </TableCell>
                      <TableCell>{item.approveBy}</TableCell>
                    <TableCell>{item.user.firstName}</TableCell>
                    <TableCell >{item.remark}</TableCell>
                    <TableCell className='w-[4rem]'>
                      <CellAction row={item} />
                    </TableCell>
                  </TableRow>
                  {item.purchaseOrderItems.length > 0 ? (
                    <>
                      <TableRow className='bg-secondary'>
                        <TableHead></TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Specification</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount(%)</TableHead>
                        <TableHead>Discount/Unit</TableHead>
                        <TableHead>Discount Total</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Vat</TableHead>
                        <TableHead>Remark</TableHead>
                      </TableRow>
                      <ExpandData data={item} />
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className='h-24 text-center'>
                  <Loading timeout={5000} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <DataTablePagination table={table} /> */}
    </div>
  )
}
