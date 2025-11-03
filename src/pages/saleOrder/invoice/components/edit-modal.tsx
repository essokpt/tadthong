/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
//import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
//import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Invoice } from './schema'
//import { CustomerType } from '@/pages/master/customer/components/type'
//import { getCustomer } from '@/services/customerApi'
//import { updateSaleOrder } from '@/services/saleOrderApi'
import { Checkbox } from '@/components/ui/checkbox'
import { IconChecklist, IconEye, IconInfoCircle } from '@tabler/icons-react'
import { toCurrency } from '@/lib/utils'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Invoice
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
 // const { handleSubmit, register } = useForm()
  //  const [onloading, setOnloading] = useState(false)
  // const [customers, setCustomer] = useState<CustomerType[]>([])

  // function handleChangeCustomer(e: ChangeEvent<HTMLSelectElement>) {
  //   console.log('handleChangeCustomer', e.target.value)
  //   setValue('customerId', parseInt(e.target.value))
  // }

  //  function onCheckMergeItemFlag(e: any) {
  //   if (e) {
  //     data.mergeItem = false
  //   } else {
  //     data.mergeItem = true
  //   }

  //   console.log('onCheck:', e)
  // }

  // async function updateData(data: any) {
  //   //setOnloading(true)
  //   console.log('updateData:', data)

  //   const res: any = await updateSaleOrder(data)

  //   if (res.status == 200) {
  //     setTimeout(() => {
  //       //setOnloading(false)
  //       onClose()
  //     }, 1000)
  //   }
  // }

  useEffect(() => {
    setIsMounted(true)
    //getCustomer().then((data) => setCustomer(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='h-screen max-w-full'>
          <DialogHeader>
            <DialogTitle>Invoice Detail</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

         

           <Card className='overflow-scroll'>
          <CardContent className='h-auto space-y-2'>
            <div className='grid gap-4 '>
              <div className='mb-3 mt-3 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <div className='col-span-2 mb-2  flex items-center'>
                  <IconInfoCircle />
                  <Label htmlFor='terms' className='ml-3 text-lg'>
                    General Information.
                  </Label>
                </div>
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
                    //{...register('createAt')}
                    defaultValue={data.createAt}
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
                    // {...register('code')}
                    defaultValue={data.code}
                  />
                </div>

                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='poNumber'
                  >
                    Customer Name
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    // {...register('poNumber')}
                    defaultValue={data.customer?.companyName}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='poNumber'
                  >
                    Billing
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    // {...register('poNumber')}
                    defaultValue={data.customer?.customerBillings?.address}
                  />
                </div>

                <div className='grid '>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='currency'
                  >
                    Currency
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    // {...register('carRegistration')}
                    defaultValue={data.currency}
                  />
                </div>
                <div className='grid '>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='paymentTerm'
                  >
                    Payment Term
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    //{...register('driverName')}
                    defaultValue={data.paymentTerm}
                  />
                </div>

                <div className='grid '>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='total'
                  >
                    Total(Baht)
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    // {...register('total')}
                    defaultValue={toCurrency(data.total)}
                  />
                </div>
                <div className='grid '>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='vat'
                  >
                    Vat(Baht)
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    // {...register('vat')}
                    defaultValue={toCurrency(data.vat)}
                  />
                </div>
                <div className='grid '>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='amount'
                  >
                    Amount(Baht)
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    defaultValue={toCurrency(data.amount)}
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
                    //{...register('status')}
                    defaultValue={data.status}
                  />
                </div>
                
                <div className='mt-8 flex items-start space-x-2 space-y-0 rounded-md border p-2 shadow'>
                  <Checkbox
                    id='mergeItem'
                    //  {...register('mergeItem')}
                    //id={data.id}
                    // onCheckedChange={() =>
                    //   onCheckMergeItemFlag(data.mergeItem)
                    // }
                    defaultChecked={data.mergeItem}
                  />

                  <label
                    htmlFor='mergeItem'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    Merge Item {data.mergeItem ? 'Yes' : 'No'}
                  </label>
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
                    // {...register('cause')}
                    defaultValue={data.cause}
                  />
                </div>
              </div>

              <div className='mb-3 mt-3 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <div className='mb-2  flex items-center'>
                  <IconChecklist />
                  <Label htmlFor='terms' className='ml-3 text-lg'>
                    Items List.
                  </Label>
                </div>
                <Table className='w-[100rem] overflow-scroll'>
                  <TableCaption>A list of your recent items.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Saleorder Code.</TableHead>
                      <TableHead>Item Code</TableHead>
                      <TableHead className='w-[12rem]'>Item Name</TableHead>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.invoiceItems?.map((item) => (
                      <TableRow key={item.saleOrderItems?.id}>
                        <TableCell className='font-medium'>
                          {item.saleOrderItems.saleOrder.code}
                        </TableCell>
                        <TableCell className='font-medium'>
                          {item.saleOrderItems.itemMaster?.code}
                        </TableCell>
                        <TableCell className='w-[10rem]'>
                          {item.saleOrderItems.itemMaster?.name}
                        </TableCell>

                        <TableCell>{item.saleOrderItems?.quantity ? toCurrency(item.saleOrderItems?.quantity) : 0}</TableCell>
                        <TableCell>{item.saleOrderItems?.unitPrice ? toCurrency(item.saleOrderItems?.unitPrice) : 0}</TableCell>
                        <TableCell>{item.saleOrderItems?.amount ? toCurrency(item.saleOrderItems?.amount) : 0}</TableCell>
                        <TableCell>
                          {item.saleOrderItems?.underCutPrice ? toCurrency(item.saleOrderItems?.underCutPrice) : 0}
                        </TableCell>

                        <TableCell>
                          {item.saleOrderItems?.cuttingWeight}
                        </TableCell>
                        <TableCell>
                          {item.saleOrderItems?.afterCutPrice ? toCurrency(item.saleOrderItems?.afterCutPrice) : 0}
                        </TableCell>
                        <TableCell>
                          {item.saleOrderItems?.afterCutQuantity ? toCurrency(item.saleOrderItems?.afterCutQuantity) : 0}
                        </TableCell>
                        <TableCell>
                          {item.saleOrderItems?.afterAmount ? toCurrency(item.saleOrderItems?.afterAmount) : 0  }
                        </TableCell>

                        <TableCell>
                          {item.saleOrderItems?.sourceHumidity ? toCurrency(item.saleOrderItems?.sourceHumidity) : 0}
                        </TableCell>
                        <TableCell>
                          {item.saleOrderItems?.destinationHumidity ? toCurrency(item.saleOrderItems?.destinationHumidity) : 0}
                        </TableCell>
                        <TableCell>
                          {item.saleOrderItems?.destinationWeighingScale}
                        </TableCell>
                        <TableCell>
                          <IconEye
                            className='mr-2 h-4 w-4'
                            // onClick={() =>
                            //   findSaleOrderById(
                            //     item.saleOrderItems.saleOrder?.id
                            //   )
                            // }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
