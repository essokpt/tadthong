import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'

import { Button } from '@/components/custom/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaginationType } from 'types/pagination'

interface DataTablePaginationProps {
  data: PaginationType
  onChangePage: (pageReq: number) => void
  onChangeSize: (sizeReq: number) => void

}
export const TablePagination: React.FC<DataTablePaginationProps> = ({
  data,
  onChangePage,
  onChangeSize
}) => {

  return (
    <div className='flex items-center justify-between overflow-auto px-2'>
      <div className='hidden flex-1 text-sm text-muted-foreground sm:block'>
        {/* {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
       
        <div className='flex items-center space-x-2'>
          <p className='hidden text-sm font-medium sm:block'>Rows per page</p>
          <Select
            value={data.pageSize.toString()}
            onValueChange={(value) => onChangeSize(Number(value))}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={data.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[5, 10, 15, 20, 30,50,100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {data.currentPage} of {data.totalPage}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => onChangePage(1)}
            // disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
             onClick={() => onChangePage(data.currentPage - 1)}
             disabled={data.currentPage == 1}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onChangePage(data.currentPage + 1) }
            disabled={(data.currentPage == data.totalPage) || (data.totalPage == 0)}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => onChangePage(data.totalPage)}
            disabled={(data.currentPage == data.totalPage) || (data.totalPage == 0)}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
