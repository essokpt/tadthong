import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { getItemMaster } from '@/services/itemApi'
import { ItemType } from '@/pages/master/item/components/type'
import { VenderType } from '@/pages/master/vender/components/type'
import { getVenders } from '@/services/vendersApi'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import InputCurrency from '@/components/custom/inputCurrency'

// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
  editData: ItemList
}
type ItemList = {
  id: string
  itemMasterId: string
  code: string
  itemName: string
  venderId: string
  venderCode: string
  venderName: string
  quantity: number
  price: number
  amount: number
  specification: string
  total: number
  includeVat: number
  remark: string
}

const formSchema = z.object({
  id: z.string(),
  itemMasterId: z.string(),
  code: z.string(),
  itemName: z.string().min(1),
  venderId: z.string(),
  venderCode: z.string(),
  venderName: z.string().min(1),
  quantity: z.number().min(1),
  price: z.number().min(1),
  // amount: z.number(),
  specification: z.string(),
  // total: z.number(),
  // includeVat: z.number(),
  remark: z.string(),
})

export const CreateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
  editData,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [venders, setVender] = useState<VenderType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: editData,
  })

  // function handleChangeItem(e: ChangeEvent<HTMLSelectElement>) {
  //   setSelectItem(e.target.value)
  //   console.log('handleChangeItem', e.target.value)
  // }

  // function handleChangeVender(e: ChangeEvent<HTMLSelectElement>) {
  //   setSelectVender(e.target.value)
  //   console.log('handleChangeVender', e.target.value)
  // }

  async function addData(data: z.infer<typeof formSchema>) {
    console.log('add new item', data)
    createData(data)
    //form.reset()
    // onClose()
  }

  // function handleChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
  //   editData.quantity = parseInt(e.target.value)
  //   editData.total = editData.quantity * editData.price

  //   console.log('handleChangePrice value', editData)
  // }

  // function handleChangePrice(e: ChangeEvent<HTMLInputElement>) {
  //   editData.price = parseFloat(e.target.value)
  //   editData.total = editData.quantity * editData.price
  //   console.log('handleChangePrice value', editData)
  // }

  useEffect(() => {
    setIsMounted(true)
    getItemMaster().then((data) => setItemMaster(data))
    getVenders().then((data) => setVender(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addData)}>
                <div className='grid grid-cols-2 gap-2'>
                  {/* <FormField
                    control={form.control}
                    name='id'
                    render={({ field }) => (
                      <FormItem className='hidden space-y-1'>
                        <FormLabel>id</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name='itemName'
                    render={({ field }) => (
                      <FormItem className='mt-2 grid space-y-1.5 '>
                        <FormLabel>Item Master</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                // disabled={parseInt(editData.id) > 0}
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
                                  : 'Select item'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search item...' />
                              <CommandList>
                                <CommandEmpty>No item found.</CommandEmpty>
                                <CommandGroup>
                                  {itemMaster.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('itemName', item.name)
                                        form.setValue(
                                          'itemMasterId',
                                          item.id.toString()
                                        )
                                        form.setValue('code', item.code)
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
                    name='venderName'
                    render={({ field }) => (
                      <FormItem className='mt-2 grid space-y-1.5'>
                        <FormLabel>Vender</FormLabel>
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
                                  ? venders.find(
                                      (item) => item.companyName === field.value
                                    )?.companyName
                                  : 'Select vender'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search vender...' />
                              <CommandList>
                                <CommandEmpty>No vender found.</CommandEmpty>
                                <CommandGroup>
                                  {venders.map((item) => (
                                    <CommandItem
                                      value={item.companyName}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'venderName',
                                          item.companyName
                                        )
                                        form.setValue(
                                          'venderId',
                                          item.id.toString()
                                        )
                                        form.setValue('venderCode', item.code)
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

                  {/* <div className='grid'>
                  <Label>Item</Label>
                  <select
                    onChange={handleChangeItem}
                    className='mt-1 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={editData.code}
                    >
                      {editData.code}
                    </option>
                    {itemMaster.map((item) => (
                      <option
                        key={item.id}
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value={item.code}
                      >
                        {item.code}-{item.name}-({item.stockingUom})
                      </option>
                    ))}
                  </select>
                </div> */}

                  {/* <div className='grid'>
                  <Label>Vender</Label>
                  <select
                    onChange={handleChangeVender}
                    className='mt-1 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={editData.code}
                    >
                      {editData.code}
                    </option>
                    {venders.map((item) => (
                      <option
                        key={item.id}
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value={item.code}
                      >
                        {item.code}-{item.companyName}
                      </option>
                    ))}
                  </select>
                </div> */}

                  <FormField
                    control={form.control}
                    name='specification'
                    render={({ field }) => (
                      <FormItem className='col-span-2 space-y-1'>
                        <FormLabel>Specification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <div className='col-span-2 grid'>
                    <Label
                      className='py-1 text-[0.8rem] text-muted-foreground'
                      htmlFor='specification'
                    >
                      Specification
                    </Label>
                    <Input
                      className='text-[0.8rem]'
                      defaultValue={editData.specification}
                      {...register('specification')}
                    />
                  </div> */}
                  <InputCurrency
                    value={0}
                    label='Quantity'
                    name='quantity'
                    placeholder={'input quantity'}
                  />

                  <InputCurrency
                    value={0}
                    label='Unit Price(Baht)'
                    name='price'
                    placeholder={'input price'}
                  />

                  {/* <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(event) =>
                              field.onChange(parseFloat(event.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name='remark'
                    render={({ field }) => (
                      <FormItem className='col-span-2 space-y-1'>
                        <FormLabel>Remark</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <div className='grid'>
                    <Label
                      className='py-1 text-[0.8rem] text-muted-foreground'
                      htmlFor='Quantity'
                    >
                      Quantity
                    </Label>
                    <Input
                      className='text-[0.8rem]'
                      type='number'
                      defaultValue={editData.quantity}
                      onChange={handleChangeQuantity}
                    />
                  </div> */}
                  {/* <div className='grid'>
                    <Label
                      className='py-1 text-[0.8rem] text-muted-foreground'
                      htmlFor='Price'
                    >
                      Unit Price
                    </Label>
                    <Input
                      className='text-[0.8rem]'
                      type='float'
                      defaultValue={editData.price}
                      onChange={handleChangePrice}
                    />
                  </div> */}
                  {/* <div className='grid'>
                    <Label
                      className='py-1 text-[0.8rem] text-muted-foreground'
                      htmlFor='remark'
                    >
                      Remark
                    </Label>
                    <Input
                      className='text-[0.8rem]'
                      defaultValue={editData.remark}
                      {...register('remark')}
                    />
                  </div> */}
                </div>
                <br />
                <DialogFooter>
                  <Button
                    variant='button'
                    loading={loading}
                    type='submit'
                    className='float-end w-[10rem]'
                  >
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
