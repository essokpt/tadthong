/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { DataTableViewOptions } from './data-table-view-options'
import usePermission from '@/hooks/use-permission'
import { IconDownload } from '@tabler/icons-react'
import { exportCsv } from '@/lib/utils'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchData: (str: any) => void
  link: string
}


export function DataTableToolbar<TData>({
  table,
  searchData,
  link,
}: DataTableToolbarProps<TData>) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const rule: any = usePermission('customer')

  const reset = () => {
    searchData('')
    setQuery('')
  }

  const handleExport = (rows: any[]) => {
    const rowData = rows.map((row) => {
      return {
        id: row.original.id,
        address: row.original.address,
        code: row.original.code,
        companyName: row.original.companyName,
        phone: row.original.phone,
        fax: row.original.fax,
        ext: row.original.ext,
        tax: row.original.tax,
        attn: row.original.attn,
        email: row.original.email,
        type: row.original.type,
        meng: row.original.meng,
        costmarkup: row.original.costmarkup,
        district: row.original.district,
        subDistrict: row.original.subDistrict,
        province: row.original.province,
        country: row.original.country,
        zipcode: row.original.zipcode,
        creditHold: row.original.creditHold,
        creditLimitOrder: row.original.creditLimitOrder,
        creditLimitItem: row.original.creditLimitItem,
        alternatePhone: row.original.alternatePhone,
        phoneExt: row.original.phoneExt,
        alternateFax: row.original.alternateFax,
        specialIntruction: row.original.specialIntruction,
        paymentTerm: row.original.paymentTerm,
        status: row.original.status,
        currency: row.original.currency,
        createAt: row.original.createAt,
        remark: row.original.remark,
      }
    })


    exportCsv(rowData)
  }

  return (
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
          onClick={() => searchData(query)}
        >
          <SearchIcon className='mr-2 h-4 w-4' />
          Search
        </Button>
        <DataTableViewOptions table={table} />

        {query && (
          <Button variant='ghost' onClick={reset} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      {link && (
        <>
          <Button
            variant='ghost'
            size='sm'
            className='mr-2 h-8 border bg-primary text-white'
            onClick={() => handleExport(table.getFilteredRowModel().rows)}
          >
            <IconDownload className='mr-2 h-4 w-4' />
            Export
          </Button>
          <Button
            disabled={!rule[0]?.canCreate}
            variant='outline'
            size='sm'
            className='h-8 border bg-button text-white'
            onClick={() => navigate(link)}
          >
            <PlusCircledIcon className='mr-2 h-4 w-4' />
            New
          </Button>
        </>
      )}
    </div>
  )
}
