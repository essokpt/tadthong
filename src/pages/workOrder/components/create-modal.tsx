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

import { getItemMaster } from '@/services/itemApi'
import { ItemType } from '@/pages/master/item/components/type'
import { Label } from '@/components/ui/label'
import { VenderType } from '@/pages/master/vender/components/type'
import { getVenders } from '@/services/vendersApi'

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
  editData: ItemList
}
type ItemList = {
  id: string
  itemMasterId: string
  code: string
  itemName : string
  venderId: string
  venderCode: string
  venderName : string
  quantity: number
  price: number
  amount: number
  specification: string
  total: number
  includeVat: number
  remark: string
}

export const CreateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
  editData,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const [onloading, setOnloading] = useState(false)
  const { handleSubmit, register } = useForm()

  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [venders, setVender] = useState<VenderType[]>([])

  const [selectItem, setSelectItem] = useState('')
  const [selectVender, setSelectVender] = useState('')
 
 
  function handleChangeItem(e: ChangeEvent<HTMLSelectElement>) {
    setSelectItem(e.target.value)
    console.log('handleChangeItem', e.target.value)
  }

  function handleChangeVender(e: ChangeEvent<HTMLSelectElement>) {
    setSelectVender(e.target.value)
    console.log('handleChangeVender', e.target.value)
  }

  async function addData(data: any) {
    //setOnloading(true)
    const itemmasterid: any = itemMaster.find((item) => item.code == selectItem)
    const venderid: any = venders.find((item) => item.code == selectVender)

    //data.id = crypto.randomUUID()
    data.itemMasterId = itemmasterid.id
    data.code = itemmasterid.code
    data.itemName = itemmasterid.name

    data.venderId = venderid.id
    data.venderCode = venderid.code
    data.venderName = venderid.companyName

    data.quantity = editData.quantity
    data.price = editData.price
    
    data.total = data.quantity * data.price 

    //let vatPercent = (data.amount * 0.07)
    data.includeVat =  data.total * 0.07
    data.amount =  (data.quantity * data.price) + (data.total * 0.07)
    console.log('add new item', data)

    createData(data)
    onClose()
  }

  function handleChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
    editData.quantity = parseInt(e.target.value)
    editData.total = editData.quantity * editData.price
    //console.log('handleChangePrice id', id)

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
    getItemMaster().then((data) => setItemMaster(data))
    getVenders().then((data) => setVender(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid gap-4'>
            <form onSubmit={handleSubmit(addData)}>
              <div className='grid grid-cols-2 gap-2 '>
                <div className='grid'>
                  <Label>Item</Label>
                  <select
                    onChange={handleChangeItem}
                    className='mt-1 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={editData.code}
                    >
                      {editData.code}
                    </option>
                    {itemMaster.map((item) => (
                      <option
                        key={item.id}
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value={item.code}
                      >
                        {item.code}-{item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid'>
                  <Label>Vender</Label>
                  <select
                    onChange={handleChangeVender}
                    className='mt-1 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={editData.code}
                    >
                      {editData.code}
                    </option>
                    {venders.map((item) => (
                      <option
                        key={item.id}
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value={item.code}
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
                  <Input
                    className='text-[0.8rem]'
                    // id={item.code}
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
                    htmlFor='remark'
                  >
                    Remark
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    // id={item.code}
                    defaultValue={editData.remark}
                    {...register('remark')}
                  />
                </div>
              
              </div>
              <br/>
              <DialogFooter>
                  <Button loading={loading} type='submit' className='w-[10rem]'>
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
