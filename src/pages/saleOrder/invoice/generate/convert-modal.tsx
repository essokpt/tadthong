/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type AlertData = {
  title: string
  error: boolean
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data:any) => void
  loading: boolean
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
  const [mergeItem, setMergeItem] = useState("false")

const handleRadioChange = (value: string) => {
  console.log('Radio value changed:', value);
  
  setMergeItem(value);
};

const confirm = () => {
  console.log('Confirm clicked with mergeItem:', mergeItem);
  onConfirm({
    mergeItem: mergeItem === 'true' ? true : false
  });
  onClose();
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
        <DialogContent className='max-w-screen-sm'>
          <DialogHeader>
            <DialogTitle>Generate Invoice. </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <h3>{data.title}</h3>
          </div>

          <Separator className='bg-secondary' />
          <RadioGroup defaultValue={mergeItem} className="flex items-center gap-3" onValueChange={handleRadioChange}>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='true' id='option-one' />
              <Label htmlFor='option-one'>Merge items</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='false' id='option-two'/>
              <Label htmlFor='option-two'>Separate items</Label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button disabled={false} variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              loading={loading}
              disabled={data.error}
              variant='destructive'
              onClick={confirm}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}




