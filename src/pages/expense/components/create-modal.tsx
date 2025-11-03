/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

//import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import InputCurrency from '@/components/custom/inputCurrency'
import { getExpenseType } from '@/services/expenseApi'
import { ExpenseType } from '../type'
import { format, formatDate } from 'date-fns'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
}

const formSchema = z.object({
  id: z.number(),
  createAt: z.string(),
  selectedType: z.string(),
  expenseTypeId: z.number(),
  expenseType: z.object({
    id: z.number(),
    name: z.string(),
  }),
  // actualDate: z.string(),
  actualDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  expenseMonth: z.string(),
  value: z.number(),
  remark: z.string(),
})

const today = new Date()

const monthly = [
  { id: 1, label: 'January' },
  { id: 2, label: 'February' },
  { id: 3, label: 'March' },
  { id: 4, label: 'April' },
  { id: 5, label: 'May' },
  { id: 6, label: 'June' },
  { id: 7, label: 'July' },
  { id: 8, label: 'August' },
  { id: 9, label: 'September' },
  { id: 10, label: 'October' },
  { id: 11, label: 'November' },
  { id: 12, label: 'December' },
]

export const ExpenseModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [expenseType, setExpenseType] = useState<ExpenseType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    //resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      createAt: formatDate(today, 'yyyy-MM-dd'),
      actualDate: new Date(),
      selectedType: '',
      expenseTypeId: 0,
      value: 0,
      remark: '',
    },
  })

  function onSubmit(value: any) {
    //setOnloading(true)

    console.log('selected item', value)
     value.actualDate = format(value.actualDate, 'yyyy-MM-dd')
     createData(value)
    //form.reset()
     onClose()
  }

  useEffect(() => {
    setIsMounted(true)
    getExpenseType().then((data) => setExpenseType(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>Expense</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-2 '>
                  <FormField
                    control={form.control}
                    name='actualDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Actual Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-[350px] pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'dd-MM-yyyy')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              // disabled={(date) =>
                              //   date > new Date() ||
                              //   date < new Date('1900-01-01')
                              // }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='expenseMonth'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Month</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a verified email to display' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {monthly.map((item) => (
                              <SelectItem
                                value={item.label}
                                key={item.id}
                              >
                                {item.label}
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
                    name='selectedType'
                    render={({ field }) => (
                      <FormItem className='mt-1.5 grid space-y-2'>
                        <FormLabel>Expense Type</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'bg-forefround hover:bg-forefround justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? expenseType.find(
                                      (item) => item.name === field.value
                                    )?.name
                                  : 'Select Expense Type'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[250px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search Expense Type...' />
                              <CommandList>
                                <CommandEmpty>
                                  No Expense Type found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {expenseType.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('expenseType', item)
                                        form.setValue('selectedType', item.name)
                                        form.setValue('expenseTypeId', item.id)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.name === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {item.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <InputCurrency
                    value={0}
                    label='Value'
                    name='value'
                    placeholder={'Input value'}
                  />

                  <FormField
                    control={form.control}
                    name='remark'
                    render={({ field }) => (
                      <FormItem className='col-span-2 space-y-1'>
                        <FormLabel>Remark</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
