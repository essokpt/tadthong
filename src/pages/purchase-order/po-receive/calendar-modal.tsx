/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
//import { format } from 'date-fns'

import React from 'react'

const today = new Date() // Example date: July 15, 2025;
  const dayOfMonth = today.getDate();
  const month = today.getMonth(); // To get the month name
  const year = today.getFullYear();

 //const lastSevenDayTimestamp = today.setUTCDate(today.getUTCDate() - 7)
 const lastSevenDayTimestamp = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))
 const lastSevenDay = new Date(lastSevenDayTimestamp)
 const lastDayOfMonth = lastSevenDay.getUTCDate();
 const lastMonth = lastSevenDay.getUTCMonth(); // To get the month name
 const lastYear = lastSevenDay.getUTCFullYear();
  
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDate: (data: any) => void
}

export const CalendarModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSelectDate,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleSelectDate = () => {
    if (date) {
      onSelectDate({
        selectDate: date,
      })
    }
    //console.log('Selected date:', lastDayOfMonth, lastMonth, lastYear)
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className='w-auto'>
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <div className='flex space-y-4'>
          <Calendar
            fromDate={new Date(lastYear, lastMonth, lastDayOfMonth)}
            toDate={new Date(year, month, dayOfMonth)}
            defaultMonth={new Date()}
            mode='single'
            selected={date}
            onSelect={setDate}
            className='w-[300px] rounded-md border shadow-sm'
           // captionLayout='dropdown'
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button type='submit' onClick={() => handleSelectDate()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
