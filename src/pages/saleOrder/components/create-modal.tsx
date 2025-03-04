'use client'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { z } from 'zod'
import { getItemMaster } from '@/services/itemApi'
import { ItemType } from '@/pages/master/item/components/type'
import { ItemList } from './type'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'

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

const formSchema = z.object({
  id: z.number(),
  selectedItemMaster: z.string(),
  itemMasterId: z.string(),
  itemMaster: z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
  }),
  saleOrderId: z.number(),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
  underCutPrice: z.number(),
  cuttingWeight: z.number(),
  afterCutPrice: z.number(),
  afterCutQuantity: z.number(),
  afterAmount: z.number(),
  sourceHumidity: z.number(),
  destinationHumidity: z.number(),
  destinationWeighingScale: z.string(),
  remark: z.string(),
  uomType: z.string(),
  humidity: z.number(),
  adulteration: z.number(),
  other: z.number(),
  weighingMoney: z.number(),
  shipDown: z.number(),
  cashOther: z.number(),
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
 // const [uomList, setUomList] = useState<ItemType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    //resolver: zodResolver(formSchema),
    values: editData,
    mode: 'onChange',
  })

  async function addData(data: any) {
    console.log('find new item', data)
    const exitIndex = itemMaster.find((item) => item.code == data.itemMasterId)
    if (exitIndex) {
      data.itemMaster = exitIndex
      data.itemMasterId = exitIndex.id
    }
    console.log('find new item', exitIndex)
    createData(data)
    form.reset()
    onClose()
  }

  // function handleChangeItem(e: ChangeEvent<HTMLSelectElement>) {

  //   const newitem: any = itemMaster.find((item) => item.id == e.target.value)
  //   form.setValue('itemMaster', newitem)
  //   form.setValue('itemMasterId', e.target.value)
  //   console.log('handleChangeItem value', e.target.value)
  // }

  function handleChangeCutQty(item: any) {
    // after amount = (CustomerWeight - CuttingWeight) x AfterCutPrice
    console.log('handleChangeCutQty', item.target.value)
    let qty = form.getValues('quantity')
    let sumAfterQty = qty - parseInt(item.target.value)
    form.setValue('afterCutQuantity', sumAfterQty)
    sumAfterAmount()
  }

  function handleChangeQuantity(item: any) {
    console.log('handleChangeQuantity', item.target.value)
    let price = form.getValues('unitPrice')
    let sumAmount = price * parseInt(item.target.value)
    form.setValue('amount', sumAmount)
    let cuttingQty = form.getValues('cuttingWeight')
    let sumAfterQty =
      cuttingQty > 0 ? parseInt(item.target.value) - cuttingQty : 0
    form.setValue('afterCutQuantity', sumAfterQty)
    //sumAfterAmount(sumAfterQty, 'qty')
  }

  function handleChangeUnitPrice(item: any) {
    console.log('handleChangeUnitPrice', item.target.value)
    let qty = form.getValues('quantity')
    let sumAmount = qty * parseInt(item.target.value)
    form.setValue('amount', sumAmount)
    let cutting = form.getValues('underCutPrice')
    let sumAfterprice = cutting > 0 ? parseInt(item.target.value) - cutting : 0
    form.setValue('afterCutPrice', sumAfterprice)
    //sumAfterAmount(sumAfterprice, 'price')
  }

  function handleChangeCustomerQty() {
    // console.log('handleChangeCustomerQty', value.target.value) adulteration
    let qty = form.getValues('quantity')
    let humidity = form.getValues('humidity')
    let adulteration = form.getValues('adulteration')
    let other = form.getValues('other')

    let sumAmount = qty - humidity - adulteration - other
    form.setValue('cuttingWeight', sumAmount)
    sumAfterAmount()
  }
  function handleChangeCustomerPrice() {
    // console.log('handleChangeCustomerQty', value.target.value) adulteration
    let unitPrice = form.getValues('unitPrice')
    let weighingMoney = form.getValues('weighingMoney')
    let shipDown = form.getValues('shipDown')
    let cashOther = form.getValues('cashOther')

    let sumAmount = unitPrice - weighingMoney - shipDown - cashOther
    form.setValue('underCutPrice', sumAmount)

    sumAfterAmount()
  }

  function handleChangeCutPrice(item: any) {
    console.log('handleChangeCutPrice', item.target.value)
    let price = form.getValues('unitPrice')
    let sumAmount = price - parseInt(item.target.value)
    form.setValue('afterCutPrice', sumAmount)

    sumAfterAmount()
  }

  function sumAfterAmount() {
    //let sumAfterAmount = 0
    // if (type == 'qty') {
    //   let price = form.getValues('afterCutPrice')
    //   sumAfterAmount = price * item
    // } else {
    //   let qty = form.getValues('afterCutQuantity')
    //   sumAfterAmount = item * qty
    // }

    let customerQty = form.getValues('cuttingWeight')
    let customerPrice = form.getValues('underCutPrice')

    form.setValue('afterAmount', customerQty * customerPrice)
  }

  useEffect(() => {
    setIsMounted(true)
    getItemMaster().then((data) => setItemMaster(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md h-screen  overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Item Detail</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addData)}>
                <div className='grid grid-cols-2 gap-2 '>
                  <FormField
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
                  />

                  <FormField
                    control={form.control}
                    name='selectedItemMaster'
                    render={({ field }) => (
                      <FormItem className='col-span-3 mt-2 grid space-y-1.5'>
                        {/* <FormLabel>Item Master</FormLabel> */}
                        <FormLabel>สินค้า</FormLabel>
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
                          <PopoverContent className='w-[250px] p-0'>
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
                                          'selectedItemMaster',
                                          item.name
                                        )
                                        form.setValue('itemMaster', item)
                                        form.setValue('itemMasterId', item.id)
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
                    name='uomType'
                    render={({ field }) => (
                      <FormItem className='space-y-1 '>
                        <FormLabel>UOM Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a uom type'>
                                {field.value}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            /<SelectItem value='New'>New</SelectItem>
                            <SelectItem value='Active'>Active</SelectItem>
                            <SelectItem value='Inactive'>Inactive</SelectItem>
                            <SelectItem value='None'>None</SelectItem>
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
                        {/* <FormLabel>Quantity</FormLabel> */}
                        <FormLabel>จำนวน</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeQuantity(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='unitPrice'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Unit Price</FormLabel> */}
                        <FormLabel>ราคาต่อหน่วย</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeUnitPrice(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Amount</FormLabel> */}
                        <FormLabel>มูลค่า</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='humidity'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Humidity</FormLabel> */}
                        <FormLabel>หักความชื้น</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            //onChange={handleChangeCustomerQty}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCustomerQty()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='weighingMoney'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Weighing Money</FormLabel> */}
                        <FormLabel>หักเงินค่าชั่ง</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCustomerPrice()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
<div className='grid'></div>
                  <FormField
                    control={form.control}
                    name='adulteration'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Adulteration</FormLabel> */}
                        <FormLabel>หักเจือปน</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCustomerQty()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

<FormField
                    control={form.control}
                    name='shipDown'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>ShipDown</FormLabel> */}
                        <FormLabel>หักค่าลง</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCustomerPrice()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid'></div>

                  <FormField
                    control={form.control}
                    name='other'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Other</FormLabel> */}
                        <FormLabel>หักอื่นๆ</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCustomerQty()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
             

                  <FormField
                    control={form.control}
                    name='cashOther'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Cash Other</FormLabel> */}
                        <FormLabel>หักเงินอื่นๆ</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCustomerPrice()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

<div className='grid'></div>             

                  <FormField
                    control={form.control}
                    name='cuttingWeight'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Customer Quantity</FormLabel> */}
                        <FormLabel>จำนวนลูกค้า</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCutQty(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='underCutPrice'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Customer Price</FormLabel> */}
                        <FormLabel>ราคาลูกค้า</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChangeCutPrice(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='afterAmount'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Customer Amount</FormLabel> */}
                        <FormLabel>มูลค่าลูกค้า</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               

                  <FormField
                    control={form.control}
                    name='afterCutQuantity'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Different Quantity</FormLabel> */}
                        <FormLabel>ผลต่างจำนวน</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='afterCutPrice'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Different Price</FormLabel> */}
                        <FormLabel>ผลต่างราคา</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

<div className='grid'></div>     

                  <FormField
                    control={form.control}
                    name='sourceHumidity'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Source Humidity</FormLabel> */}
                        <FormLabel>ความชื้นต้นทาง</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='destinationHumidity'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Customer Humidity</FormLabel> */}
                        <FormLabel>ความชื้นลูกค้า</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='destinationWeighingScale'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        {/* <FormLabel>Customer Queue No.</FormLabel> */}
                        <FormLabel>เลขใบชั่งลูกค้า</FormLabel>
                        <FormControl>
                          <Input {...field} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='remark'
                    render={({ field }) => (
                      <FormItem className='col-span-3 space-y-1'>
                        {/* <FormLabel>Remark</FormLabel> */}
                        <FormLabel>หมายเหตุ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <br></br>
                <Button
                  loading={loading}
                  type='submit'
                  className='float-end'
                  variant='button'
                >
                  Save changes
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
