'use client'
import { useContext, useEffect, useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
//import { IconEdit, IconTrash } from '@tabler/icons-react'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import { SaleOrder } from './schema'
import { CustomerType } from '@/pages/master/customer/components/type'
import { getCustomer } from '@/services/customerApi'
import {
  createSaleOrderItem,
  deleteFileAttach,
  deleteSaleOrderItem,
  downloadFileAttach,
  getCarRegistration,
  updateSaleOrder,
  updateSaleOrderItem,
  uploadFiles,
} from '@/services/saleOrderApi'
import {
  IconChecklist,
  IconDownload,
  IconEdit,
  IconEye,
  IconFile,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { AlertModal } from '@/components/custom/alert-modal'
import { cn, downloadFileData } from '@/lib/utils'
import FileDrag from '@/components/custom/fileDrag'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { CreateModal } from './create-modal'
import { CarRegistration, ItemList } from './type'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
//import { PlusCircledIcon } from '@radix-ui/react-icons'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: SaleOrder
  isEdit: boolean
}
// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

const initalValue = {
  id: -1,
  itemMasterId: '0',
  selectedItemMaster: '',
  itemMaster: {
    id: '',
    code: '',
    name: '',
  },
  uomType: '',
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
  id: z.number(),
  code: z.string(),
  cause: z.string().min(0),
  poNumber: z.string(),
  carRegistration: z.string(),
  driverName: z.string(),
  userId: z.number(),
  workorderNo: z.string(),
  // amount : z.number(),
  selectLocation: z.string(),
  selectCustomer: z.string(),
  locationId: z.number(),
  customerId: z.number(),
  remark: z.string().min(0),
  status: z.string(),
  createAt: z.string(),
  createBy: z.string(),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  isEdit,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  // const { handleSubmit, register, setValue } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [customers, setCustomer] = useState<CustomerType[]>([])
  const [locations, setLocation] = useState<LocationType[]>([])
  const [editValue, setEditValue] = useState<ItemList>(initalValue)
  const [carRegistration, setCarRegistration] = useState<CarRegistration[]>([])

  //new
  //const [files, setFiles] = useState('')
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const [deleteTitle, setdeleteTitle] = useState(null)
  const [deleteId, setdeleteId] = useState(null)
  const [deleteItemId, setdeleteItemId] = useState(null)

  const { setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: data,
  })

  async function addNewData(payload: any) {
    console.log('addNewData', payload)
    setOnloading(true)

    if (payload.id != -1) {
      console.log('update sale oreder item', payload.id)
      const res: any = await updateSaleOrderItem(payload)
      if (res) {
        console.log('update sale oreder item -success', res)
        const itemIndex = data.saleOrderItems.findIndex(
          (a) => a.id == payload.id
        )
        if (itemIndex != -1) {
          data.saleOrderItems[itemIndex] = res
        }
      }
    } else {
      payload.id = 0
      payload.saleOrderId = data.id
      console.log('add new sale oreder item', payload)
      const res: any = await createSaleOrderItem(payload)
      if (res.length > 0) {
        console.log('update sale oreder item -success', res)
        data.saleOrderItems.length = 0

        for (let index = 0; index < res.length; index++) {
          data.saleOrderItems.push(res[index])
        }
      }
    }
    setTimeout(() => {
      setOnloading(false)
    }, 1000)
  }

  async function uploadFile(payload: any) {
    if (payload) {
      setOnloading(true)
      const formData = new FormData()
      for (let i = 0; i < payload?.length; i++) {
        formData.append('files', payload[i])
        formData.append('SaleOrderId', data.id.toString())
      }

      const res: any = await uploadFiles(formData)
      if (res) {
        console.log('uploadFiles -success', res.status)
        data.saleOrderAttachFiles.length = 0
        data.saleOrderAttachFiles = res
      }
      setTimeout(() => {
        setOnloading(false)
      }, 1000)
    }
  }

  const openFile = (file: any) => {
    window.open(
      `http://tadthongback.c-space.store/files/SaleOrder/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  async function downloadFile(filename: any) {
    const response: any = await downloadFileAttach(filename)
    downloadFileData(filename, response.data)
  }

  async function updateData(data: any) {
    setOnloading(true)
    console.log('updateData:', data)

    const res: any = await updateSaleOrder(data)

    if (res.status == 200) {
      console.log('updateData:', res)
    }

    setTimeout(() => {
      setOnloading(false)
      onClose()
      setRefresh(true)
    }, 1000)
  }
  function deleteAction(row: any) {
    setOpen(true)
    setdeleteId(row.id)
    setdeleteTitle(row.fileName)
  }

  async function deleteFile() {
    setOnloading(true)

    if (deleteId) {
      console.log('deleteFile:', deleteId)
      const res: any = await deleteFileAttach(deleteId)

      if (res.status == 200) {
        setTimeout(() => {
          const itemIndex = data.saleOrderAttachFiles.findIndex(
            (x) => x.id == deleteId
          )
          data.saleOrderAttachFiles.splice(itemIndex, 1)
        }, 1000)
      }
      setTimeout(() => {
        setOnloading(false)
        setOpen(false)
        setdeleteId(null)
      }, 1000)
    }
    if (deleteItemId) {
      console.log('delete item:', deleteItemId)

      const res: any = await deleteSaleOrderItem(deleteItemId)

      if (res.status == 200) {
        console.log(res.data)
        const itemIndex = data.saleOrderItems.findIndex(
          (x) => x.id == deleteItemId
        )
        data.saleOrderItems.splice(itemIndex, 1)
      }
      setTimeout(() => {
        setdeleteItemId(null)
        setOnloading(false)
        setOpen(false)
      }, 1000)
    }
  }

  function addNewItem() {
    setEditValue(initalValue)
    setOpenEdit(true)
  }

  function updateItem(data: any) {
    data.selectedItemMaster = data.itemMaster.name
    setEditValue(data)
    setOpenEdit(true)
    console.log('updateData:', data)
  }

  function deleteItem(data: any) {
    setdeleteItemId(data.id)
    setdeleteTitle(data.itemMaster.name)
    setOpen(true)
    console.log('updateData:', data)
  }

  // function openCreate() {

  //   setEditValue(initalValue)
  //   setOpenEdit(true)
  //   console.log('updateData:', editValue)
  // }

  useEffect(() => {
    setIsMounted(true)
    getCustomer().then((data) => setCustomer(data))
    getLocation().then((data) => setLocation(data))
    getCarRegistration().then((data) => setCarRegistration(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='h-screen max-w-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Sale Order</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          {/* 
          <Tabs defaultValue='general' className='h-screen w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='general'>General Information</TabsTrigger>
              <TabsTrigger value='materiallist'>Item List</TabsTrigger>
              <TabsTrigger value='file'>File Attached</TabsTrigger>
            </TabsList>
            <TabsContent value='general'> */}
          <Card>
            <CardContent className='h-auto space-y-2'>
              <Form {...form}>
                <div className='m-2 grid gap-4'>
                  <form onSubmit={form.handleSubmit(updateData)}>
                    {/* <div className='grid grid-cols-2 gap-2 '> */}
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
                                            form.setValue('locationId', item.id)
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
                          <FormItem className='mt-2 grid space-y-1.5'>
                            <FormLabel>Car Registration</FormLabel>
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
                                      ? carRegistration.find(
                                          (item) => item.carNo === field.value
                                        )?.carNo
                                      : 'Select cat registration'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search cat registration...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      No cat registration found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {carRegistration.map((item) => (
                                        <CommandItem
                                          value={item.carNo}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'carRegistration',
                                              item.carNo
                                            )
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              item.carNo === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {item.carNo}
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
                        name='workorderNo'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Work Order No</FormLabel>
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
                          <FormItem className='space-y-1'>
                            <FormLabel>Queue No.</FormLabel>
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
                          <FormItem className='col-span-2 space-y-1'>
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
                      <div className='col-span-3 mb-2  flex items-center'>
                        <IconChecklist />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Material List.
                        </Label>
                      </div>

                      <Table className='w-[130rem] overflow-scroll'>
                        <TableCaption>
                          A list of your recent items.
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='items-center'>
                              Action
                            </TableHead>

                            <TableHead className='w-[7rem]'>
                              รหัสสินค้า
                            </TableHead>
                            <TableHead className='w-[10rem]'>สินค้า</TableHead>
                            <TableHead>จำนวน</TableHead>
                            <TableHead>หักความชื้น</TableHead>
                            <TableHead>หักเจือปน</TableHead>
                            <TableHead>หักอื่นๆ</TableHead>

                            <TableHead>ราคาต่อหน่วย</TableHead>
                            <TableHead>หักเงินค่าชั่ง</TableHead>
                            <TableHead>หักค่าลง</TableHead>
                            <TableHead>หักเงินอื่นๆ</TableHead>

                            <TableHead>มูลค่า</TableHead>
                            <TableHead>ราคาลูกค้า</TableHead>
                            <TableHead>จำนวนลูกค้า</TableHead>
                            <TableHead>ผลต่างราคา</TableHead>
                            <TableHead>ผลต่างจำนวน</TableHead>
                            <TableHead>มูลค่าลูกค้า</TableHead>
                            <TableHead>ความชื้นต้นทาง</TableHead>
                            <TableHead>ความชื้นลูกค้า</TableHead>
                            <TableHead>เลขใบชั่งลูกค้า</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.saleOrderItems?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell hidden={!isEdit}>
                                <div className='flex items-center gap-2'>
                                  <IconEdit
                                    size={20}
                                    color='blue'
                                    onClick={() => updateItem(item)}
                                  />

                                  <IconTrash
                                    size={20}
                                    color='red'
                                    onClick={() => deleteItem(item)}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item.itemMaster?.code}
                              </TableCell>
                              <TableCell className='w-10'>
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
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              colSpan={15}
                              className={`${isEdit ? 'text-left' : 'hidden'}`}
                            >
                              <Badge
                                className='h-7 w-[7rem] text-white hover:bg-primary'
                                variant={'default'}
                                onClick={() => addNewItem()}
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
                      <div className={`${isEdit ? 'none' : 'hidden'}`}>
                        <FileDrag uploadData={(e) => uploadFile(e)} />
                      </div>

                      <Table className='overflow-scroll'>
                        <TableCaption>A list of file attached.</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>

                            <TableHead className='items-center'>
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.saleOrderAttachFiles?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                {item.fileName}
                              </TableCell>

                              <TableCell hidden={!isEdit}>
                                <div className='flex items-center gap-3'>
                                  <IconDownload
                                    size={20}
                                    onClick={() => downloadFile(item.path)}
                                  />
                                  <IconEye
                                    size={20}
                                    onClick={() => openFile(item.path)}
                                  />
                                  <IconTrash
                                    size={20}
                                    onClick={() => deleteAction(item)}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className={`${isEdit ? 'none' : 'hidden'}`}>
                      <Button
                        loading={onloading}
                        type='submit'
                        variant='button'
                        size='sm'
                        className='float-end mt-8 h-8 space-y-1'
                      >
                        Save Change
                      </Button>
                    </div>
                  </form>
                </div>
              </Form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteFile}
        loading={onloading}
        title={deleteTitle}
      />

      <CreateModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        loading={false}
        createData={(e) => addNewData(e)}
        editData={editValue}
      />
    </>
  )
}
