import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
//import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { PurchaseRequest } from './schema'

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
import {
  createPurchaseRequestItem,
  deletePurchaseRequestItem,
  purchaseRequestDeleteFileAttach,
  purchaseRequestDownloadFileAttach,
  purchaseRequestUploadFiles,
  updatePurchaseRequest,
  updatePurchaseRequestItem,
} from '@/services/purchaseRequestApi'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import FileDrag from '@/components/custom/fileDrag'
import { downloadFileData, toCurrency } from '@/lib/utils'
import { AlertModal } from '@/components/custom/alert-modal'
import { CreateModal } from './create-modal'
import { Badge } from '@/components/ui/badge'
import usePermission from '@/hooks/use-permission'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: PurchaseRequest
  editble: boolean
}
// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

type ItemLists = {
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

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  editble
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [locations, setLocation] = useState<LocationType[]>([])
  const [editValue, setEditValue] = useState<ItemLists>(initalValue)

  //const [files, setFiles] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = useState(false)
  const [openDeleteItem, setOpenDeleteItem] = useState(false)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [deleteId, setdeleteId] = useState(null)
  const [deleteItemId, setdeleteItemId] = useState(null)
  const rule: any = usePermission('purchaseRequest')

  async function downloadFile(filename: any) {
    const response: any = await purchaseRequestDownloadFileAttach(filename)
    downloadFileData(filename, response.data)
  }

  const openFile = (file: any) => {
    window.open(
      `http://tadthongback.c-space.store/files/PurchaseRequest/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  function addNewItem() {
    setEditValue(initalValue)
    setOpenEdit(true)
  }

  function deleteAction(row: any) {
    setOpen(true)
    setdeleteId(row.id)
    setdeleteTitle(row.fileName)
  }

  async function deleteFile() {
    setOnloading(true)
    console.log('updateData:', deleteId)

    const res: any = await purchaseRequestDeleteFileAttach(deleteId)

    if (res) {
      console.log('updateData:', res)

      data.purchaseRequestFileAttach.length = 0
      for (let index = 0; index < res.length; index++) {
        data.purchaseRequestFileAttach?.push(res[index])
      }
    }
    setTimeout(() => {
      setOnloading(false)
      setOpen(false)
      data.purchaseRequestFileAttach.filter((a) => a.id !== deleteId)
    }, 1000)
  }

  async function uploadFile(payload: any) {
    if (payload) {
      setOnloading(true)
      const formData = new FormData()
      for (let i = 0; i < payload?.length; i++) {
        formData.append('files', payload[i])
        formData.append('PurchaseRequestId', data.id.toString())
      }

      const response: any = await purchaseRequestUploadFiles(formData)
      if (response) {
        console.log('uploadFiles -success', response)
        data.purchaseRequestFileAttach.length = 0
        for (let index = 0; index < response.length; index++) {
          data.purchaseRequestFileAttach?.push(response[index])
        }
        console.log('uploadFiles -success', response.status)
      }
      setTimeout(() => {
        setOnloading(false)
      }, 3000)
    }
  }

  async function updateData(data: any) {
    setOnloading(true)
    console.log('updateData:', data)
    const res: any = await updatePurchaseRequest(data)

    if (res.status == 200) {
      console.log('updateData:', res)
    }
    setTimeout(() => {
      setOnloading(false)
      onClose()
      // setRefresh(true)
    }, 1000)
  }
  async function confirmDeletePurchaseItem() {
    setOnloading(true)
    console.log('confirmDeletePurchaseItem:', deleteItemId)
    const res: any = await deletePurchaseRequestItem(deleteItemId)

    if (res.status == 200) {
      console.log(res.data)
      const deleteIndex = data.purchaseRequestItems.findIndex(
        (x) => x.id == deleteItemId
      )
      if (deleteId != -1) {
        data.purchaseRequestItems.splice(deleteIndex, 1)
      }
    }
    setTimeout(() => {
      setOnloading(false)
      setOpenDeleteItem(false)
    }, 1000)
  }

  async function deletePurchaseItem(id: any) {
    setOpenDeleteItem(true)
    setdeleteItemId(id)
    console.log('deletePurchaseItem:', id)
  }

  async function editPurchaseItem(data: any) {
    data.id = data.id.toString()
    data.itemMasterId = data.itemMaster.id.toString()
    data.itemName = data.itemMaster.name
    data.code = data.itemMaster.code
    data.venderId = data.vender.id.toString()
    data.venderName = data.vender.companyName
    data.venderCode = data.vender.code

    setEditValue(data)
    setOpenEdit(true)
    console.log('editPurchaseItem:', data)
  }

  async function updatePurchaseItem(payload: any) {
    setOnloading(true)
    payload.purchaseRequestId = data.id
    payload.total = payload.quantity * payload.price
    payload.includeVat = parseFloat(payload.total) * 0.07
    payload.amount = parseFloat(payload.total) + parseFloat(payload.includeVat)

    if (payload.id == '') {
      payload.id = '0'
      console.log('Add new purchase item data:', payload, data.id)

      const res: any = await createPurchaseRequestItem(parseInt(data.id), [
        payload,
      ])
      if (res.length > 0) {
        console.log('Add new purchase item success:', res)

        data.purchaseRequestItems.length = 0
        for (let index = 0; index < res.length; index++) {
          data.purchaseRequestItems?.push(res[index])
        }
      }

      if (res.status == 200) {
        console.log('editPurchaseItem:', res.data.result.value)

        data.purchaseRequestItems.length = 0
        for (let index = 0; index < res.data.result.value.length; index++) {
          data.purchaseRequestItems?.push(res.data.result.value[index])
        }
      }
    } else {
      console.log('update purchase item data:', payload)
      const res: any = await updatePurchaseRequestItem(payload)

      if (res.status == 200) {
        console.log('editPurchaseItem:', res.data.result.value)

        data.purchaseRequestItems.length = 0
        for (let index = 0; index < res.data.result.value.length; index++) {
          data.purchaseRequestItems?.push(res.data.result.value[index])
        }
      }
    }
    setTimeout(() => {
      setOnloading(false)
      setOpenEdit(false)
    }, 2000)
  }

  useEffect(() => {
    setIsMounted(true)
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
            <DialogTitle>Edit Purchase Request</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <Card>
            <CardContent className='m-3 h-auto space-y-2'>
              <div className='grid gap-4'>
                <form onSubmit={handleSubmit(updateData)}>
                  <div className='mb-3  grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-2 mb-2 flex items-center'>
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
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='requirmentDate'
                      >
                        Date
                      </Label>
                      <Input
                        readOnly
                        className='text-[0.8rem]'
                        {...register('requirmentDate')}
                        defaultValue={data.requirmentDate}
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
                        // {...register('locationId')}
                        // defaultValue={data.locationId}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        {/* <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={item.id}
                            >
                              {data.location.name}
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
                        defaultValue={data.user.firstName}
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
                        readOnly
                        className='text-[0.8rem]'
                        {...register('code')}
                        defaultValue={data.code}
                      />
                    </div>
                    <div className='grid '>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='department'
                      >
                        Department
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('department')}
                        defaultValue={data.department}
                      />
                    </div>

                    <div className='grid '>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='status'
                      >
                        Status
                      </Label>
                      <Input
                        readOnly
                        className='text-[0.8rem]'
                        {...register('status')}
                        defaultValue={data.status}
                      />
                    </div>

                    <div className='grid '>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='reason'
                      >
                        Reason for request
                      </Label>
                      <Textarea
                        className='text-[0.8rem]'
                        {...register('reason')}
                        defaultValue={data.reason}
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
                  </div>

                  <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className=' mb-2 flex items-center'>
                      <IconChecklist />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Items List
                      </Label>
                    </div>
                    <Table className='w-[80rem]'>
                      <TableCaption>A list of your recent items.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-[10rem]'>Item Code</TableHead>
                          <TableHead className='w-[18rem]'>Item Name</TableHead>
                          <TableHead className='w-[10rem]'>
                            Vender Code
                          </TableHead>
                          <TableHead className='w-[18rem]'>
                            Vender Name
                          </TableHead>
                          <TableHead>Specifications</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className='w-[8rem]'>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Vat</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Remark</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.purchaseRequestItems?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className='font-medium'>
                              {item.itemMaster?.code}
                            </TableCell>
                            <TableCell>{item.itemMaster?.name}</TableCell>
                            <TableCell>{item.vender?.code}</TableCell>
                            <TableCell>{item.vender?.companyName}</TableCell>
                            <TableCell>{item.specification}</TableCell>
                            <TableCell>{toCurrency(item.quantity)}</TableCell>
                            <TableCell>{toCurrency(item.price)}</TableCell>
                            {/* <TableCell>
                              <Input
                                className='w-[100px]'
                                type='number'
                                min={1}
                                id={item.id}
                                defaultValue={item.quantity}
                                onChange={handleChangeQuantity}
                              />
                            </TableCell>
                            <TableCell>
                            <Input
                                className='w-[100px]'
                                type='float'
                                min={1}
                                id={item.id}                               
                                defaultValue={item.price?.toFixed(2)}
                                onChange={handleChangePrice}
                              />
                            </TableCell> */}
                            <TableCell>{toCurrency(item.total)}</TableCell>
                            <TableCell>{toCurrency(item.includeVat)}</TableCell>
                            <TableCell>{toCurrency(item.amount)}</TableCell>
                            <TableCell>{item.remark}</TableCell>
                            <TableCell className='w-[8rem]'>
                              <div className='flex items-center gap-3'>
                                <IconEdit
                                  size={20}
                                  onClick={() => editPurchaseItem(item)}
                                />
                                <IconTrash
                                  size={20}
                                  onClick={() => deletePurchaseItem(item.id)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell>
                            <Badge
                              className={`${editble ? 'hidden' : 'text-white hover:bg-primary'}`}
                              variant={'default'}
                              onClick={addNewItem}
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
                    <div className=' mb-2 flex items-center'>
                      <IconFile />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        File Attach
                      </Label>
                    </div>

                    <FileDrag uploadData={(e) => uploadFile(e)} />
                    {/* <div className='float-end'>
                          <Button
                            loading={onloading}
                            variant='outline'
                            size='sm'
                            className='float-end h-8 w-32 bg-primary'
                            onClick={uploadFile}
                          >
                            <PlusCircleIcon className='mr-2 h-4 w-4' />
                            Confirm Upload
                          </Button>
                        </div> */}

                    <Table className='overflow-scroll'>
                      <TableCaption>A list of file attached.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>

                          <TableHead className='items-center'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.purchaseRequestFileAttach?.map((item) => (
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
                          <TableCell
                            colSpan={10}
                            className='text-right'
                          ></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <br />
                  <DialogFooter>
                    <Button
                      disabled={!rule[0].canUpdate}
                      loading={onloading}
                      type='submit'
                    >
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

      <CreateModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        loading={onloading}
        createData={(e) => updatePurchaseItem(e)}
        editData={editValue}
      />
    </>
  )
}
