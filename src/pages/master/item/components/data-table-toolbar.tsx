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
  const rule: any = usePermission('item')

  const reset = () => {
    searchData('')
    setQuery('')
  }

  const handleExport = (rows: any[]) => {
    const rowData = rows.map((row) => {
      return {
        id: row.original.id,
        code: row.original.code,
        name: row.original.name,
        description: row.original.description,
        status: row.original.status,
        itemCategory: row.original.itemCategory?.name,
        category: row.original.category,
        type: row.original.type,
        subCategory1: row.original.subCategory1,
        subCategory2: row.original.subCategory2,
        subCategory3: row.original.subCategory3,
        brand: row.original.brand,
        size: row.original.size,
        model: row.original.model,
        feature: row.original.feature,
        material: row.original.material,
        specification: row.original.specification,
        group: row.original.group,
        purchaseLeadTime: row.original.purchaseLeadTime,
        manufacturingLeadTime: row.original.manufacturingLeadTime,
        weight: row.original.weight,
        safetyStock: row.original.safetyStock,
        stockingUom: row.original.stockingUom,
        cubicVolumn: row.original.cubicVolumn,
        lenght: row.original.lenght,
        width: row.original.width,
        height: row.original.height,
        standardCost: row.original.standardCost,
        averageCost: row.original.averageCost,
        defualtLocation: row.original.defualtLocation,
        combineMtFlag: row.original.combineMtFlag,
        lotControlFlag: row.original.lotControlFlag,
        shefLifeDay: row.original.shefLifeDay,
        specialInstruction: row.original.specialInstruction,
        alternateUom: row.original.alternateUom,
        convertFactor: row.original.convertFactor,
        itemType: row.original.itemType?.name,
        location: row.original.location?.name,
        itemGroup: row.original.itemGroup?.name,
      }
    })

    console.log('export data', rowData)

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
