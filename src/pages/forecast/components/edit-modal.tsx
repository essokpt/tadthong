// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ItemType } from '@/pages/master/item/components/type'
import { getItemMaster } from '@/services/itemApi'
import { getCustomer } from '@/services/customerApi'
import { CustomerType } from '@/pages/master/customer/components/type'
import { Forecast } from './schema'
import { updateForecast } from '@/services/forecastApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Forecast
}

const formSchema = z.object({
  id: z.number(),
  itemMasterId: z.number(),
  customerId: z.number(),
  planDate: z.string(),
  quantity: z.number().min(1),
  userId: z.number(),
  // selectedItemmaster: z.string(),
  // selectedCustomer: z.string(),
  createBy: z.string(),
  remark: z.string().min(0),
 
  customer: z.object({
    id: z.number(),
    code: z.string(),
    companyName: z.string()
  }),
  itemMaster: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string()
  }),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const { handleSubmit, register, setValue } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [items, setItems] = useState<ItemType[]>([])
  const [customers, setCustomer] = useState<CustomerType[]>([])

  const { setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: data,      
  })

  async function updateData(payload: any) {
    console.log('updateData', payload)
    setOnloading(true)
    const res: any = await updateForecast(payload)

    if (res.status == 200) {
      console.log('updateForecast completed')
    }

    setTimeout(() => {
      setOnloading(false)
      onClose()
      setRefresh(true)
    }, 1000)
  }

  
  useEffect(() => {
    setIsMounted(true)
    getItemMaster().then((data) => setItems(data))
    getCustomer().then((data) => setCustomer(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen h-full overflow-scroll '>
          <DialogHeader>
            <DialogTitle>Edit Forecast</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4 '>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(updateData)}>
                <Card>
                  <CardContent className='h-[30rem] space-y-2 '>
                    <div className='mb-3 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 '>
                    <Input
                      className='hidden'
                      {...form.register('id')}
                      defaultValue={data.id}
                    />
                    <Input
                      className='hidden'
                      {...form.register('userId')}
                      defaultValue={data.userId}
                    />
                    <Input
                      className='hidden'
                      {...form.register('customerId')}
                      defaultValue={data.customerId}
                    />
                    <Input
                      className='hidden'
                      {...form.register('itemMasterId')}
                      defaultValue={data.itemMasterId}
                    />
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
                        name='itemMaster.name'
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
                                      ? items.find(
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
                                      {items.map((item) => (
                                        <CommandItem
                                          value={item.name}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'itemMaster',
                                              { id : parseInt(item.id),
                                                code : item.code,
                                                name : item.name
                                              }
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

                     
                      <FormField
                        control={form.control}
                        name='customer.companyName'
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
                                          (item) =>
                                            item.companyName === field.value
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
                                    <CommandEmpty>
                                      No customer found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {customers.map((item) => (
                                        <CommandItem
                                          value={item.companyName}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'customer',
                                              {
                                                id: item.id,
                                                code: item.code,
                                                companyName : item.companyName
                                              }
                                            
                                            )
                                            form.setValue('customerId', item.id)
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

                  
                      <FormField
                        control={form.control}
                        name='quantity'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(event) =>
                                  field.onChange(parseFloat(event.target.value))
                                }
                              />
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
                    </div>
                    {/* <div className='grid grid-cols-2 gap-2 '>
                    <Input
                      className='hidden'
                      {...register('id')}
                      defaultValue={data.id}
                    />
                    <Input
                      className='hidden'
                      {...register('userId')}
                      defaultValue={data.userId}
                    />
                    <Input
                      className='hidden'
                      {...register('customerId')}
                      defaultValue={data.customerId}
                    />
                    <Input
                      className='hidden'
                      {...register('itemMasterId')}
                      defaultValue={data.itemMasterId}
                    />

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='planDate'
                      >
                        Create Date
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        readOnly
                        defaultValue={data.planDate}
                        {...register('planDate')}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='itemMasterId'
                      >
                        Create By
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        readOnly
                        defaultValue={data.user?.firstName}
                      />
                    </div>

                    
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='location'
                      >
                        Item Master
                      </Label>
                      <select
                        id={data.itemMaster.code}
                        onChange={handleChangeItem}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                         
                        >
                          <p>*</p> {data.itemMaster.code}-{data.itemMaster.name}
                        </option>
                        {items.map((item) => (
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value={item.id}
                          >
                            {item.code}-{item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    
                     <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='customer'
                      >
                        Customer
                      </Label>
                      <select
                        id={data.itemMaster.code}
                        onChange={handleChangeCustomer}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value={data.customer.id}
                        >
                          <p>*</p> {data.customer.code}-
                          {data.customer.companyName}
                        </option>
                        {customers.map((item) => (
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value={item.id}
                          >
                            {item.code}-{item.companyName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='quantity'
                      >
                        Quantity
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        type='number'
                        defaultValue={data.quantity}
                        {...register('quantity')}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='remark'
                      >
                        Remark
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('remark')}
                        defaultValue={data.remark}
                      />
                    </div>
                  </div> */}
                  </CardContent>
                </Card>

                <br />
                <DialogFooter>
                  <Button loading={onloading} type='submit' variant='button'>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
