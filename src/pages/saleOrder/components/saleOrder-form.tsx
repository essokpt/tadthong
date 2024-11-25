import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatDate } from 'date-fns'
import { Textarea } from '@/components/ui/textarea'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'

import { getCustomer } from '@/services/customerApi'
import { CustomerType } from '@/pages/master/customer/components/type'
import { createSaleOrder, uploadFiles } from '@/services/saleOrderApi'
import { CreateModal } from './create-modal'
import FileDrag from '@/components/custom/fileDrag'
import {
  IconChecklist,
  IconEdit,
  IconFile,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

type ItemList = {
  id: number
  itemMasterId: string
  selectedItemMaster: string
  itemMaster: {
    id: string
    code: string
    name: string
  }
  saleOrderId: number
  quantity: number
  unitPrice: number
  amount: number
  underCutPrice: number
  cuttingWeight: number
  afterCutPrice: number
  afterCutQuantity: number
  afterAmount: number
  sourceHumidity: number
  destinationHumidity: number
  destinationWeighingScale: string
  remark: string
  humidity: number
  adulteration: number
  other: number
  weighingMoney: number
  shipDown: number
  cashOther: number
}

const initalValue = {
  id: 0,
  itemMasterId: '0',
  selectedItemMaster: '',
  itemMaster: {
    id: '',
    code: '',
    name: '',
  },
  saleOrderId: 0,
  quantity: 0,
  unitPrice: 0,
  amount: 0,
  underCutPrice: 0,
  cuttingWeight: 0,
  afterCutPrice: 0,
  afterCutQuantity: 0,
  afterAmount: 0,
  sourceHumidity: 0,
  destinationHumidity: 0,
  destinationWeighingScale: '',
  remark: '',
  humidity: 0,
  adulteration: 0,
  other: 0,
  weighingMoney: 0,
  shipDown: 0,
  cashOther: 0,
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

export function SaleOrderForm() {
  const [items, setItem] = useState<ItemList[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [locations, setLocation] = useState<LocationType[]>([])
  const [customers, setCustomer] = useState<CustomerType[]>([])
  const [editValue, setEditValue] = useState<ItemList>(initalValue)
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>()

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
    setIsLoading(true)
    const selectedLocation: any = locations.find(
      (item) => item.name == data.selectLocation
    )
    const selectedCustomer: any = customers.find(
      (item) => item.companyName == data.selectCustomer
    )
    data.customerId = selectedCustomer.id
    data.locationId = selectedLocation.id
    data.saleOrderItems = items
    data.files = files

    console.log('createSaleOrder data', data)

    const respone: any = await createSaleOrder(data)

    if (respone.id) {
      console.log('createSaleOrder -success', respone.status)
      if (files) {
        const formData = new FormData()
        for (let i = 0; i < data.files?.length; i++) {
          formData.append('files', data.files[i])
          formData.append('SaleOrderId', respone.id)
        }

        const res: any = await uploadFiles(formData)
        if (res.status == 200) {
          console.log('uploadFiles -success', res.status)
        }
      }

      setTimeout(() => {
        setEditValue(initalValue)
        setIsLoading(false)
        navigate('/saleOrder', { replace: true })
      }, 1000)
    }
  }

  function editItem(item: any) {
    console.log('edit item:', item)
    setEditValue(item)
    setOpenModal(true)
  }

  function deleteItem(item: any) {
    console.log('delete item:', item)

    const itemIndex = items.findIndex(
      (x) => x.itemMasterId == item.itemMasterId
    )
    if (itemIndex != -1) {
      setItem(items.filter((x) => x.itemMasterId != item.itemMasterId))
    }

    console.log('delete index:', itemIndex)
  }

  function addNewData(payload: any) {
    if (payload.itemMasterId) {
      console.log('addNewData', payload)
      const exitIndex = items.findIndex(
        (item) => item.itemMasterId == payload.itemMasterId
      )
      if (exitIndex != -1) {
        console.log('edit item', payload)
        items[exitIndex] = payload
      } else {
        //payload.itemMaster = exitIndex
        console.log('add new item', exitIndex)

        items.push(payload)
      }
    }
    setEditValue(initalValue)
  }

  function addFile(payload: any) {
    setFiles(payload)
    console.log('File data:', payload)
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
          label='Create Sale Order'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />

        <Separator />
        <br />

        <Card>
          <CardContent className='space-y-2'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='m-2 grid gap-4'>
                  <div className='mb-3  grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-2 mb-2  flex items-center'>
                      <IconInfoCircle />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        General Information.
                      </Label>
                    </div>
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
                        <FormItem className='mt-2 grid space-y-1.5'>
                          <FormLabel>Location</FormLabel>
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
                                    ? locations.find(
                                        (item) => item.name === field.value
                                      )?.name
                                    : 'Select location'}
                                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='Search location...' />
                                <CommandList>
                                  <CommandEmpty>
                                    No location found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {locations.map((item) => (
                                      <CommandItem
                                        value={item.name}
                                        key={item.id}
                                        onSelect={() => {
                                          form.setValue(
                                            'selectLocation',
                                            item.name
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
                        <FormItem className='mt-2 grid space-y-1.5'>
                          <FormLabel>Customers</FormLabel>
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
                                            'selectCustomer',
                                            item.companyName
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
                          <FormLabel>Queue No.</FormLabel>
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

                  <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-1 mb-2  flex items-center'>
                      <IconChecklist />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Items List.
                      </Label>
                    </div>

                    <Table className='w-[120rem] overflow-scroll'>
                      <TableCaption>A list of your recent items.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Humidity</TableHead>
                          <TableHead>Adulteration</TableHead>
                          <TableHead>Other</TableHead>

                          <TableHead>Unit Price</TableHead>
                          <TableHead>Weighing Money</TableHead>
                          <TableHead>Ship Down</TableHead>
                          <TableHead>Cash Other</TableHead>

                          <TableHead>Amount</TableHead>
                          <TableHead>Customer Price</TableHead>
                          <TableHead>Customer Weight</TableHead>
                          <TableHead>Different Price</TableHead>
                          <TableHead>Different Quantity</TableHead>
                          <TableHead>Customer Amount</TableHead>
                          <TableHead>SourceHumidity</TableHead>
                          <TableHead>Customer Humidity</TableHead>
                          <TableHead>Customer Queue No.</TableHead>
                          <TableHead className='items-center'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className='w-[8rem] font-medium'>
                              {item.itemMaster?.code}
                            </TableCell>
                            <TableCell className='w-[15rem] font-medium'>
                              {item.itemMaster?.name}
                            </TableCell>

                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.humidity}</TableCell>
                            <TableCell>{item.adulteration}</TableCell>
                            <TableCell>{item.other}</TableCell>
                            <TableCell>{item.unitPrice}</TableCell>

                            <TableCell>{item.weighingMoney}</TableCell>
                            <TableCell>{item.shipDown}</TableCell>
                            <TableCell>{item.cashOther}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.underCutPrice}</TableCell>

                            <TableCell>{item.cuttingWeight}</TableCell>
                            <TableCell>{item.afterCutPrice}</TableCell>
                            <TableCell>{item.afterCutQuantity}</TableCell>
                            <TableCell>{item.afterAmount}</TableCell>

                            <TableCell>{item.sourceHumidity}</TableCell>
                            <TableCell>{item.destinationHumidity}</TableCell>
                            <TableCell>
                              {item.destinationWeighingScale}
                            </TableCell>
                            <TableCell>
                              <Button
                                loading={false}
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => editItem(item)}
                              >
                                <IconEdit size={20} />
                              </Button>

                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => deleteItem(item)}
                              >
                                <IconTrash size={20} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={15} className='text-left'>
                            <Badge
                              className='h-7 w-[7rem] text-white hover:bg-primary'
                              variant={'default'}
                              onClick={() => setOpenModal(true)}
                            >
                              <IconPlus size={20} className='mr-2 h-4 w-4' />
                              Add Item
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-1 mb-2  flex items-center'>
                      <IconFile />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        File Attach.
                      </Label>
                    </div>

                    <FileDrag uploadData={(e) => addFile(e)} />
                  </div>
                  <div className='grid'>
                    <Button
                      loading={isLoading}
                      type='submit'
                      variant='button'
                      size='sm'
                      className='float-end mt-8 h-8'
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
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
