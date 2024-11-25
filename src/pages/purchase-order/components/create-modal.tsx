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
  itemMasterId: string
  code: string
  desc: string
  quantity: number
  price: number
  amount: number
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
  const { handleSubmit } = useForm()

  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [selectItem, setSelectItem] = useState('')
 

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
  function handleChangeVender(e: ChangeEvent<HTMLSelectElement>) {
    //setAction(e.target.value)
    // getPrice().then((data) => setVender(data))
    setSelectItem(e.target.value)
    console.log('handleChangeVender', e.target.value)
  }

  async function addData(data: any) {
    //setOnloading(true)
    const itemmasterid: any = itemMaster.find((item) => item.code == selectItem)
    data.itemMasterId = itemmasterid.id
    data.code = itemmasterid.code
    data.desc = itemmasterid.name
    data.quantity = editData.quantity
    data.price = editData.price
    data.amount = 0
    console.log('add new item', data)
    createData(data)
    onClose()
  }

  function handleChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
    
   editData.quantity = parseInt(e.target.value)
   editData.amount = editData.quantity * editData.price
    //console.log('handleChangePrice id', id)
    
   
    console.log('handleChangePrice value', editData)
  }

  function handleChangePrice(e: ChangeEvent<HTMLInputElement>) {    
    editData.price = parseInt(e.target.value)
    editData.amount = editData.quantity * editData.price
     //console.log('handleChangePrice id', id)   
    
     console.log('handleChangePrice value', editData)
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
                  onChange={handleChangeVender}
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
                <Label
                  className='py-1 text-[0.8rem] text-muted-foreground'
                  htmlFor='description'
                >
                  Quantity
                </Label>
                <Input
                  className='w-[100px]'
                  type='number'
                  // id={item.code}
                  defaultValue={editData.quantity}
                  onChange={handleChangeQuantity}
                />
              </div>
              <div className='grid'>
                <Label
                  className='py-1 text-[0.8rem] text-muted-foreground'
                  htmlFor='description'
                >
                  Price
                </Label>
                <Input
                  className='w-[100px]'
                  type='number'
                  // id={item.code}
                  defaultValue={editData.price}
                  onChange={handleChangePrice}
                />
              </div>
              </div>
              <Button loading={loading} type='submit'>
                Save changes
              </Button>
            </form>
            {/* <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-3 gap-2 '>
                  <FormField
                    control={form.control}
                    name='selectedItem'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a item master' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {itemMaster?.map((item) => (
                              <SelectItem key={item.id} value={item.code}>
                                {item.code}-{item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='quantity'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <br />
                <DialogFooter>
                  <Button loading={loading} type='submit'>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
