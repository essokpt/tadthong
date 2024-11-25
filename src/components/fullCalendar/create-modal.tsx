'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'


interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
 
}
// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

export const CreateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData
}) => {
  const [isMounted, setIsMounted] = useState(false)
 // const { handleSubmit, register, setValue } = useForm()
 // const [onloading, setOnloading] = useState(false)
  const { handleSubmit, register } = useForm()

  async function addData(data: any) {
   console.log("addData", data);
   
   createData(data)
   onClose()
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
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Create WIP</DialogTitle>
          </DialogHeader>
       
          <form onSubmit={handleSubmit(addData)}>
              <div className='grid grid-cols-2 gap-2 '>
                
                
                <div className='col-span-2 grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='specification'
                  >
                    Name
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    // id={item.code}
                    //defaultValue={editData.specification}
                    {...register('name')}
                  />
                </div>             
             
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='value1'
                  >
                    ยอดยกมา
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    type='number'
                    // id={item.code}
                   // defaultValue={editData.quantity}
                   // onChange={handleChangeQuantity}
                   {...register('receiptValue')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='Price'
                  >
                    ผลิตเพิ่ม
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    type='float'
                    // id={item.code}
                   // defaultValue={editData.price}
                    //onChange={handleChangePrice}
                    {...register('additional')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='remark'
                  >
                    ตัดออก
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    // id={item.code}
                   // defaultValue={editData.remark}
                   // {...register('remark')}
                   {...register('cuttingValue')}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='remark'
                  >
                    ยอดยกไป
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    // id={item.code}
                   // defaultValue={editData.remark}
                   // {...register('remark')}
                   {...register('addValue')}
                  />
                </div>
              </div>
              <br />
              <DialogFooter>
                <Button loading={false} type='submit' className='w-[10rem]'>
                  Save changes
                </Button>
              </DialogFooter>
            </form>    
          
                       
        </DialogContent>
      </Dialog>
    </>
  )
}
