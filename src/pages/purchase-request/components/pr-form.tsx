import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
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
import { CreateModal } from './create-modal'
import {
  IconChecklist,
  IconDeviceFloppy,
  IconEdit,
  IconFile,
  IconInfoCircle,
  IconPencilPlus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, formatDate } from 'date-fns'
import { Textarea } from '@/components/ui/textarea'
import {
  createPurchaseRequest,
  purchaseRequestUploadFiles,
} from '@/services/purchaseRequestApi'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import FileDrag from '@/components/custom/fileDrag'
import { PageHeader } from '@/components/layouts/header'
import { cn, toCurrency } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
//interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

type ItemList = {
  id: string
  venderId: string
  venderCode: string
  venderName: string
  itemMasterId: string
  code: string
  itemName: string
  quantity: number
  price: number
  amount: number
  total: number
  includeVat: number
  specification: string
  remark: string
}

const initalValue = {
  id: '',
  venderId: '0',
  venderCode: '',
  venderName: '',
  itemMasterId: '0',
  code: '',
  itemName: '',
  quantity: 0,
  price: 0,
  amount: 0,
  total: 0,
  includeVat: 0,
  specification: '',
  remark: '',
}

const formSchema = z.object({
  reason: z.string(),
  cause: z.string(),
  department: z.string(),
  selectVender: z.string(),
  userName: z.string(),
  selectLocation: z.string(),
  code: z.string(),
  description: z.string(),
  remark: z.string().min(0),
  status: z.string(),
  requirmentDate: z.string(),
})

export function PRForm() {
  const [items, setItem] = useState<ItemList[]>([])
  const [files, setFiles] = useState<File[]>()
  const [editValue, setEditValue] = useState<ItemList>(initalValue)
  //const [venders, setVender] = useState<Venders[]>([])
  const [locations, setLocation] = useState<LocationType[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [sumVat, setVat] = useState(0)
  const [sumQty, setSumQty] = useState(0)
  const [sumTotal, setTotal] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)

  const navigate = useNavigate()
  let today = new Date()
  let user: any = localStorage.getItem('user')
  let dateCode = formatDate(today, 'yyyy-MM-dd')
  let newCode = dateCode.split('-')
  // const { handleSubmit, register, setValue } = useForm()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectVender: '0',
      cause: '',
      reason: '',
      description: '',
      department: '',
      selectLocation: '1',
      code: 'PR' + newCode[0] + newCode[1] + newCode[2],
      userName: user,
      requirmentDate: formatDate(today, 'yyyy-MM-dd'),
      status: 'New Order',
      remark: '',
    },
  })

  const calAmount = () => {
    let qty = 0
    let total = 0
    let vat = 0
    let grand = 0

    for (let index = 0; index < items.length; index++) {
      qty = qty + items[index].quantity
      total = total + items[index].total
      vat = vat + items[index].includeVat
      grand = grand + items[index].amount
    }
    setSumQty(qty)
    setTotal(total)
    setVat(vat)
    setGrandTotal(grand)

    // setTotal(10000)
    // setGrandTotal(subtotal)
  }

  function addFile(payload: any) {
    setFiles(payload)
    console.log('File data:', payload)
  }

  async function onSubmit(data: any) {
    setIsLoading(true)

    const selectedLocation: any = locations.find(
      (item) => item.name == data.selectLocation
    )
    const userid: any = localStorage.getItem('userId')
    const branchid: any = localStorage.getItem('branchId')
    data.venderId = 1
    data.locationId = selectedLocation.id
    data.companyId = 1
    data.sumQty = sumQty
    data.total = sumTotal
    data.sumVat = sumVat
    data.amount = grandTotal
    data.userId = parseInt(userid)
    data.branchId = parseInt(branchid)
    data.createAt = format(today, 'yyyy-MM-dd')
    data.purchaseRequestItems = items
    data.files = files
    console.log('onSubmit', data)

    const respone: any = await createPurchaseRequest(data)
    if (respone.id) {
      console.log('createPurchaseRequest -success', respone.status)
      if (data.files) {
        const formData = new FormData()
        for (let i = 0; i < data.files?.length; i++) {
          formData.append('files', data.files[i])
          formData.append('purchaseRequestId', respone.id)
        }

        const res: any = await purchaseRequestUploadFiles(formData)
        if (res.status == 200) {
          console.log('uploadFiles -success', res.status)
        }
      }
      setTimeout(() => {
        setEditValue(initalValue)
        setIsLoading(false)
        navigate('/purchase-request', { replace: true })
      }, 2000)
    }
  }
  function updateData(payload: any) {
    console.log('editData', payload)
    setEditValue(payload)
    setOpenModal(true)
  }

  function addNewItem() {
    // console.log('addNewData', payload)
    setEditValue({
      id: '0',
      venderId: '',
      venderCode: '',
      venderName: '',
      itemMasterId: '0',
      code: '',
      itemName: '',
      quantity: 0,
      price: 0,
      amount: 0,
      total: 0,
      includeVat: 0,
      specification: '',
      remark: '',
    })
    setOpenModal(true)
  }

  function addNewData(payload: any) {
    console.log('addNewData', payload)
    payload.total = payload.quantity * payload.price
    payload.includeVat = parseFloat(payload.total) * 0.07
    payload.amount = parseFloat(payload.total) + parseFloat(payload.includeVat)

    const exitIndex = items.findIndex((item) => item.code == payload.code)
    if (exitIndex != -1) {
      items[exitIndex] = payload
    } else {
      items.push(payload)
    }
    calAmount()
    setOpenModal(false)
  }

  useEffect(() => {
    setItem([])
    //getVenders().then((data) => setVender(data))
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

        {/* <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='general'>General Information</TabsTrigger>
            <TabsTrigger value='materiallist'>Item List</TabsTrigger>
          </TabsList>
          <TabsContent value='general'> */}
        <Card>
          <CardContent className='space-y-2'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid gap-4'>
                  <div className='mb-3  grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-2 mb-2  flex items-center'>
                      <IconInfoCircle />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        General Information.
                      </Label>
                    </div>
                    <FormField
                      control={form.control}
                      name='requirmentDate'
                      render={({ field }) => (
                        <FormItem className='space-y-1'>
                          <FormLabel>Date</FormLabel>
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
                        <FormItem className='grid space-y-1.5 py-2'>
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
                      name='userName'
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
                      name='department'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
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
                        <FormItem>
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
                      name='reason'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for request</FormLabel>
                          <FormControl>
                            <Textarea className='resize-none' {...field} />
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
                        <FormItem className='col-span-2'>
                          <FormLabel>Remark</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='mb-2  flex items-center'>
                      <IconChecklist />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Items List.
                      </Label>
                    </div>
                    <Table className='w-[80rem]'>
                      <TableCaption>A list of your recent items.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Code</TableHead>
                          <TableHead className='w-[8rem]'>Item Name</TableHead>
                          <TableHead>Vender Code</TableHead>
                          <TableHead className='w-[8rem]'>
                            Vender Name
                          </TableHead>
                          <TableHead>Specifications</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Vat</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Remark</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.code}>
                            <TableCell className='font-medium'>
                              {item.code}
                            </TableCell>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.venderCode}</TableCell>
                            <TableCell>{item.venderName}</TableCell>
                            <TableCell>{item.specification}</TableCell>
                            <TableCell>{toCurrency(item.quantity)}</TableCell>
                            <TableCell>{toCurrency(item.price)}</TableCell>
                            <TableCell>{toCurrency(item.total)}</TableCell>
                            <TableCell>{toCurrency(item.includeVat)}</TableCell>
                            <TableCell>{toCurrency(item.amount)}</TableCell>
                            <TableCell>{item.remark}</TableCell>
                            <TableCell>
                              <Badge
                                className='text-white hover:bg-primary mr-2'
                                variant={'default'}
                                onClick={() => updateData(item)}
                              >
                                <IconEdit size={20} />
                              </Badge>
                              <Badge
                                className='text-white hover:bg-primary'
                                variant={'destructive'}
                                onClick={() =>
                                  setItem(items.filter((a) => a.id !== item.id))
                                }                              >
                                <IconTrash size={20} />
                              </Badge>

                              
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell>
                            <Badge
                              className='h-7 w-[7rem] text-white hover:bg-primary'
                              variant={'default'}
                              onClick={addNewItem}
                            >
                              <IconPlus size={20} className='mr-2 h-4 w-4' />
                              Add Item
                            </Badge>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell colSpan={6} className='text-right'>
                            {toCurrency(sumQty)}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>{toCurrency(sumTotal)}</TableCell>
                          <TableCell></TableCell>
                          <TableCell>{toCurrency(sumVat)}</TableCell>
                          <TableCell colSpan={2} className='text-center'>
                            {toCurrency(grandTotal)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='mb-2  flex items-center'>
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
                      className='float-end mt-8 h-8 gap-3'
                    >
                      <IconDeviceFloppy size={20} />
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

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
