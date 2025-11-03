/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Invoice } from './schema'
import { findInvoiceById, findSaleOrder } from '@/services/saleOrderApi'
import '@/components/print/style.css'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { PageHeader } from '@/components/layouts/header'
import { IconChecklist, IconEye, IconInfoCircle } from '@tabler/icons-react'
import { EditModal } from '../../components/edit-modal'
import { SaleOrder } from '../../components/schema'
import { toCurrency } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const initialValue = {
  id: 0,
  code: '',
  cause: '',
  currency: '',
  paymentTerm: '',
  total: 0,
  vat: 0,
  amount: 0,
  createAt: '',
  status: '',
  mergeItem: false,
  customerId: 0,
  customer: {
    code: '',
    companyName: '',
    attn: '',
    address: '',
    district: '',
    subDistrict: '',
    province: '',
    zipcode: '',
    country: '',
    tax: '',
    paymentTerm: '',
    customerBillings: {
      address: '',
      district: '',
      subDistrict: '',
      province: '',
      zipcode: '',
      country: '',
      contactName: '',
    },
  },
  invoiceItems: [
    {
      id: '',
      saleOrderItems: {
        id: 0,
        itemMasterId: 0,
        itemMaster: {
          id: 0,
          code: '',
          name: '',
          stockingUom: '',
          convertFactor: 0,
        },
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
        uomType: '',
        saleOrder: {
          id: 0,
          code: '',
        },
      },
    },
  ],
}

const initialSaleOrderValue = {
  id: 0,
  selectLocation: '',
  selectCustomer: '',
  createBy: '',
  code: '',
  poNumber: '',
  workorderNo: '',
  cause: '',
  carRegistration: '',
  driverName: '',
  vat: 0,
  amount: 0,
  transportationCost: 0,
  shipTo: '',
  quota: '',
  inComplete: false,
  billingDate: new Date(),
  locationId: 0,
  location: {
    id: 0,
    name: '',
  },
  customerId: 0,
  customer: {
    code: '',
    companyName: '',
    attn: '',
    address: '',
    district: '',
    subDistrict: '',
    province: '',
    zipcode: '',
    country: '',
    tax: '',
    paymentTerm: '',
    customerBillings: {
      address: '',
      district: '',
      subDistrict: '',
      province: '',
      zipcode: '',
      country: '',
      contactName: '',
    },
  },
  userId: 0,
  user: {
    firstName: '',
  },
  createAt: '',
  remark: '',
  status: '',
  saleOrderItems: [
    {
      id: 0,
      itemMasterId: 0,
      itemMaster: {
        id: 0,
        code: '',
        name: '',
      },
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
      humidity: 0,
      adulteration: 0,
      other: 0,
      weighingMoney: 0,
      shipDown: 0,
      cashOther: 0,
      remark: '',
    },
  ],
  saleOrderAttachFiles: [
    {
      id: 0,
      fileName: '',
      path: '',
    },
  ],
}

export const ViewInvoice = () => {
  const [data, setData] = useState<Invoice>(initialValue)
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<SaleOrder>(initialSaleOrderValue)
  const [isMergeItem, setIsMergeItem] = useState(true)

  const { id } = useParams()

  async function findSaleOrderById(id: number) {
    const res: any = await findSaleOrder(id)
    //console.log('findSaleOrderById:', res)

    if (res.id) {
      console.log('SaleOrder data:', res)
      setEditValue(res)
      setIsEdit(true)
    }
  }

  //async function findInvoiceById(id: any) {
  //findInvoiceById(id).then((datas) => setData(datas.invoice))
  // const res: any = await findInvoiceById(id)
  // //console.log('findSaleOrderById:', res)

  // if (res.id) {
  //   console.log('SaleOrder data:', res)
  //   setData(res.invoice)
  // }
  //}

  useEffect(() => {
    findInvoiceById(id).then((datas) => {
      setData(datas.invoice)
      console.log('datas:', datas)
      if (datas.invoice.mergeItem) {
        setIsMergeItem(true)
      } else {
        setIsMergeItem(false)
      }
    })
  }, [id])

  

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Invoice Detail'
          icon={<IconInfoCircle size={45} className='mt-2 ' />}
        />
        {/* {data.id? (
          <Loading timeout={500} />
        ) : ( */}
        <Card>
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
                <div>
                  <RadioGroup
                    defaultValue={isMergeItem == true ? 'true' : 'false'}
                    className='flex items-center gap-3'
                    //onValueChange={handleRadioChange}
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='true' id='option-one' />
                      <Label htmlFor='option-one'>Merge items</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='false' id='option-two' />
                      <Label htmlFor='option-two'>Separate items</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className='mt-8 flex items-start space-x-2 space-y-0 rounded-md border p-2 shadow'>
                  <Checkbox
                    id='mergeItem'
                    //  {...register('mergeItem')}
                    //id={data.id}
                    // onCheckedChange={() =>
                    //   onCheckMergeItemFlag(data.mergeItem)
                    // }
                    defaultChecked={isMergeItem}
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

                        <TableCell>{item.saleOrderItems?.quantity}</TableCell>
                        <TableCell>{item.saleOrderItems?.unitPrice}</TableCell>
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
                        <TableCell>
                          <IconEye
                            className='mr-2 h-4 w-4'
                            onClick={() =>
                              findSaleOrderById(
                                item.saleOrderItems.saleOrder?.id
                              )
                            }
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
        {/* )} */}
        <EditModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          data={editValue}
          isEdit={false}
        />
      </LayoutBody>
    </Layout>
  )
}
