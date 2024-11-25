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
import { ImportMaterial } from '../../components/schema'
import { updateMaterial } from '@/services/materialApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconCheck, IconChecklist } from '@tabler/icons-react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: ImportMaterial
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
      payload.status = 'approved'
    }
    if (action === 'reject') {
      payload.status = 'reject'
    }
    payload.id = data.id
    payload.approvedBy = localStorage.getItem('user')
    payload.approveDate = format(today, 'yyyy-MM-dd')
    console.log('updateData:', payload)

    const res: any = await updateMaterial(payload)

    if (res.status == 200) {
      console.log('updateMaterial approve success')
    }

    setTimeout(() => {
      setOnloading(false)
      setRefresh(true)
      onClose()
    }, 1000)
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
        <DialogContent className='h-screen max-w-full '>
          <DialogHeader>
            <DialogTitle>Approve </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid h-screen w-full gap-4 overflow-scroll'>
            <Card>
              <CardContent className='h-[45rem] space-y-2 overflow-scroll'>
                <div className='grid gap-4'>
                  <form onSubmit={handleSubmit(updateData)}>
                    <div className='mb-3 mt-2 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='mb-2  flex items-center'>
                        <IconCheck />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Approve Action.
                        </Label>
                      </div>
                      <div>
                        <Label className='py-2' htmlFor='action'>
                          Action
                        </Label>
                        <select
                          //defaultValue={data.status}
                          onChange={handleChangeRole}
                          className='flex mt-1 h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
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
                            value='reject'
                          >
                            Reject
                          </option>
                        </select>
                      </div>
                      <div className='grid'>
                        <Label className='py-1' htmlFor='remark'>
                          Comment
                        </Label>
                        <Textarea
                          className='text-[0.8rem]'
                          {...register('remark')}
                          defaultValue={data.remark}
                        />
                      </div>
                    </div>
                    <div className='mb-3 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        <IconChecklist />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Material Information.
                        </Label>
                      </div>
                      <div className='grid gap-4'>
                        <Table className='w-[150rem] overflow-scroll'>
                          <TableCaption>
                            A list of your recent items.
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead className='w-[100px]'>
                                Import Id
                              </TableHead>
                              <TableHead className='w-[100px]'>
                                Queue No
                              </TableHead>
                              <TableHead>Card No</TableHead>
                              <TableHead>Car No</TableHead>
                              <TableHead>Date In</TableHead>
                              <TableHead>Time In</TableHead>
                              <TableHead>Weight In</TableHead>
                              <TableHead>Date Out</TableHead>
                              <TableHead>Time Out</TableHead>
                              <TableHead>Weight Out</TableHead>
                              <TableHead>Type Code</TableHead>
                              <TableHead>Customer Code</TableHead>

                              <TableHead>Product Code</TableHead>
                              <TableHead>Col1</TableHead>
                              <TableHead>Col2</TableHead>
                              <TableHead>Col3</TableHead>
                              <TableHead>Remark</TableHead>
                              <TableHead>Price Receipt</TableHead>
                              <TableHead>Col4</TableHead>
                              <TableHead>Col5</TableHead>
                              <TableHead>Col6</TableHead>
                              <TableHead>Col7</TableHead>
                              <TableHead>Col8</TableHead>
                              <TableHead>Col9</TableHead>
                              <TableHead>Col10</TableHead>
                              <TableHead>Col11</TableHead>
                              <TableHead>Col12</TableHead>
                              <TableHead>Col13</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.materials?.map((item) => (
                              <TableRow key={item.importId}>
                                <TableCell>{item.importId}</TableCell>
                                <TableCell>{item.queueNo}</TableCell>
                                <TableCell>{item.cardNo}</TableCell>
                                <TableCell>{item.carNo}</TableCell>
                                <TableCell>{item.dateIn}</TableCell>
                                <TableCell>{item.timeIn}</TableCell>

                                <TableCell>{item.weightIn}</TableCell>
                                <TableCell>{item.dateOut}</TableCell>
                                <TableCell>{item.timeOut}</TableCell>
                                <TableCell>{item.weightOut}</TableCell>
                                <TableCell>{item.typeCode}</TableCell>

                                <TableCell>{item.customerCode}</TableCell>
                                <TableCell>{item.productCode}</TableCell>
                                <TableCell>{item.col1}</TableCell>
                                <TableCell>{item.col2}</TableCell>
                                <TableCell>{item.col3}</TableCell>

                                <TableCell>{item.remark}</TableCell>
                                <TableCell>{item.priceReceipt}</TableCell>
                                <TableCell>{item.col4}</TableCell>
                                <TableCell>{item.col5}</TableCell>
                                <TableCell>{item.col6}</TableCell>

                                <TableCell>{item.col7}</TableCell>
                                <TableCell>{item.col8}</TableCell>
                                <TableCell>{item.col9}</TableCell>
                                <TableCell>{item.col10}</TableCell>
                                <TableCell>{item.col11}</TableCell>
                                <TableCell>{item.col12}</TableCell>
                                <TableCell>{item.col13}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter></TableFooter>
                        </Table>
                      </div>
                    </div>
                    <br />

                    <br />
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
