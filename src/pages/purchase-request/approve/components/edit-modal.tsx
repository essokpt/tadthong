import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'

import { Label } from '@radix-ui/react-label'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { PurchaseRequest } from '../../components/schema'
import { Input } from '@/components/ui/input'
import { approvePurchaseRequest } from '@/services/purchaseRequestApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconCheck, IconChecklist, IconEye, IconFile, IconInfoCircle } from '@tabler/icons-react'
import { toCurrency } from '@/lib/utils'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: PurchaseRequest
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [onloading, setOnloading] = useState(false)
  const [action, setAction] = useState('')

  const { handleSubmit, register } = useForm()
  const { setRefresh } = useContext(ApiContext) as ApiType

  async function updateData(payload: any) {
    setOnloading(true)
    let today = new Date()
    if (action === 'approved') {
      payload.type = 'Approved'
    }
    if (action === 'rejected') {
      payload.type = 'Rejected'
    }

    payload.id = data.id
    payload.actionBy = localStorage.getItem('user')
    payload.createAt = format(today, 'yyyy-MM-dd')
    payload.approveBy = localStorage.getItem('user')
    console.log('updateData:', payload)

    const res: any = await approvePurchaseRequest(payload)

    if (res.status == 200) {
      console.log('approve Purchase Request success.')
      //   const newPo = {
      //     code: 'PO-XXX',
      //     description: 'New Purchase Order',
      //     venderId: data.venderId,
      //     companyId: data.companyId,
      //     total: data.total,
      //     sumVat: data.sumVat,
      //     amount: data.amount,
      //     userId: data.userId,
      //     branchId: data.branchId,
      //     refPr: data.code,
      //     createAt: format(today, 'yyyy-MM-dd'),
      //     status: 'New',
      //     remark: 'convert from pr',
      //     purchaseOrderItems: data.purchaseRequestItems,
      //   }
      //   console.log('convert po data :', newPo)

      //   const convert: any = await createPurchaseOrder(newPo)
      //   if (convert.status == 200) {
      //     console.log('createPurchaseOrder-completed')
      //     setOnloading(false)
      //     onClose()
      // }
      setTimeout(() => {
        setOnloading(false)
        onClose()
        setRefresh(true)
      }, 1000)
    }
  }

  const openFile = (file: any) => {
    window.open(
      `http://tadthongback.c-space.store/files/PurchaseRequest/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  function handleChangeRole(e: ChangeEvent<HTMLSelectElement>) {
    setAction(e.target.value)
    console.log('action', e.target.value)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='h-screen max-w-full'>
          <DialogHeader>
            <DialogTitle>Approve </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid h-[40rem] w-full gap-4 overflow-scroll'>
            <Card>
              <CardContent className=' space-y-2 '>
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
                          {...register('remark')}
                          defaultValue={data.cause}
                        />
                      </div>
                      <div>
                        <Label className='py-1' htmlFor='action'>
                          Action
                        </Label>
                        <select
                          defaultValue='Approved'
                          onChange={handleChangeRole}
                          className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                        >
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value={data.status}
                          ></option>
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value='approved'
                          >
                            Approved
                          </option>
                          <option
                            className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                            value='rejected'
                          >
                            Reject
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* <div className='grid gap-4'> */}
                    <div className='mb-3 mt-2 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='mb-2  flex items-center'>
                        <IconInfoCircle />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Information.
                        </Label>
                      </div>
                      <div className='grid grid-cols-2 gap-2 '>
                        <Input
                          readOnly
                          className='hidden'
                          defaultValue={data.id}
                        />
                        <Input
                          readOnly
                          className='hidden'
                          defaultValue={data.userId}
                        />
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='requirmentDate'
                          >
                            Requirment Date
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.requirmentDate}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor=' location'
                          >
                            Location
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.location?.name}
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
                            defaultValue={data.code}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='remark'
                          >
                            Remark
                          </Label>
                          <Textarea
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.remark}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='reason'
                          >
                            Reason
                          </Label>
                          <Textarea
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.reason}
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
                            readOnly
                            className='text-[0.8rem]'
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
                            defaultValue={data.status}
                          />
                        </div>
                        <div className='col-span-2 grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='cause'
                          >
                            Cause
                          </Label>
                          <Textarea
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.cause}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='mb-3 mt-2 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='mb-2  flex items-center'>
                        <IconChecklist />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Items List.
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
                            <TableHead>Vender Code</TableHead>
                            <TableHead>Vender Name</TableHead>
                            <TableHead>Specifications</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Vat</TableHead>
                            <TableHead>Remark</TableHead>
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
                              <TableCell>{toCurrency(item.total)}</TableCell>
                              <TableCell>{toCurrency(item.amount)}</TableCell>
                              <TableCell>
                                {toCurrency(item.includeVat)}
                              </TableCell>
                              <TableCell>{item.remark}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={5}> </TableCell>
                            <TableCell className='text-left'>
                              {data.sumQty?.toFixed(2)}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>{data.total}</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{data.sumVat?.toFixed(2)}</TableCell>
                            <TableCell colSpan={2} className='text-center'>
                              {data.amount?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>

                    <div className='mb-3 mt-2 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='mb-2  flex items-center'>
                        <IconFile />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          File Attach
                        </Label>
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
                          {data.purchaseRequestFileAttach?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                {item.fileName}
                              </TableCell>

                              <TableCell className='w-[8rem]'>
                                
                                {/* <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() => openFile(item.path)}
                                >
                                  <IconEye size={20} />
                                </Button> */}

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
                            <TableCell
                              colSpan={10}
                              className='text-right'
                            ></TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>

                    <DialogFooter>
                      <Button
                        loading={onloading}
                        type='submit'
                        variant='button'
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
