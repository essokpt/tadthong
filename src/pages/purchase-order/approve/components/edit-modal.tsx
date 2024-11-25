'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
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
import { PurchaseOrder } from '../../components/schema'
import { getVenders } from '@/services/vendersApi'
import { VenderType } from '@/pages/master/vender/components/type'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import { approvePurchaseOrder } from '@/services/purchaseOrderApi'
import {
  IconCheck,
  IconChecklist,
  IconEye,
  IconFile,
  IconInfoCircle,
} from '@tabler/icons-react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: PurchaseOrder
}
// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [venders, setVender] = useState<VenderType[]>([])
  const [locations, setLocation] = useState<LocationType[]>([])
  const [action, setAction] = useState('')

  const openFile = (file: any) => {
    window.open(
      //`http://tadthongback.c-space.store/files/PurchaseOrder/${file}`,
      `https://localhost:7244/files/PurchaseOrder/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  async function updateData(payload: any) {
    // setOnloading(true)
    if (action === 'approved') {
      payload.status = 'Approved'
    }
    if (action === 'rejected') {
      payload.status = 'Rejected'
    }

    payload.id = data.id
    payload.approveBy = localStorage.getItem('user')
    console.log('updateData:', payload)

    const res: any = await approvePurchaseOrder(payload)
    console.log('approvePurchaseOrder:', res)
    if (res.status == 200) {
      setAction('')
      onClose()
    }
  }

  useEffect(() => {
    setIsMounted(true)
    setOnloading(false)
    getVenders().then((data) => setVender(data))
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
            <DialogTitle>Purchase Order - Detail</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          {/* <Tabs defaultValue='action' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='action'>Approve Action</TabsTrigger>

              <TabsTrigger value='general'>General Information</TabsTrigger>
              <TabsTrigger value='materiallist'>Item List</TabsTrigger>
            </TabsList>
            <TabsContent value='action'> */}
          <Card>
            <CardContent className='h-[40rem] space-y-2 overflow-scroll'>
              <div className='grid gap-4'>
                <form onSubmit={handleSubmit(updateData)}>
                  {/* <div className='grid grid-cols-1 gap-2 '> */}
                  <div className='mb-3 mt-2 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='mb-2  flex items-center'>
                      <IconCheck />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Approve Action.
                      </Label>
                    </div>
                    <div className='grid'>
                      <Label className='py-1' htmlFor='remark'>
                        Comment
                      </Label>
                      <Textarea
                        className='text-[0.8rem]'
                        {...register('cause')}
                        // defaultValue={data.remark}
                      />
                    </div>
                    <div>
                      <Label className='py-1' htmlFor='action'>
                        Action
                      </Label>
                      <select
                        //defaultValue='Approved'
                        //onChange={handleChangeRole}
                        {...register('status')}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value={data.status}
                        ></option>
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value='Approved'
                        >
                          Approved
                        </option>
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value='Rejected'
                        >
                          Reject
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* <div className='grid gap-4'> */}
                  <div className='mb-3 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-2 mb-2  flex items-center'>
                      <IconInfoCircle />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Information.
                      </Label>
                    </div>
                    {/* <div className='grid grid-cols-2 gap-2 '> */}
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
                        disabled
                        // id={item.id}
                        // onChange={handleChangeRole}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          //value={item.id}
                        >
                          {data.location?.name}
                        </option>
                        {locations.map((item) => (
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='grid'>
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
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          //value={item.id}
                        >
                          {data.vender.companyName}
                        </option>
                        {venders.map((item) => (
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value={item.code}
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

                  <div className='mb-3 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-1 mb-2  flex items-center'>
                      <IconChecklist />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Material List.
                      </Label>
                    </div>
                    {/* <div className='grid gap-4'> */}
                    <Table className='overflow-scroll'>
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

                  <div className='mb-3 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-1 mb-2  flex items-center'>
                      <IconFile />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        File Attach.
                      </Label>
                    </div>
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
                              <IconEye
                                size={20}
                                onClick={() => openFile(item.path)}
                              />
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
    </>
  )
}