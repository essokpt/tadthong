'use client'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
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
import { VenderList } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { updateItemVender } from '@/services/itemApi'
import { toCurrency } from '@/lib/utils'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: VenderList
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register, setValue } = useForm()
  const [onloading, setOnloading] = useState(false)
  const { setRefresh } = useContext(ApiContext) as ApiType

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('handleChangeInput', e.target.id, e.target.value)
    const numericValue = Number(e.target.value.replace(/\D/g, '')) / 100
    const current = numericValue ? toCurrency(numericValue) : ''

    setValue(e.target.id, current)
  }

  async function updateData(payload: any) {
    setOnloading(true)
    console.log('updateData', payload)
    const res: any = await updateItemVender(payload)

    if (res.status == 200) {
      console.log('updateVenderItem success')
    }

    setTimeout(() => {
      setOnloading(false)
      onClose()
      setRefresh(true)
    }, 1500)
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
            <DialogTitle>Edit Vender List</DialogTitle>
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
                <Input
                  className='hidden'
                  {...register('venderId')}
                  defaultValue={data.vender.id}
                />

                <Input
                  className='hidden'
                  {...register('itemMasterId')}
                  defaultValue={data.itemMasterId}
                />

                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='code'
                  >
                    Vender Code.
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    defaultValue={data.vender?.code}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='code'
                  >
                    Vender Name
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    defaultValue={data.vender?.companyName}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Cost(Baht)
                  </Label>
                  <Input
                    id='cost'
                    className='text-[0.8rem]'
                    {...register('cost')}
                    defaultValue={data.cost}
                    onChange={handleChangePrice}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Reamrk
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    {...register('remark')}
                    defaultValue={data.remark}
                  />
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
