'use client'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
//import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { PurchaseOrder } from './schema'
import { getVenders } from '@/services/vendersApi'
import { VenderType } from '@/pages/master/vender/components/type'
import {
  IconChecklist,
  IconDownload,
  IconEdit,
  IconEye,
  IconFile,
  IconInfoCircle,
  IconTrash,
} from '@tabler/icons-react'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import {
  deletePurchaseOrderItem,
  purchaseOrderDeleteFileAttach,
  purchaseOrderDownloadFileAttach,
  purchaseOrderUploadFiles,
  updatePurchaseOrder,
  updatePurchaseOrderItemById,
} from '@/services/purchaseOrderApi'
import FileDrag from '@/components/custom/fileDrag'
import { cn, downloadFileData } from '@/lib/utils'
import { AlertModal } from '@/components/custom/alert-modal'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { Calendar } from '@/components/ui/calendar'
import { ItemModal } from './item-modal'
import { PurchaseOrderItemType } from './type'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: PurchaseOrder
}

const initalValue = {
  id: 0,
  purchaseOrderId: 0,
  itemName: '',
  itemMasterId: '',
  quantity: 0,
  specification: '',
  discountPercent: 0,
  discountUnit: 0,
  //discountTotal: 0,
  //vat: 0,
  remark: '',
  price: 0,
  //amount: 0,
  // itemMaster: {
  //     code: '',
  //     name: '',
  // }
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [editValue, setEditValue] = useState<PurchaseOrderItemType>(initalValue)
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [venders, setVender] = useState<VenderType[]>([])
  const [locations, setLocation] = useState<LocationType[]>([])
  //const [files, setFiles] = useState('')
  const [open, setOpen] = useState(false)
  const [openDeleteItem, setOpenDeleteItem] = useState(false)

  const [openEdit, setOpenEdit] = useState(false)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [deleteId, setdeleteId] = useState(null)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [delivery, setDelivery] = useState<Date>()

  const { setRefresh } = useContext(ApiContext) as ApiType

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
        formData.append('PurchaseOrderId', data.id.toString())
      }

      const response: any = await purchaseOrderUploadFiles(formData)
      if (response) {
        console.log('uploadFiles -success', response.status)
        data.purchaseOrderFileAttach.length = 0
        for (let index = 0; index < response.length; index++) {
          // console.log('uploadFiles -success', response[index])
          data.purchaseOrderFileAttach?.push(response[index])
        }
        console.log('uploadFiles -success', response.status)
       
      }
      setTimeout(() => {
        setOnloading(false)
       
      }, 3000)
    }
  }

  const openFile = (file: any) => {
    window.open(
      `http://tadthongback.c-space.store/files/PurchaseOrder/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  async function downloadFile(filename: any) {
    const response: any = await purchaseOrderDownloadFileAttach(filename)
    downloadFileData(filename, response.data)
  }

  async function updateData(data: any) {
    setOnloading(true)
    if (delivery) {
      data.deliveryDate = format(delivery, 'yyyy-MM-dd')
    }
    console.log('updateData:', data)

    const res: any = await updatePurchaseOrder(data)

    if (res.status == 200) {
      console.log('updateData:', data)
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
    console.log('delete Action:', row.id)
  }

  function updateItem(row: any) {
    row.itemName = row.itemMaster.name
    row.itemMasterId = row.itemMaster.id.toString()

    setOpenEdit(true)
    setEditValue(row)
    console.log('updateItem Action:', row)
  }

  function deleteItem(id: any) {
    setDeleteItemId(id)
    setOpenDeleteItem(true)

    console.log('delete Item Action:', id)
  }

  async function confirmUpdatePurchaseOrderItem(payload: any) {
    setOnloading(true)
    console.log('updatePurchaseOrderItem', payload)
    const res: any = await updatePurchaseOrderItemById(payload)

    if (res.status == 200) {
      console.log('updatePurchaseOrderItem:', res.data.result.value)

      data.purchaseOrderItems.length = 0
      for (let index = 0; index < res.data.result.value.length; index++) {
        data.purchaseOrderItems?.push(res.data.result.value[index])
      }
    }

    setTimeout(() => {
      setOnloading(false)
      setOpenEdit(false)
    }, 1000)
  }

  async function confirmDeletePurchaseItem() {
    setOnloading(true)
    console.log('confirmDeletePurchaseItem:', deleteItemId)
    const res: any = await deletePurchaseOrderItem(deleteItemId)
    if (res.status == 200) {
      console.log(res.data)
      const deleteIndex = data.purchaseOrderItems.findIndex(
        (x) => x.id == deleteItemId
      )
      if (deleteId != -1) {
        data.purchaseOrderItems.splice(deleteIndex, 1)
      }
    }
    setTimeout(() => {
      setOnloading(false)
      setOpenDeleteItem(false)
    }, 1000)
  }

  async function deleteFile() {
    setOnloading(true)
    console.log('deleteFile:', deleteId)
    const res: any = await purchaseOrderDeleteFileAttach(deleteId)

    if (res) {
      console.log('updateData:', res)
      data.purchaseOrderFileAttach.length = 0
      for (let index = 0; index < res.length; index++) {
        data.purchaseOrderFileAttach?.push(res[index])
      }
      setdeleteId(null)
    }

    setTimeout(() => {
      setOnloading(false)
      setOpen(false)

      //setRefresh(true)
    }, 1000)
  }

  useEffect(() => {
    setIsMounted(true)
    getVenders().then((data) => setVender(data))
    getLocation().then((data) => setLocation(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='h-screen max-w-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          {/* <Tabs defaultValue='general' className='h-screen w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='general'>General Information</TabsTrigger>
              <TabsTrigger value='materiallist'>Item List</TabsTrigger>
              <TabsTrigger value='file'>File Attachment</TabsTrigger>
            </TabsList>
            <TabsContent value='general'> */}
          <Card>
            <CardContent className='m-3 h-auto space-y-2'>
              <div className='grid gap-4 '>
                <form onSubmit={handleSubmit(updateData)}>
                  <div className='mb-3  grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className=' col-span-2 mb-2 flex items-center'>
                      <IconInfoCircle />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        General Infomation.
                      </Label>
                    </div>
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
                      {...register('status')}
                      defaultValue={data.status}
                    />
                    <Input
                      className='hidden'
                      {...register('deliveryDate')}
                      defaultValue={data.deliveryDate}
                    />

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='createAt'
                      >
                        Date
                      </Label>
                      <Input
                        readOnly
                        className='text-[0.8rem]'
                        {...register('createAt')}
                        defaultValue={data.createAt}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='location'
                      >
                        Location
                      </Label>
                      <select
                        // id={item.id}
                        // onChange={handleChangeRole}
                        {...register('locationId')}
                        defaultValue={data.locationId}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        {/* <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={item.id}
                            >
                              {data.location?.name}
                            </option> */}
                        {locations.map((item) => (
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value={item.id}
                            key={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='grid'>
                      <Label className='py-1 text-[0.8rem]' htmlFor='address'>
                        Delivery Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] justify-start text-left font-normal',
                              !delivery && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {delivery ? (
                              format(delivery, 'dd-MM-yyyy')
                            ) : data.deliveryDate ? (
                              format(data.deliveryDate, 'dd-MM-yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            {/* {delivery  ? (
                                  format(delivery, 'dd-MM-yyyy')
                                ) : (
                                  <span>Pick a date</span>
                                )} */}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={delivery}
                            onSelect={setDelivery}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='deliveryDate'
                          >
                            Delivery Date
                          </Label>
                          
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            {...register('deliveryDate')}
                            defaultValue={data.deliveryDate}
                          />
                        </div> */}
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='requestUser'
                      >
                        Request By
                      </Label>
                      <Input
                        readOnly
                        className='text-[0.8rem]'
                        {...register('requestUser')}
                        defaultValue={data.user?.firstName}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='code'
                      >
                        Code
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('code')}
                        defaultValue={data.code}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='requirmentDate'
                      >
                        Vender
                      </Label>
                      <select
                        // id={item.id}
                        // onChange={handleChangeRole}
                        {...register('venderId')}
                        defaultValue={data.venderId}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        {/* <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={item.id}
                            >
                              {data.vender.companyName}
                            </option> */}
                        {venders.map((item) => (
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value={item.id}
                            key={item.id}
                          >
                            {item.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='grid '>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='currency'
                      >
                        Currency
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('currency')}
                        defaultValue={data.currency}
                      />
                    </div>
                    <div className='grid '>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='paymentType'
                      >
                        Payment Type
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('paymentType')}
                        defaultValue={data.paymentType}
                      />
                    </div>
                    <div className='grid '>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='paymentTerm'
                      >
                        Payment Term
                      </Label>
                      <Textarea
                        className='text-[0.8rem]'
                        {...register('paymentTerm')}
                        defaultValue={data.paymentTerm}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='cause'
                      >
                        Cause
                      </Label>
                      <Textarea
                        className='text-[0.8rem]'
                        {...register('cause')}
                        defaultValue={data.cause}
                      />
                    </div>
                    <div className='col-span-2 grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='remark'
                      >
                        Remark
                      </Label>
                      <Textarea
                        className='text-[0.8rem]'
                        {...register('remark')}
                        defaultValue={data.remark}
                      />
                    </div>

                    {/* <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='status'
                          >
                            Status
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('status')}
                            defaultValue={data.status}
                          />
                        </div> */}
                  </div>

                  <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className=' mb-2 flex items-center'>
                      <IconChecklist />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Items List.
                      </Label>
                    </div>
                    <Table>
                      <TableCaption>A list of your recent items.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Specification</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Discount(%)</TableHead>
                          <TableHead>Discount/Unit</TableHead>
                          <TableHead>Discount Total</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Vat</TableHead>
                          <TableHead>Remark</TableHead>
                          {/* <TableHead>Action</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.purchaseOrderItems?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className='font-medium'>
                              {item.itemMaster?.code}
                            </TableCell>
                            <TableCell>{item.itemMaster?.name}</TableCell>
                            <TableCell>{item.specification}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.discountPercent}</TableCell>
                            <TableCell>{item.discountUnit}</TableCell>
                            <TableCell>{item.discountTotal}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.vat}</TableCell>
                            <TableCell>{item.remark}</TableCell>
                            <TableCell>
                            <div className='flex items-center gap-3'>
                                <IconEdit
                                  size={20}
                                  onClick={() => updateItem(item)}
                                />
                                <IconTrash
                                  size={20}
                                  onClick={() => deleteItem(item.id)}
                                />
                              </div>
                              
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          {/* <TableCell>
                            <Button
                              variant='outline'
                              size='sm'
                              className='w-13 h-8 bg-primary'
                              // onClick={addNewItem}
                            >
                              <PlusCircledIcon className='mr-2 h-4 w-4' />
                              Add Item
                            </Button>
                          </TableCell> */}
                          {/* <TableCell colSpan={3} className='text-right'>
                            Sub Total
                          </TableCell>
                          <TableCell>0</TableCell> */}
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className=' mb-2 flex items-center'>
                      <IconFile />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        File Attach.
                      </Label>
                    </div>

                    <FileDrag uploadData={(e) => uploadFile(e)} />
                   

                    <Table className='overflow-scroll'>
                      <TableCaption>A list of file attached.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>

                          <TableHead className='items-center'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.purchaseOrderFileAttach?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className='font-medium'>
                              {item.fileName}
                            </TableCell>

                            <TableCell className='w-[8rem]'>
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
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={10} className='text-right'>
                            {/* <Button loading={false} >
                            <IconRefresh size={20} />
                            Add
                          </Button> */}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <br />
                  <DialogFooter>
                    <Button loading={onloading} type='submit' variant='button'>
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </div>
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

      <AlertModal
        isOpen={openDeleteItem}
        onClose={() => setOpenDeleteItem(false)}
        onConfirm={confirmDeletePurchaseItem}
        loading={onloading}
        title={'Are you sure to delete this item.'}
      />

      <ItemModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        loading={onloading}
        createData={(e) => confirmUpdatePurchaseOrderItem(e)}
        editData={editValue}
      />
    </>
  )
}
