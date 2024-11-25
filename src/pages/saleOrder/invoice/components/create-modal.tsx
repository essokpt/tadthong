'use client'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { getItemMaster } from '@/services/itemApi'
import { ItemType } from '@/pages/master/item/components/type'
import { Label } from '@/components/ui/label'

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
  id: number
  itemMasterId: number
  itemMaster: {
    id: string
    code: string
    name: string
  }
  saleOrderId: number
  quantity: number
  unitPrice: number
  amount: number
  underCutPrice: number
  cuttingWeight: number
  afterCutPrice: number
  afterCutQuantity: number
  afterAmount: number
  sourceHumidity: number
  destinationHumidity: number
  destinationWeighingScale: string
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
  const { handleSubmit, register, setValue } = useForm()

  const [itemMaster, setItemMaster] = useState<ItemType[]>([])

  // async function updateData(data: any) {

  //   console.log('updateData', data)
  //   loading = true

  //   const res: any = await updateBom(data)
  //   loading = false
  //   if (res.status == 200) {
  //     setTimeout(() => {
  //       loading = false

  //       onClose()
  //     }, 1000)
  //   }
  // }

  // async function onSubmit(data: z.infer<typeof formSchema>) {
  //setOnloading(true)
  // const itemmasterid: any = itemMaster.find(
  //   (item) => item.code == data.selectedItem
  // )
  // data.itemMasterId = itemmasterid.id
  // data.code = itemmasterid.code
  // data.desc = itemmasterid.name
  // data.outEffectiveDate = format(data.OutDate, 'yyyy-MM-dd')

  // console.log('add new item', data)
  // createData(data)
  // onClose()
  // const res: any = await createBom(data)
  // if (res.status == 200) {
  //   console.log('createVender -success', res.status)
  //   navigate('/master/bom', { replace: true })
  // }
  //}
  

  async function addData(data: any) { 
    console.log('add new item', data)
    createData(data)
     onClose()
  }

  function handleChangeItem(e: ChangeEvent<HTMLSelectElement>) {
    setValue('itemMasterId', parseInt(e.target.value))

    console.log('handleChangeItem value', editData)
  }


  useEffect(() => {
    setIsMounted(true)
    getItemMaster().then((data) => setItemMaster(data))
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
              <div className='grid grid-cols-3 gap-2 '>
                <div className='grid'>
                  <Label>Item</Label>
                  <select
                    onChange={handleChangeItem}
                    className='mt-1 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={editData.itemMaster.id}                    

                    >
                      {editData.itemMaster.name}
                    </option>
                    {itemMaster.map((item) => (
                      <option
                        key={item.id}
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value={item.id}
                       

                      >
                        {item.code}-{item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Quantity
                  </Label>
                  <Input
                    type='number'
                    defaultValue={editData.quantity}
                    {...register('quantity')}
                    //onChange={handleChangeQuantity}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Unit Price
                  </Label>
                  <Input
                    type='number'
                    defaultValue={editData.unitPrice}
                    {...register('unitPrice')}
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
                    type='number'
                    defaultValue={editData.amount}
                    {...register('amount')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Undercut Price
                  </Label>
                  <Input
                    type='number'
                    
                    defaultValue={editData.underCutPrice}
                    {...register('underCutPrice')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Cutting Weight
                  </Label>
                  <Input
                    type='number'
                    defaultValue={editData.cuttingWeight}
                    {...register('cuttingWeight')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Aftercut Price
                  </Label>
                  <Input
                    type='number'
                    disabled
                    defaultValue={editData.afterCutPrice}
                    {...register('afterCutPrice')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Aftercut Quantity
                  </Label>
                  <Input
                    type='number'
                    disabled
                    defaultValue={editData.afterCutQuantity}
                    {...register('afterCutQuantity')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    After Amount
                  </Label>
                  <Input
                    type='number'
                    disabled
                    defaultValue={editData.afterAmount}
                    {...register('afterAmount')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Source Humidity
                  </Label>
                  <Input
                    type='number'
                    defaultValue={editData.sourceHumidity}
                    {...register('sourceHumidity')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Destination Humidity
                  </Label>
                  <Input
                    type='number'
                    defaultValue={editData.destinationHumidity}
                    {...register('destinationHumidity')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Destination Weighing Scale
                  </Label>
                  <Input
                    defaultValue={editData.destinationWeighingScale}
                    {...register('destinationWeighingScale')}
                  />
                </div>
                <div className='col-span-3 grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Remark
                  </Label>
                  <Input
                    defaultValue={editData.remark}
                    {...register('remark')}
                  />
                </div>
              </div>
              <br></br>
              <Button loading={loading} type='submit'>
                Save changes
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
