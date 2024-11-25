import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatDate } from 'date-fns'
import { Textarea } from '@/components/ui/textarea'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'

import { getCustomer } from '@/services/customerApi'
import { CustomerType } from '@/pages/master/customer/components/type'
import { createSaleOrder } from '@/services/saleOrderApi'
import { CreateModal } from './create-modal'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
//interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

type ItemList = {
  id : number
  itemMasterId : number
  itemMaster : {
    id: string
    code: string
    name: string
  }
  saleOrderId : number
  quantity : number
  unitPrice : number
  amount : number
  underCutPrice : number
  cuttingWeight : number
  afterCutPrice : number
  afterCutQuantity : number
  afterAmount : number
  sourceHumidity : number
  destinationHumidity : number
  destinationWeighingScale : string
  remark : string
}

const initalValue = {
  id : 0,
  itemMasterId : 0,
  itemMaster : {
    id: '',
    code: '',
    name: '',
  },
  saleOrderId : 0,
  quantity : 0,
  unitPrice : 0,
  amount : 0,
  underCutPrice : 0,
  cuttingWeight : 0,
  afterCutPrice : 0,
  afterCutQuantity : 0,
  afterAmount : 0,
  sourceHumidity : 0,
  destinationHumidity : 0,
  destinationWeighingScale : '',
  remark : '',
}

const formSchema = z.object({
  code: z.string(),
  cause: z.string().min(0),
  poNumber: z.string(),
  carRegistration: z.string(),
  driverName: z.string(),
  userId: z.number(),
  // vat: z.number(),
  // amount : z.number(),
  selectLocation: z.string(),
  selectCustomer: z.string(),
  remark: z.string().min(0),
  status: z.string(),
  createAt: z.string(),
  createBy: z.string(),
})

export function InvoiceForm() {
  const [items, setItem] = useState<ItemList[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [locations, setLocation] = useState<LocationType[]>([])
  const [customers, setCustomer] = useState<CustomerType[]>([])  
  const [editValue, setEditValue] = useState<ItemList>(initalValue)
  const [isLoading, setIsLoading] = useState(false)
  //const [openModal, setOpenModal] = useState(false)

  const navigate = useNavigate()
  let today = new Date()
  let user: any = localStorage.getItem('user')
  let userid: any = localStorage.getItem('userId')
  let dateCode = formatDate(today, 'yyyy-MM-dd')
  let newCode = dateCode.split('-')
  // const { handleSubmit, register, setValue } = useForm()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cause: '',
      //selectLocation: '1',
      code: 'SO' + newCode[0] + newCode[1] + newCode[2],
      createBy: user,
      userId: parseInt(userid),
      createAt: formatDate(today, 'yyyy-MM-dd'),
      status: 'New SaleOrder',
      remark: '',
    },
  })

  async function onSubmit(data: any) {
    //setIsLoading(true)
    const selectedLocation: any = locations.find(
      (item) => item.name == data.selectLocation
    )
    const selectedCustomer: any = customers.find(
      (item) => item.code == data.selectCustomer
    )
    data.customerId = selectedCustomer.id
    data.locationId = selectedLocation.id

    data.saleOrderItems = items
    console.log('onSubmit', data)

    const res: any = await createSaleOrder(data)
    if (res.status == 200) {
      console.log('createSaleOrder -success', res.status)
      setTimeout(() => {
        setEditValue(initalValue)
        setIsLoading(false)
        navigate('/saleOrder', { replace: true })
      }, 2000)
    }
  }
  

  // function addNewItem() {
  //   // console.log('addNewData', payload)
  //   setEditValue({
  //     id: '',
  //     venderId: '',
  //     venderCode: '',
  //     venderName: '',
  //     itemMasterId: '0',
  //     code: '',
  //     itemName: '',
  //     quantity: 0,
  //     price: 0,
  //     amount: 0,
  //     total: 0,
  //     includeVat: 0,
  //     specification: '',
  //     remark: '',
  //   })
  //   setOpenModal(true)
  // }

  function addNewData(payload: any) {
    console.log('addNewData', payload)
    const exitIndex = items.findIndex((item) => item.itemMasterId == payload.itemMasterId)
    if (exitIndex != -1) {
      items[exitIndex] = payload
    } else {
      items.push(payload)
    }
    
   
  }

  useEffect(() => {
    setItem([])
    getCustomer().then((data) => setCustomer(data))
    getLocation().then((data) => setLocation(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        
        <PageHeader
          label='Create Purchase Request'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />

        <Separator />
        <br />

        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='general'>General Information</TabsTrigger>
            <TabsTrigger value='itemlist'>Item List</TabsTrigger>
          </TabsList>
          <TabsContent value='general'>
            <Card>
              <CardContent className='space-y-2'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid gap-4'>
                      <div className='grid grid-cols-2 gap-2'>
                        <FormField
                          control={form.control}
                          name='createAt'
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
                          name='selectLocation'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Location</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a location to this item' />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                  {locations.map((item) => (
                                    <SelectItem key={item.id} value={item.name}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='createBy'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Request By</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='code'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Code</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='selectCustomer'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Customer</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select a item to this item' />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                  {customers.map((item) => (
                                    <SelectItem key={item.id} value={item.code}>
                                      {item.code} - {item.companyName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='poNumber'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>PO Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='carRegistration'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Car Registration</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='driverName'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Driver Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='status'
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='cause'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cause</FormLabel>
                              <FormControl>
                                <Textarea className='resize-none' {...field} />
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
                              <FormLabel>Remark</FormLabel>
                              <FormControl>
                                <Textarea className='resize-none' {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                     
                      </div>

                      <div className='grid'>
                        <Button
                          loading={isLoading}
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
          <TabsContent value='itemlist'>
            <Card>
              <CardContent className='h-[35rem] space-y-2 overflow-scroll'>
                <div className='grid gap-4 '>
                  <Table className='overflow-scroll'>
                    <TableCaption>A list of your recent items.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UnderCutPrice</TableHead>

                        <TableHead>CuttingWeight</TableHead>
                        <TableHead>AfterCutPrice</TableHead>
                        <TableHead>AfterCutQuantity</TableHead>
                        <TableHead>AfterAmount</TableHead>

                        <TableHead>SourceHumidity</TableHead>
                        <TableHead>DestinationHumidity</TableHead>
                        <TableHead>DestinationWeighingScale</TableHead>                       
                        <TableHead className='items-center'>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className='font-medium'>
                            {item.itemMaster?.code}
                          </TableCell>
                          <TableCell>{item.itemMaster?.name}</TableCell>
                          <TableCell>-</TableCell>                          
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitPrice}</TableCell>
                          <TableCell>{item.amount}</TableCell>
                          <TableCell>{item.underCutPrice}</TableCell>

                          <TableCell>{item.cuttingWeight}</TableCell>
                          <TableCell>{item.afterCutPrice}</TableCell>
                          <TableCell>{item.afterCutQuantity}</TableCell>
                          <TableCell>{item.afterAmount}</TableCell>

                          <TableCell>{item.sourceHumidity}</TableCell>
                          <TableCell>{item.destinationHumidity}</TableCell>
                          <TableCell>{item.destinationWeighingScale}</TableCell>
                          <TableCell className='w-[8rem]'>
                           

                            <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full'
                              // onClick={() => deleteItem(item)}
                            >
                              {/* <IconTrash size={20} /> */}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={10} className='text-right'>
                          <Button loading={false} onClick={()=> setOpenModal(true)}>
                            {/* <IconRefresh size={20} /> */}
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </LayoutBody>
      <CreateModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addNewData(e)}
           editData={editValue}
        />
    </Layout>
  )
}
