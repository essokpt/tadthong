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
import { PriceList } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { updatePrice } from '@/services/priceApi'
import { toCurrency } from '@/lib/utils'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: PriceList
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

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('handleChangeInput', e.target.id, e.target.value)
    const numericValue = Number(e.target.value.replace(/\D/g, '')) / 100
    const current = numericValue ? toCurrency(numericValue) : ''

    setValue(e.target.id, current)
  }

  async function updateData(data: any) {
    setOnloading(true)

    console.log('updateData', data)
    const res: any = await updatePrice(data)

    if (res.status == 200) {
      console.log('update item price sucess')
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
            <DialogTitle>Edit Price</DialogTitle>
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
                  {...register('customersId')}
                  defaultValue={data.customersId}
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
                    Customer
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    defaultValue={data.customers?.companyName}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='description'
                  >
                    Price(Baht)
                  </Label>
                  <Input
                    id='price'
                    className='text-[0.8rem]'
                    {...register('price')}
                    defaultValue={data.price}
                    onChange={handleChangeInput}
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
