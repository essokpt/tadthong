import { SyntheticEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
//import { MaterilalType } from './type'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getVenders } from '@/services/vendersApi'
import { Venders } from '@/pages/master/vender/components/schema'
import { CalendarIcon } from 'lucide-react'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { CreateModal } from './create-modal'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { createPurchaseRequest } from '@/services/purchaseRequestApi'
//interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

type ItemList = {
  itemMasterId: string
  code: string
  desc: string
  quantity: number
  price: number
  amount: number
}

const initalValue = {
  itemMasterId: '0',
  code: '',
  desc: '',
  quantity: 0,
  price: 0,
  amount: 0,
}

const formSchema = z.object({
  selectVender: z.string(),
  code: z.string(),
  description: z.string(),
  remark: z.string(),
  status: z.string(),
  date: z.date({
    required_error: 'A date of birth is required.',
  }),
})

export function PRForm() {
  const [items, setItem] = useState<ItemList[]>([])
  const [editValue, setEditValue] = useState<ItemList>(initalValue)
  const [venders, setVender] = useState<Venders[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [subTotal, setSubTotal] = useState(0)
  const [vat, setVat] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)

  const navigate = useNavigate()
  // const { handleSubmit, register, setValue } = useForm()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectVender: '',
      status: 'New',
    },
  })

  function handleChangeDiscount(e: ChangeEvent<HTMLInputElement>) {
    setDiscount(parseInt(e.target.value))
    setTotal(subTotal - parseInt(e.target.value))
    setGrandTotal(subTotal - parseInt(e.target.value) + (vat / 100) * subTotal)
    //console.log('handleChangePrice value', editData)
    // updatePrice()
  }

  function updatePrice() {
    setTotal(subTotal)
    setGrandTotal(total + (vat / 100) * subTotal)
  }

  function handleChangeVat(e: ChangeEvent<HTMLInputElement>) {
    const vat = parseInt(e.target.value)
    setVat(vat)
    //setGrandTotal(total + (vat/100 * subTotal))
    //console.log('handleChangePrice value', editData)
    updatePrice()
  }

  const calAmount = () => {
    let subtotal = 0
    for (let index = 0; index < items.length; index++) {
      subtotal = subtotal + items[index].amount
    }
    setSubTotal(subtotal)
    // setTotal(10000)
    // setGrandTotal(subtotal)
  }

  async function onSubmit(data: any) {
    setIsLoading(true)
    let today = new Date()
    const selectedVender: any = venders.find(
      (item) => item.code == data.selectVender
    )
    const userid: any = localStorage.getItem('userId')
    const branchid: any = localStorage.getItem('branchId')
    data.venderId = selectedVender.id
    data.companyId = 1
    data.userId = parseInt(userid)
    data.branchId = parseInt(branchid)
    data.requirmentDate = format(data.date, 'yyyy-MM-dd')
    data.createAt = format(today, 'yyyy-MM-dd')
    //data.userId = parseInt(userId)
    data.purchaseRequestItems = items
    console.log('onSubmit', data)

    const res: any = await createPurchaseRequest(data)
    if (res.status == 200) {
      console.log('createPurchaseRequest -success', res.status)
      navigate('/purchase-order', { replace: true })
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }
  function updateData(payload: any) {
    console.log('editData', payload)
    setEditValue(payload)
    setOpenModal(true)
  }

  function addNewItem() {
    // console.log('addNewData', payload)
    setEditValue({
      itemMasterId: '0',
      code: '',
      desc: '',
      quantity: 0,
      price: 0,
      amount: 0,
    })
    setOpenModal(true)
  }
  function addNewData(payload: any) {
    console.log('addNewData', payload)
    payload.quantity = payload.quantity
    payload.price = payload.price
    payload.amount = payload.quantity * payload.price

    const exitIndex = items.findIndex((item) => item.code == payload.code)
    if (exitIndex != -1) {
      items[exitIndex] = payload
    } else {
      items.push(payload)
    }
    calAmount()
    updatePrice()
  }

  useEffect(() => {
    setItem([])
    getVenders().then((data) => setVender(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Create Purchase Request
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>

        <Separator />
        <br />

        {/* <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-3', className)} {...props}>
            <div className='grid grid-cols-3 gap-2 '> */}
        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='general'>General Information</TabsTrigger>
            <TabsTrigger value='materiallist'>Item List</TabsTrigger>
          </TabsList>
          <TabsContent value='general'>
            <Card>
              <CardContent className='space-y-2'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid gap-4'>
                      <div className='grid grid-cols-3 gap-2'>
                        <FormField
                          control={form.control}
                          name='code'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='date'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Requirment Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={'outline'}
                                      className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, 'yyyy-MM-dd')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className='w-auto p-0'
                                  align='start'
                                >
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
                          name='selectVender'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Vender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a vender to this item' />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                  {venders.map((item) => (
                                    <SelectItem key={item.id} value={item.code}>
                                      {item.code} {item.companyName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='grid grid-cols-1 gap-2 '>
                        <FormField
                          control={form.control}
                          name='description'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
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
                            <FormItem>
                              <FormLabel>Condition</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Tell us a little bit about yourself'
                                  className='resize-none'
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid'>
                        <Button
                          type='submit'
                          variant='outline'
                          size='sm'
                          className='float-end mt-8  h-8 bg-primary'
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='materiallist'>
            <Card>
              <CardContent className='space-y-2'>
                <div className='grid gap-4'>
                  <Table>
                    <TableCaption>A list of your recent items.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[200px]'>Item Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell className='font-medium'>
                            {item.code}
                          </TableCell>
                          <TableCell>{item.desc}</TableCell>
                          <TableCell>
                            <TableCell>{item.quantity}</TableCell>
                          </TableCell>
                          <TableCell>
                            <TableCell>{item.price}</TableCell>
                          </TableCell>
                          <TableCell>{item.amount}</TableCell>
                          <TableCell>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full'
                              onClick={() => updateData(item)}
                            >
                              <IconEdit size={20} />
                            </Button>

                            <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full'
                              //onClick={() => deleteItemPrice(item.id)}
                            >
                              <IconTrash size={20} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-13 h-8 bg-primary'
                            onClick={addNewItem}
                          >
                            <PlusCircledIcon className='mr-2 h-4 w-4' />
                            Add Item
                          </Button>
                        </TableCell>
                        <TableCell colSpan={3} className='text-right'>
                          Sub Total
                        </TableCell>
                        <TableCell>{subTotal}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className='text-right'>
                          Discount
                        </TableCell>
                        <TableCell>
                          <Input
                            className='w-[80px]'
                            type='number'
                            // id={item.code}
                            defaultValue={discount}
                            onChange={handleChangeDiscount}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className='text-right'>
                          Total
                        </TableCell>
                        <TableCell>{total}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className='text-right'>
                          Vat
                        </TableCell>
                        <TableCell>
                          {' '}
                          <Input
                            className='w-[80px]'
                            type='number'
                            // id={item.code}
                            defaultValue={vat}
                            onChange={handleChangeVat}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell colSpan={4} className='text-right'>
                          Grand Total
                        </TableCell>
                        <TableCell>{grandTotal}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CreateModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addNewData(e)}
          editData={editValue}
        />
      </LayoutBody>
    </Layout>
  )
}
