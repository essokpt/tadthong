import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'


type AlertData = {
  id: string 
  itemMaster: {
      code: string
      name: string 
  }
  pickingQuantity: number 
  error: {
    status: boolean
    text: string
  }
}


interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void;   
  data: AlertData
}

// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

export const ConfirmDelete: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onConfirm, 
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  // const [onloading, setOnloading] = useState(false)
  // const [action, setAction] = useState('')

  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-sm'>
          <DialogHeader>
            <DialogTitle>Delete </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            {
              data.error?.status? (
                <h3>{data.error.text}</h3>
              ):(
                <h3>{data.id}-{data.itemMaster.code}-{data.itemMaster.name} {data.error?.status}</h3>
              )
            }
          
          </div>
          <DialogFooter>
            <Button disabled={false} variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={data.error?.status} variant='destructive' onClick={onConfirm}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
