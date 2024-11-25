'use client'
import { useContext, useEffect, useState } from 'react'
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
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { UomType } from './type'
import { updateUom } from '@/services/uomApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void 
  data: UomType
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose, 
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  const { setRefresh } = useContext(ApiContext) as ApiType

  async function updateData(data: any) {
    setOnloading(true)
    const res: any = await updateUom(data)
    
    if (res.status == 200) {
      console.log(res.data);
      
    }
    setTimeout(() => {
      setOnloading(false)      
      onClose()
      setRefresh(true)
    }, 1000)
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
        <DialogContent className='max-w-screen-sm '>
          <DialogHeader>
            <DialogTitle>Edit Uom</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <form onSubmit={handleSubmit(updateData)}>
              <div className='grid grid-cols-1 gap-2 '>
                <Input
                  className='hidden'
                  {...register('id')}
                  defaultValue={data.id}
                />

                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='code'
                  >
                    Code
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    {...register('code')}
                    defaultValue={data.code}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                   Description
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    {...register('description')}
                    defaultValue={data.description}
                  />
                </div>
                <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='status'
                          >
                            Status
                          </Label>
                          <select
                            {...register('status')}
                            defaultValue={data.status}
                            // id={item.id}
                            // onChange={handleChangeBranch}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            {/* <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.status}
                            >
                              {data.status}
                            </option> */}

                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value='Active'
                            >
                              Active
                            </option>
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value='Inactive'
                            >
                              Inactive
                            </option>
                          </select>
                        </div>
                
                <DialogFooter>
                  <Button loading={onloading} type='submit' variant='button'>
                    Save changes
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
