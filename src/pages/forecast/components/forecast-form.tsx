import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate } from 'date-fns'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { getItemMaster } from '@/services/itemApi'
import { ItemType } from '@/pages/master/item/components/type'
import { CustomerType } from '@/pages/master/customer/components/type'
import { getCustomer } from '@/services/customerApi'
import { createForecast } from '@/services/forecastApi'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
import { Check, ChevronsUpDown } from 'lucide-react'
interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  itemMasterId: z.number(),
  customerId: z.number(),
  planDate: z.string(),
  quantity: z.string().min(1),
  userId: z.string(),
  selectedItemmaster: z.string().min(1),
  selectedCustomer: z.string().min(1),
  createBy: z.string(),
  remark: z.string().min(0),
})

export function ForecastForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [customers, setCustomer] = useState<CustomerType[]>([])
  let today = new Date()
  let user: any = localStorage.getItem('user')
  let userId: any = localStorage.getItem('userId')

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemMasterId: 0,
      customerId: 0,
      planDate: formatDate(today, 'yyyy-MM-dd'),
      quantity: '',
      createBy: user,
      userId: userId,     
      remark: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // const itemId: any = itemMaster.find(
    //   (item) => item.name == data.selectedItemmaster
    // )
    // const cusId: any = customers.find(
    //   (item) => item.code == data.selectedCustomer
    // )
    // data.itemMasterId = itemId.id
    //data.customerId = cusId.id

    console.log('create forecast', data)

    const respone: any = await createForecast(data)
    console.log('respone', respone)
    if (respone.status == 200) {
      setIsLoading(false)
      navigate('/forecast', { replace: true })
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    getCustomer().then((data) => setCustomer(data))
    getItemMaster().then((data) => setItemMaster(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Forecast'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-3 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <FormField
                    control={form.control}
                    name='planDate'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Create Date</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='createBy'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Create By</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='selectedItemmaster'
                    render={({ field }) => (
                      <FormItem className='mt-3 grid space-y-3'>
                        <FormLabel>Item Master</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? itemMaster.find(
                                      (item) => item.name === field.value
                                    )?.name
                                  : 'Select item master'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search item master...' />
                              <CommandList>
                                <CommandEmpty>
                                  No item master found.
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

                  {/* <FormField
                    control={form.control}
                    name='selectedItemmaster'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Master</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a item master' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {itemMaster?.map((item) => (
                              <SelectItem key={item.id} value={item.code}>
                                {item.code}-{item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name='selectedCustomer'
                    render={({ field }) => (
                      <FormItem className='mt-3 grid space-y-3'>
                        <FormLabel>Customer</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? customers.find(
                                      (item) => item.companyName === field.value
                                    )?.companyName
                                  : 'Select customer'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search customer...' />
                              <CommandList>
                                <CommandEmpty>No customer found.</CommandEmpty>
                                <CommandGroup>
                                  {customers.map((item) => (
                                    <CommandItem
                                      value={item.companyName}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'selectedCustomer',
                                          item.companyName
                                        )
                                        form.setValue(
                                          'customerId',
                                          item.id
                                        )
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.companyName === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {item.companyName}
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

                  {/* <FormField
                    control={form.control}
                    name='selectedCustomer'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a Customer' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {customers?.map((item) => (
                              <SelectItem key={item.id} value={item.code}>
                                {item.code}-{item.companyName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name='quantity'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='remark'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Remark</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <br></br>
                  <Button
                    className='col-span-2 mt-5'
                    loading={isLoading}
                    type='submit'
                    variant='button'
                  >
                    Create
                  </Button>
                  <div></div>
                </div>
              </form>
            </Form>
            <br />
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
