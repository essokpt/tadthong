'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { updateSaleOrder } from '@/services/saleOrderApi'

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
  const { handleSubmit, register } = useForm()
//  const [onloading, setOnloading] = useState(false)
 // const [customers, setCustomer] = useState<CustomerType[]>([])

  // function handleChangeCustomer(e: ChangeEvent<HTMLSelectElement>) {
  //   console.log('handleChangeCustomer', e.target.value)
  //   setValue('customerId', parseInt(e.target.value))
  // }

  async function updateData(data: any) {
    //setOnloading(true)
    console.log('updateData:', data)

    const res: any = await updateSaleOrder(data)

    if (res.status == 200) {
      setTimeout(() => {
        //setOnloading(false)
        onClose()
      }, 1000)
    }
  }

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

          <Tabs defaultValue='general' className='h-screen w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='general'>General Information</TabsTrigger>
              <TabsTrigger value='materiallist'>Item List</TabsTrigger>
            </TabsList>
            <TabsContent value='general'>
              <Card>
                <CardContent className='h-[35rem] space-y-2'>
                  <div className='grid gap-4 '>
                    <form onSubmit={handleSubmit(updateData)}>
                      <div className='grid grid-cols-2 gap-2 '>
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
                            {...register('poNumber')}
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
                            {...register('poNumber')}
                            defaultValue={
                              data.customer?.customerBillings?.address
                            }
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
                            {...register('carRegistration')}
                            defaultValue={data.currency}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='paymentTerm'
                          >
                            paymentTerm
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            {...register('driverName')}
                            defaultValue={data.paymentTerm}
                          />
                        </div>

                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='total'
                          >
                            Total
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            {...register('total')}
                            defaultValue={data.total}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='vat'
                          >
                            Vat
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            {...register('vat')}
                            defaultValue={data.vat}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='amount'
                          >
                            Amount
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.amount}
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
                        <div className='grid col-span-2'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='cause'
                          >
                            Cause
                          </Label>
                          <Textarea
                          readOnly
                            className='text-[0.8rem]'
                            {...register('cause')}
                            defaultValue={data.cause}
                          />
                        </div>
                      </div>

                      <br />
                        {/* <Button type='submit' loading={onloading} >
                            Update
                          </Button> */}
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='materiallist'>
              <Card className='min-h-full'>
                <CardContent className='h-[35rem] space-y-2'>
                  <div className='grid gap-4'>
                    <Table className='overflow-scroll w-[100rem]'>
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

                            <TableCell>
                              {item.saleOrderItems?.quantity}
                            </TableCell>
                            <TableCell>
                              {item.saleOrderItems?.unitPrice}
                            </TableCell>
                            <TableCell>{item.saleOrderItems?.amount}</TableCell>
                            <TableCell>
                              {item.saleOrderItems?.underCutPrice}
                            </TableCell>

                            <TableCell>
                              {item.saleOrderItems?.cuttingWeight}
                            </TableCell>
                            <TableCell>
                              {item.saleOrderItems?.afterCutPrice}
                            </TableCell>
                            <TableCell>
                              {item.saleOrderItems?.afterCutQuantity}
                            </TableCell>
                            <TableCell>
                              {item.saleOrderItems?.afterAmount}
                            </TableCell>

                            <TableCell>
                              {item.saleOrderItems?.sourceHumidity}
                            </TableCell>
                            <TableCell>
                              {item.saleOrderItems?.destinationHumidity}
                            </TableCell>
                            <TableCell>
                              {item.saleOrderItems?.destinationWeighingScale}
                            </TableCell>
                          
                          </TableRow>
                        ))}
                      </TableBody>
                     
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
