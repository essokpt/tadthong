/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
//import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

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
import { PurchaseOrder } from '../components/schema'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import { format } from 'date-fns'
import {
  createReceiveOrderItem,
  updatePurchaseOrderItem,
} from '@/services/purchaseOrderApi'
import {
  createInventory,
  createInventoryHistory,
} from '@/services/inventoryApi'
import usePermission from '@/hooks/use-permission'
import { toCurrency } from '@/lib/utils'

import React from 'react'
import { CalendarIcon } from 'lucide-react'

import { CalendarModal } from './calendar-modal'

interface ReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  data: PurchaseOrder
  isOpenReceiptDate?: boolean
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

//const isOpenReceiptDate = localStorage.getItem('isOpenReceiptDate')

export const ReceiveModal: React.FC<ReceiveModalProps> = ({
  isOpen,
  onClose,
  data,
  isOpenReceiptDate
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [onloading, setOnloading] = useState(false)

  const [locations, setLocation] = useState<LocationType[]>([])
    const [dateIndex, setDateIndex] = useState(0)
  
  const [openCalendar, setOpenCalendar] = useState(false)

  const userid: any = localStorage.getItem('userId')
  const today = new Date()

  const rule: any = usePermission('poReceive')

  function handleChangePrice(e: ChangeEvent<HTMLInputElement>) {
    console.log('handleChangePrice value', e.target.id)

    const findIndex: any = data.purchaseOrderItems.findIndex(
      (item) => item.id == e.target.id
    )
    if (findIndex != -1) {
      data.purchaseOrderItems[findIndex].receiveQuantity = parseInt(
        e.target.value
      )
      console.log('handleChangePrice', data.purchaseOrderItems[findIndex])
    }
  }

  function handleChangeLocation(e: ChangeEvent<HTMLSelectElement>) {
    const findIndex: any = data.purchaseOrderItems.findIndex(
      (item) => item.id == e.target.id
    )
    if (findIndex != -1) {
      data.purchaseOrderItems[findIndex].locationId = parseInt(e.target.value)
      data.purchaseOrderItems[findIndex].userId = parseInt(userid)
      // data.purchaseOrderItems[findIndex].receiveDate = format(
      //   today,
      //   'yyyy-MM-dd'
      // )
    }
    console.log('handleChange Location', data.purchaseOrderItems)
  }

  async function updateReceive() {
    setOnloading(true)
   
    for (let index = 0; index < data.purchaseOrderItems.length; index++) {
      const receiptDateValue = data.purchaseOrderItems[index].receiveDate? format(data.purchaseOrderItems[index].receiveDate,'yyyy-MM-dd'): format(today, 'yyyy-MM-dd')
         data.purchaseOrderItems[index].receiveDate = receiptDateValue

      if (data.purchaseOrderItems[index].receiveQuantity > 0) {
        data.purchaseOrderItems[index].received =
          data.purchaseOrderItems[index].received +
          data.purchaseOrderItems[index].receiveQuantity
        data.purchaseOrderItems[index].balance =
          data.purchaseOrderItems[index].quantity -
          data.purchaseOrderItems[index].received
        data.purchaseOrderItems[index].status =
          data.purchaseOrderItems[index].balance == 0 ? 'Completed' : 'Pending'
        //add onhand stock
        //data.purchaseOrderItems[index].locationId = data.locationId
        data.purchaseOrderItems[index].warehouseId = 1
        data.purchaseOrderItems[index].branchesId = data.branchId
        //add hisory
        data.purchaseOrderItems[index].stockType = 'PO-Receipt'
        data.purchaseOrderItems[index].ref = data.code
        data.purchaseOrderItems[index].stockBy = data.user.firstName
        // data.purchaseOrderItems[index].status = 'Stock In'
        data.purchaseOrderItems[index].userId = parseInt(userid)

      }
    }

    console.log('updateReceive', data.purchaseOrderItems)

    const res: any = await createReceiveOrderItem(data.purchaseOrderItems)
    if (res.status == 200) {
      const checkReceiptCompleted = data.purchaseOrderItems.find(
        (a) => a.balance > 0
      )
      console.log('Check Receipt Completed', checkReceiptCompleted)
      if (!checkReceiptCompleted) {
        data.status = 'Completed'
        console.log('Check Receipt Completed', data)
      }
      const response: any = await updatePurchaseOrderItem(data)

      if (response.status == 200) {
        console.log('updatePurchaseOrderItem -ok')

        await createInventory(data.purchaseOrderItems)
        await createInventoryHistory(data.purchaseOrderItems)
       //if(history.id){
        // call store SP_PURCHASE_COST  { @stockHistoryId, @UserId }
       // await Call_SP_PURCHASE_COST(history.id, Number(userid))
       //}
      }
    }
    setTimeout(() => {
      setOnloading(false)
      onClose()
    }, 2000)
  }

  
  

  function handleReceiptDate(value: any) {
    console.log('handleReceiptDate', value)
    const findIndex: any = data.purchaseOrderItems.findIndex(
      (item:any) => item.id == dateIndex
    )
    if (findIndex != -1) {
      data.purchaseOrderItems[findIndex].receiveDate = value.selectDate
      console.log('set ReceiptDate', data.purchaseOrderItems[findIndex])
    }
    // setOpenCalendar(false)
    setOpenCalendar(false)
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
        <DialogContent className='h-screen max-w-full'>
          <DialogHeader>
            <DialogTitle>Receive Purchase-Order</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <Card>
            <CardContent className='h-[38rem] space-y-2'>
           
              <div className='grid gap-4'>
                <Table>
                  <TableCaption>A list items of purchase order.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Location</TableHead>

                      <TableHead>Value</TableHead>
                      <TableHead>Receipt Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.purchaseOrderItems?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className='font-medium'>
                          {item.itemMaster?.code}
                        </TableCell>
                        <TableCell>{item.itemMaster?.name}</TableCell>
                        <TableCell>{toCurrency(item.quantity)}</TableCell>
                        <TableCell>{toCurrency(item.received)}</TableCell>

                        <TableCell>{toCurrency(item.balance)}</TableCell>
                        <TableCell>
                          <select
                            //defaultValue={item.branch.branchName}
                            disabled={item.balance == 0}
                            id={item.id}
                            onChange={handleChangeLocation}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={item.locationId}
                            >
                              - Please Select Location
                            </option>
                            {locations?.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </TableCell>

                        <TableCell>
                          <Input
                            disabled={item.balance == 0}
                            className='w-[100px]'
                            type='number'
                            min={0}
                            max={item.quantity - item.received}
                            id={item.id}
                            //value={item.quantity - item.received}
                            defaultValue={0}
                            onChange={handleChangePrice}
                          />
                        </TableCell>
                        <TableCell className='w-[180px]'>
                          <div className='flex items-center gap-2'>
                            <Input  readOnly value={item.receiveDate? format(item.receiveDate, 'dd-MM-yyyy') : format(today, 'dd-MM-yyyy')} defaultValue={format(today, 'dd-MM-yyyy')}/>
                            <CalendarIcon
                              className={`${!isOpenReceiptDate ? 'pointer-events-none opacity-50' : 'none'}`}

                              size={20}
                              onClick={() => {
                                setDateIndex(Number(item.id))
                                setOpenCalendar(true)
                              }}
                            />
                          </div>
                        </TableCell>

                        <TableCell className='w-[180px]'>
                          {item.amount}
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Button
                          disabled={!rule[0]?.canUpdate}
                          loading={onloading}
                          variant='button'
                          size='sm'
                          className='float-end mt-8 h-8'
                          onClick={() => updateReceive()}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <CalendarModal
        isOpen={openCalendar} 
        onClose={() => setOpenCalendar(false)}
        onSelectDate={ handleReceiptDate}
      />
    </>
  )
}
