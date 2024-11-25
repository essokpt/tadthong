
import { SyntheticEvent, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'

import { Label } from '@radix-ui/react-label'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ApproveMaterialType } from './type'
import { Textarea } from '@/components/ui/textarea'
import { updateApproveMaterial } from '@/services/approveMaterialApi'
import { format } from 'date-fns'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: ApproveMaterialType
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [onloading, setOnloading] = useState(false)
  const [action, setAction] = useState("")

  const { handleSubmit, register } = useForm()

  async function updateData(payload: any) {
    setOnloading(true)
    let today = new Date();
    const userId: any = localStorage.getItem('userId')
    if (action === 'approved') {
      payload.status = 'approved'
    }
    if (action === 'return') {
      payload.status = 'return'
    }
    payload.userId = parseInt(userId)
    payload.id = data.id
    payload.code = data.code
    payload.approveDate = format(today, 'yyyy-MM-dd')
    console.log('updateData:', payload)

    const res: any = await updateApproveMaterial(payload)

    if (res.status == 200) {
      setTimeout(() => {
        setOnloading(false)
        onClose()
      }, 1000)
    }
  }

  function handleChangeRole(e: ChangeEvent<HTMLSelectElement>) {
    setAction(e.target.value)
    console.log('action', e.target.value)
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
            <DialogTitle>Update </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <form onSubmit={handleSubmit(updateData)}>
              <div className='grid grid-cols-1 gap-2 '>
                <div className='grid'>
                  <Label className='py-1' htmlFor='comment'>
                    Comment
                  </Label>
                  <Textarea
                    className='text-[0.8rem]'
                    {...register('comment')}
                    defaultValue={data.comment}
                  />
                </div>
                <div>
                <Label className='py-1' htmlFor='comment'>
                    Action
                  </Label>
                  <select
                    
                    defaultValue={data.status}
                    onChange={handleChangeRole}
                    className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                      <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={data.status}
                    >
                 {data.status}
                    </option>
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value="approved"
                    >
                    Approved
                    </option>
                   
                      <option
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value="return"
                      >
                        Return
                      </option>
                  
                  </select>
                </div>
              </div>
              <br />
              <DialogFooter>
                <Button loading={onloading} type='submit'>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
