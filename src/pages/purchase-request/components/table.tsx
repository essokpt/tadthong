import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PurchaseRequest } from './schema'
import { ExpandData } from './expandData'
import { CellAction } from './cell-action'
import { Loading } from '@/components/custom/loading'
import { format } from 'date-fns'
import { AppStatus } from '@/components/custom/status'
import { toCurrency } from '@/lib/utils'
interface DataTableProps {
  data: PurchaseRequest[]
}

export function ExpandTable({ data }: DataTableProps) {
  return (
    <div className='space-y-4'>
      <div className='rounded-md border '>
        <Table className='w-[90rem]'>
          <TableHeader className='bg-secondary'>
            <TableRow >
              <TableHead>Code</TableHead>
              <TableHead className='w-[10rem]'>Date</TableHead>
              <TableHead className='w-[7rem]'>Request By</TableHead>             
              {/* <TableHead className='w-[20rem]'>Vender Name</TableHead> */}
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Amount</TableHead>
              {/* <TableHead>Amount</TableHead>
              <TableHead>Vat</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Approve By</TableHead>
              <TableHead colSpan={2}>Remark</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {data?.length > 0 ? (
              data?.map((item) => (
                <Collapsible key={item.id} asChild>
                  <>
                    <TableRow>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <IconChevronRight />
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell className='font-medium '>
                        {format(item.createAt, 'dd-MM-yyy')}
                      </TableCell>
                      <TableCell>{item.user.firstName}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.vender.companyName}</TableCell>
                      <TableCell>{item.sumQty}</TableCell>

                      <TableCell>{item.amount?.toFixed(2)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.remark}</TableCell>
                      <TableCell className='w-[4rem]'>
                        <CellAction row={item} />
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <ExpandData data={item} />
                    </CollapsibleContent>
                  </>
                </Collapsible>
              )) */}

            {data?.length > 0 ? (
              data?.map((item) => (
                <>
                  <TableRow className='bg-cyan-500 hover:bg-cyan-500 text-white'>
                  <TableCell>{item.code}</TableCell>

                    <TableCell className='font-medium '>
                      {format(item.createAt, 'dd-MM-yyy')}
                    </TableCell>
                    <TableCell>{item.user.firstName}</TableCell>
                    {/* <TableCell>{item.vender.companyName}</TableCell> */}
                    <TableCell>{toCurrency(item.sumQty)}</TableCell>
                    <TableCell>{toCurrency(item.total)}</TableCell>
                    <TableCell>{toCurrency(item.amount)}</TableCell>
                    <TableCell>
                    <AppStatus status={item.status?.toLocaleLowerCase()}/>
                      </TableCell>
                      <TableCell>{item.approveBy}</TableCell>
                    <TableCell colSpan={2}>{item.remark}</TableCell>
                    <TableCell className='w-[4rem]'>
                      <CellAction row={item} />
                    </TableCell>
                  </TableRow>
                  { item.purchaseRequestItems.length > 0 ? (
                    <>
                      <TableRow className='bg-secondary hover:bg-secondary '>
                      <TableCell></TableCell>
                        <TableHead className='w-[5rem]'>Item Code</TableHead>
                        <TableHead className='w-[15rem]'>Item Name</TableHead>
                        <TableHead >Vender</TableHead>
                        <TableHead>Specifications</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Vat</TableHead>
                        <TableHead>Amount</TableHead>
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
