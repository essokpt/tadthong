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
  editble: boolean
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
    companyName: z.string(),
  }),
  itemMaster: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
  }),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  editble,
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
                        readOnly={editble}
                        className='hidden'
                        {...form.register('id')}
                        defaultValue={data.id}
                      />
                      <Input
                        readOnly={editble}
                        className='hidden'
                        {...form.register('userId')}
                        defaultValue={data.userId}
                      />
                      <Input
                        readOnly={editble}
                        className='hidden'
                        {...form.register('customerId')}
                        defaultValue={data.customerId}
                      />
                      <Input
                        readOnly={editble}
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
                              <Input readOnly={editble} {...field} />
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
                              <Input readOnly={editble} {...field} />
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
                                            form.setValue('itemMaster', {
                                              id: parseInt(item.id),
                                              code: item.code,
                                              name: item.name,
                                            })
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
                                            form.setValue('customer', {
                                              id: item.id,
                                              code: item.code,
                                              companyName: item.companyName,
                                            })
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
                                readOnly={editble}
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
                              <Input readOnly={editble} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <br></br>
                    </div>
                  
                  </CardContent>
                </Card>

                <br />
                <DialogFooter>
                  <Button 
                  disabled={!editble}
                  loading={onloading} type='submit' variant='button'>
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
