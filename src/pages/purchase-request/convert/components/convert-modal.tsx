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
  title: string
  error: boolean
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void;
  loading: boolean; 
  data: AlertData
}

// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

export const ConvertModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
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
            <DialogTitle>Purchase Convert. </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <h3>{data.title}</h3>
          </div>
          <DialogFooter>
            <Button disabled={false} variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} disabled={data.error} variant='destructive' onClick={onConfirm}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
