'use client'
import { SyntheticEvent, useEffect, useState } from 'react'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { WorkOrder } from './schema'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import {
  deleteWorkOrderItemById,
  updateWorkOrder,
  updateWorkOrderItems,
  workOrderDeleteFileAttach,
  workOrderDownloadFileAttach,
  workOrderUploadFiles,
} from '@/services/workOrderApi'
import {
  IconDeviceFloppy,
  IconDownload,
  IconEye,
  IconFile,
  IconInfoCircle,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react'
import { ConfirmDelete } from './confirm-delete'
import FileDrag from '@/components/custom/fileDrag'
//import { useNavigate } from 'react-router-dom'
import { cn, downloadFileData } from '@/lib/utils'
import { AlertModal } from '@/components/custom/alert-modal'
// import { ApiContext } from '@/components/layouts/api-context'
// import { ApiType } from 'types/api'
import { format } from 'date-fns'
import { z } from 'zod'
//import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ItemType } from '@/pages/master/item/components/type'
import { getItemBom } from '@/services/itemApi'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import InputCurrency from '@/components/custom/inputCurrency'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: WorkOrder
}
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}
type AlertData = {
  id: string
  itemMaster: {
    code: string
    name: string
    specification: string
  }
  pickingQuantity: number
  error: {
    status: boolean
    text: string
  }
}

const initialValue = {
  id: '',
  itemMaster: {
    code: '',
    name: '',
    specification: '',
  },
  pickingQuantity: 0,
  error: {
    status: false,
    text: '',
  },
}

const formSchema = z.object({
  id: z.string(),
  code: z.string(),
  locationId: z.number(),
  itemMasterId: z.number(),
  cause: z.string().min(0),
  selectLocation: z.string(),
  selectItem: z.string(),
  unit: z.string(),
  createBy: z.string(),
  quantity: z.number(),
  received: z.number(),
  balance: z.number(),
  remark: z.string().min(0),
  status: z.string(),
  createAt: z.string(),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const { handleSubmit, register, setValue } = useForm()
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteData, setDeleteData] = useState<AlertData>(initialValue)
  const [onloading, setOnloading] = useState(false)
  const [locations, setLocation] = useState<LocationType[]>([])
  const [itemMasters, setItems] = useState<ItemType[]>([])

  const [open, setOpen] = useState(false)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [deleteId, setdeleteId] = useState(null)

  // const navigate = useNavigate()
  // const { setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    values: data,
  })

  function handleChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
    const findIndex: any = data.workOrderUsages.findIndex(
      (item) => item.id == e.target.id
    )
    if (findIndex != -1) {
      const qty = parseInt(e.target.value)
      data.workOrderUsages[findIndex].quantity = qty
      if (qty >= data.workOrderUsages[findIndex].pickingQuantity) {
        data.workOrderUsages[findIndex].pickingBalance =
          qty - data.workOrderUsages[findIndex].pickingQuantity
      }

      //updateItem(findIndex)
    }

    console.log('handleChangeQuantity value', data)
  }

  // function handleChangeQty(e: ChangeEvent<HTMLInputElement>) {
  //   const qty = parseInt(e.target.value)
  //   data.quantity = qty
  //   if (qty >= data.received) {
  //     data.balance = qty - data.received
  //     setValue('balance', data.balance)
  //   }
  // }

  async function deleteFile() {
    setOnloading(true)
    console.log('deleteFile:', deleteId)

    const res: any = await workOrderDeleteFileAttach(deleteId)

    if (res.status == 200) {
      console.log('deleteFile:', res)
      data.workOrderFileAttach.length = 0
      for (let index = 0; index < res.data.length; index++) {
        // console.log('uploadFiles -success', response[index])
        data.workOrderFileAttach?.push(res.data[index])
      }
    }

    setTimeout(() => {
      setOnloading(false)
      setOpen(false)
      // setRefresh(true)
    }, 1000)
  }

  // function addFile(payload: any) {
  //   setFiles(payload)
  //   console.log('File data:', payload)
  // }

  async function uploadFile(payload: any) {
    if (payload) {
      setOnloading(true)
      const formData = new FormData()
      for (let i = 0; i < payload?.length; i++) {
        formData.append('files', payload[i])
        formData.append('WorkOrderId', data.id.toString())
      }

      const res: any = await workOrderUploadFiles(formData)
      if (res.status == 200) {
        console.log('uploadFiles -success', res.status)
        data.workOrderFileAttach.length = 0
        for (let index = 0; index < res.data.length; index++) {
          // console.log('uploadFiles -success', response[index])
          data.workOrderFileAttach?.push(res.data[index])
        }
      }
      setTimeout(() => {
        setOnloading(false)
        // onClose()
        // navigate('/WorkOrder', { replace: true })
      }, 3000)
    }
  }

  async function updateData(data: any) {
    console.log('updateData:', data)
    if (parseInt(data.quantity) >= parseInt(data.received)) {
      setOnloading(true)
      console.log('updateData:', data)
      const res: any = await updateWorkOrder(data)

      if (res.status == 200) {
        console.log('updateData:', res)
        //setInputError('')
      }

      setTimeout(() => {
        setOnloading(false)
        //onClose()
        //setRefresh(true)
      }, 1000)
    }
    // else {
    //   setInputError('Quantity value must than recived, Try agian.')
    // }
  }

  async function downloadFile(filename: any) {
    const response: any = await workOrderDownloadFileAttach(filename)
    downloadFileData(filename, response.data)
  }

  async function updateItem(payload: any) {
    //console.log('updateItem:', payload)
    let invalidData = true
    const invalid = data.workOrderUsages.find((x) => x.remark == 'invalid')

    if (invalid) {
      invalidData = false
      //let existingData = data.workOrderUsages

      console.log('invalid Usage Qty:', payload)
    }

    if (invalidData) {
      setOnloading(true)
      console.log('updateData:', data)
      const res: any = await updateWorkOrderItems(data)

      if (res.status == 200) {
        console.log('update item data:', data)
      }
      setTimeout(() => {
        setOnloading(false)
        //onClose()
        //setRefresh(true)
      }, 1000)
    }
  }

  const openFile = (file: any) => {
    window.open(
      `http://tadthongback.c-space.store/files/WorkOrder/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  function deleteAction(row: any) {
    setOpen(true)
    setdeleteId(row.id)
    setdeleteTitle(row.fileName)
  }

  async function deleteItem(data: any) {
    if (data.pickingQuantity > 0) {
      console.log('can not delete:')
      setDeleteData({
        id: data.id,
        itemMaster: {
          code: data.code,
          name: data.name,
          specification: data.specification,
        },
        pickingQuantity: data.pickingQuantity,
        error: {
          status: true,
          text: 'Can not delete this item. The item has receipt value.',
        },
      })
    } else {
      setDeleteData(data)
    }

    setOpenDelete(true)
  }

  async function confirmDeleteItem() {
    //setOnloading(true)
    console.log('confirmDeleteItem:', deleteData.id)

    const res: any = await deleteWorkOrderItemById(deleteData.id)

    if (res.status == 200) {
      console.log('deleteWorkOrderUsage:', data)
      setOnloading(false)
      setOpenDelete(false)
      setDeleteData(initialValue)

      data.workOrderUsages.length = 0
      for (let index = 0; index < res.data.length; index++) {
        // console.log('uploadFiles -success', response[index])
        data.workOrderUsages?.push(res.data[index])
      }
    }

    setTimeout(() => {
      setOpenDelete(false)
      setOnloading(false)
      //setRefresh(true)
    }, 1000)
  }

  useEffect(() => {
    setIsMounted(true)
    getItemBom().then((data) => setItems(data))
    getLocation().then((data) => setLocation(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='h-screen max-w-full'>
          <DialogHeader>
            <DialogTitle>Edit Work Order</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <Card>
            <CardContent className='m-2 h-[38rem] space-y-2 overflow-scroll'>
              <div className='grid gap-4'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(updateData)}>
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
                            <FormItem className='mt-2 grid space-y-1.5 py-2'>
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
                                              form.setValue(
                                                'locationId',
                                                item.id
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
                          name='selectItem'
                          render={({ field }) => (
                            <FormItem className='mt-2 grid space-y-1.5 py-2 '>
                              <FormLabel>Item Master</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      disabled
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'justify-between',
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field.value
                                        ? itemMasters.find(
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
                                        {itemMasters.map((item) => (
                                          <CommandItem
                                            value={item.name}
                                            key={item.id}
                                            onSelect={() => {
                                              form.setValue(
                                                'selectItem',
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

                        <InputCurrency
                          value={0}
                          label='Quantity'
                          name='quantity'
                          placeholder={'input quantity'}
                        />
                        {/* <FormField
                          control={form.control}
                          name='quantity'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type='number' {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}

                        <FormField
                          control={form.control}
                          name='unit'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Unit</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <InputCurrency
                          value={0}
                          label='Received'
                          name='received'
                          placeholder={'input received'}
                        />

                        <InputCurrency
                          value={0}
                          label='Balance'
                          name='balance'
                          placeholder={'input balance'}
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
                                <Input
                                  className='col-span-3 resize-none'
                                  {...field}
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
                            <FormItem>
                              <FormLabel>Remark</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='mb-3  grid  items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                        <div className='mb-2  flex items-center'>
                          <IconInfoCircle />
                          <Label htmlFor='terms' className='ml-3 text-lg'>
                            Usage Detail.
                          </Label>
                        </div>
                        <Table className='overflow-scroll'>
                          <TableCaption>
                            A list of your recent items.
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item Code</TableHead>
                              <TableHead>Item Name</TableHead>
                              <TableHead>Specifications</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Issued</TableHead>
                              <TableHead>Balance</TableHead>
                              <TableHead>Last Picking Date</TableHead>
                              <TableHead>Remark</TableHead>
                              <TableHead className='items-center'>
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.workOrderUsages?.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className='font-medium'>
                                  {item.itemMaster?.code}
                                </TableCell>
                                <TableCell>{item.itemMaster?.name}</TableCell>
                                <TableCell>
                                  {item.itemMaster?.specification}
                                </TableCell>
                                <TableCell>
                                  {/* <input 
                            className='bg-black'
                              key={item.id} 
                              defaultValue={item.quantity}
                              {...register(`qty.${index}.qty` as const,  {
                                minLength: {
                                  value: 5,
                                  message: 'error message'
                                }
                              })} 
                              /> */}
                                  <Input
                                    className='w-[100px]'
                                    type='number'
                                    min={item.pickingQuantity}
                                    id={item.id}
                                    defaultValue={item.quantity}
                                    onChange={handleChangeQuantity}
                                  />
                                </TableCell>

                                <TableCell>{item.pickingQuantity}</TableCell>
                                <TableCell>{item.pickingBalance}</TableCell>
                                <TableCell>
                                  {item.pickingDate
                                    ? format(item.pickingDate, 'dd-MM-yyyy')
                                    : ''}
                                </TableCell>
                                <TableCell>{item.remark}</TableCell>
                                <TableCell className='w-[8rem]'>
                                  {/* <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => updatePurchaseItem(item)}
                              >
                                <IconRefresh size={20} />
                              </Button> */}
                                  <IconTrash
                                    size={20}
                                    onClick={() => deleteItem(item)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TableCell colSpan={10} className='text-right'>
                                <Badge
                                  className='text-white hover:bg-primary'
                                  variant={'default'}
                                  onClick={updateItem}
                                >
                                  <IconRefresh size={20} className='mr-2' />
                                  Update
                                </Badge>
                                {/* <Button
                                  loading={onloading}
                                  onClick={updateItem}
                                  variant='button'
                                >
                                  <IconRefresh size={20} className='mr-2' />
                                  Update
                                </Button> */}
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </div>

                      <div className='mb-3 grid items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                        <div className='mb-2  flex items-center'>
                          <IconFile />
                          <Label htmlFor='terms' className='ml-3 text-lg'>
                            File Attach
                          </Label>
                        </div>

                        <FileDrag uploadData={(e) => uploadFile(e)} />

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
                            {data.workOrderFileAttach?.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className='font-medium'>
                                  {item.id}- {item.fileName}
                                </TableCell>

                                <TableCell className='w-[8rem] '>
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

                      <Button
                        loading={onloading}
                        type='submit'
                        variant='button'
                        size='sm'
                        className='float-end mt-8  h-8 gap-2 '
                      >
                        <IconDeviceFloppy size={20} />
                        Save Change
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <ConfirmDelete
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDeleteItem}
        data={deleteData}
      />

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteFile}
        loading={onloading}
        title={deleteTitle}
      />
    </>
  )
}
