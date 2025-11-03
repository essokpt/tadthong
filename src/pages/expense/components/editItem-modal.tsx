'use client'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { VenderType } from '@/pages/master/vender/components/type'
import { getVenders } from '@/services/vendersApi'
import { PurchaseRequestItem } from './schema'
import { Textarea } from '@/components/ui/textarea'
import { updatePurchaseRequestItem } from '@/services/purchaseRequestApi'
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void 
  editData: PurchaseRequestItem
}

export const EditItemModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
 
  editData,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [onloading, setOnloading] = useState(false)
  const { handleSubmit, register } = useForm()
  const [venders, setVender] = useState<VenderType[]>([])
  const [selectVender, setSelectVender] = useState('')
 

  function handleChangeVender(e: ChangeEvent<HTMLSelectElement>) {
    setSelectVender(e.target.value)
    console.log('handleChangeVender', e.target.value)
  }

  async function onsubmit(data: any) {
    setOnloading(true)
    //console.log('update item', data)
    const venderid: any = venders.find((item) => item.id == selectVender)
    if(venderid) {
      editData.venderId = venderid.id
    }    

    //editData.quantity = data.quantity
    //editData.price = data.price
    data.total = data.quantity * data.price

    //let vatPercent = (data.amount * 0.07)
    editData.includeVat = (data.quantity * data.price) * 0.07
    //editData.amount = data.quantity * editData.price + editData.total * 0.07
    editData.amount = editData.quantity * editData.price
    console.log('update item', editData)

    const res: any = await updatePurchaseRequestItem(editData)

    if (res.status == 200) {
      setTimeout(() => {
        setOnloading(false)       
        onClose()
      }, 1000)
    }
  }

  function handleChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
    editData.quantity = parseInt(e.target.value)
    editData.total = parseInt(e.target.value) * editData.price
    //editData.amount = parseInt(e.target.value) * editData.price
    
    console.log('handleChangePrice value', editData)
  }

  function handleChangePrice(e: ChangeEvent<HTMLInputElement>) {
    editData.price = parseInt(e.target.value)
    editData.total = editData.quantity * editData.price
    //console.log('handleChangePrice id', id)

    console.log('handleChangePrice value', editData)
  }

  useEffect(() => {
    setIsMounted(true)
    getVenders().then((data) => setVender(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-lg'>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid gap-4'>
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className='grid grid-cols-2 gap-2 '>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='Item Code'
                  >
                    Item Code
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    defaultValue={editData.itemMaster.code}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='itemname'
                  >
                    Item Name
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    defaultValue={editData.itemMaster.name}
                    //{...register('itemName')}
                  />
                </div>
                <div className='grid'>
                  <Label>Vender</Label>
                  <select
                    onChange={handleChangeVender}
                    defaultValue={editData.venderId}
                    className='mt-1 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={editData.venderId}
                    >
                      {editData.vender.companyName}
                    </option>
                    {venders.map((item) => (
                      <option
                        key={item.id}
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value={item.id}
                      >
                        {item.code}-{item.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-span-2 grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='specification'
                  >
                    Specification
                  </Label>
                  <Textarea
                    className='text-[0.8rem]'
                    readOnly
                    defaultValue={editData.specification}
                    {...register('specification')}
                  />
                </div>
              </div>
              <div className='grid grid-cols-3 gap-2 '>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='Quantity'
                  >
                    Quantity
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    type='number'
                    // id={item.code}
                    defaultValue={editData.quantity}
                    onChange={handleChangeQuantity}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='Price'
                  >
                    Unit Price
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    type='number'
                    // id={item.code}
                    defaultValue={editData.price}
                    onChange={handleChangePrice}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='amount'
                  >
                    Amount
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    type='number'
                    // id={item.code}
                    defaultValue={editData.amount}
                    {...register('amount')}
                   // onChange={handleChangeQuantity}
                  />
                </div>
                <div className='grid col-span-3'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='remark'
                  >
                    Remark
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    // id={item.code}
                    defaultValue={editData.remark}
                    {...register('remark')}
                  />
                </div>
              </div>
              <br />
              <DialogFooter>
                <Button loading={onloading} type='submit' className='w-[10rem]'>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
