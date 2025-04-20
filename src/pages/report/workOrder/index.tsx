import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import { useContext, useEffect, useState } from 'react'
import { DataTable } from './components/dataTable'
import { columns } from './components/columns'
import { WorkOrderReport } from './components/schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PageHeader } from '@/components/layouts/header'
import { IconReport } from '@tabler/icons-react'
import {
  getWorkOrderReport,
} from '@/services/reportApi'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/custom/button'
import { CalendarIcon, Check, ChevronsUpDownIcon } from 'lucide-react'
import { ItemType } from '@/pages/master/item/components/type'
import { getItem } from '@/services/itemApi'
import { WorkOrderType } from '@/pages/workOrder/components/type'
import { getWorkOrder } from '@/services/workOrderApi'

const currentDate = new Date()

const FormSchema = z.object({
  fromDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  toDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  selectedItemmaster: z.string().min(1),
  itemMasterId: z.number(), 
  woCode: z.string(),
})

export default function WorkOrderReports() {
  const [data, setData] = useState<WorkOrderReport[]>([])
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [workOrders, setWorkOrder] = useState<WorkOrderType[]>([])

  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const getData = (
    fromDate: string,
    toDate: string,
    productId: number,    
    woCode: string
  ) => {
    console.log('get work order Report:', fromDate, toDate, productId)

    getWorkOrderReport(
      fromDate,
      toDate,
      productId,
      woCode
    ).then((data) => {
      console.log('get work order Report:', data)
      setData(data)
      setRefresh(false)
    })
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    getData(
      format(data.fromDate, 'yyyy-MM-dd').toString(),
      format(data.toDate, 'yyyy-MM-dd').toString(),
      data.itemMasterId,
      data.woCode
    )
  }

  useEffect(() => {
    getItem().then((data) => setItemMaster(data))
    getWorkOrder().then((data) => setWorkOrder(data))

    getData(
      format(currentDate, 'yyyy-MM-dd').toString(),
      format(currentDate, 'yyyy-MM-dd').toString(),
      0,
      ''
    )
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Work Order Report'
          icon={<IconReport size={45} className='mt-2 ' />}
        />
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid gap-4'>
                <div className='grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <FormField
                    control={form.control}
                    name='fromDate'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel className='mr-2'>From Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal sm:w-[220px] md:w-[300px]',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='toDate'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel className='mr-3'>To Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal sm:w-[220px] md:w-[300px]',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='woCode'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel className='mr-3'>WO-Code</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'bg-forefround hover:bg-forefround justify-between sm:w-[220px] md:w-[300px]',
                                  !field.value &&
                                    'text-muted-foreground sm:w-[220px] md:w-[300px]'
                                )}
                              >
                                {field.value
                                  ? workOrders.find(
                                      (item) => item.code === field.value
                                    )?.code
                                  : 'Select Work orderCode'}
                                <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[250px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search Work order...' />
                              <CommandList>
                                <CommandEmpty>
                                  No Work order found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {workOrders.map((item) => (
                                    <CommandItem
                                      value={item.code}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('woCode', item.code)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.code === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {item.code}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='selectedItemmaster'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel className='mr-3'>Item Master</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'bg-forefround hover:bg-forefround justify-between sm:w-[220px] md:w-[300px]',
                                  !field.value &&
                                    'text-muted-foreground sm:w-[220px] md:w-[300px]'
                                )}
                              >
                                {field.value
                                  ? itemMaster.find(
                                      (item) => item.name === field.value
                                    )?.name
                                  : 'Select Item master'}
                                <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[250px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search Item master...' />
                              <CommandList>
                                <CommandEmpty>
                                  No Item master found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {itemMaster.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'selectedItemmaster',
                                          item.name
                                        )
                                        form.setValue(
                                          'itemMasterId',
                                          parseInt(item.id)
                                        )
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.name === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {item.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  
                  <div className='py-6'>
                    <Button className=' w-auto' type='submit'>
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={data} columns={columns} />
          <br></br>
        </div>
      </LayoutBody>
    </Layout>
  )
}
