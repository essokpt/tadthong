'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
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
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
//import { BomType } from './type'
//import { updateBom } from '@/services/bomApi'

// import { Label } from '@/components/ui/label'
// import { Bom } from './schema'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import { getItemBomItem } from '@/services/itemApi'
import { ItemType } from '../../item/components/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
}

const formSchema = z.object({
  id: z.number(),
  selectedItem: z.string(),
  itemMasterId: z.number(),
  itemMasterCode: z.string(),
  itemMasterName: z.string(),
  quantity: z.number(),
  scrap: z.number(),
  outEffectiveDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  inEffectiveDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  status: z.string(),
})

export const CreateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const [onloading, setOnloading] = useState(false)
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //id: 0,
      // bomId: '1',
      // itemMasterId: 0,
      // selectedItem: '',
      // quantity: 0,
      // scrap: 0,
      // itemMasterCode: '',
      // itemMasterName: '',
      status: 'Active',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    //setOnloading(true)
    // const itemmasterid: any = itemMaster.find(
    //   (item) => item.code == data.selectedItem
    // )
   // data.itemMasterId = itemmasterid.id
   // data.itemMasterCode = itemmasterid.code
   // data.itemMasterName = itemmasterid.name
    // data.outEffectiveDate = format(data.OutDate, 'yyyy-MM-dd')

    console.log('createBom', data)
    createData(data)
    form.reset()
    onClose()
    
  }
  // const handleSelectItem = (e:any) =>{
  //   console.log('handleSelectItem',e);
  //   const selectItem = itemMaster.find(x => x.code == e)
  //   if(selectItem){
  //     form.setValue('id', parseInt(selectItem.id))
  //     form.setValue('selectedItem', selectItem.name)
  //     form.setValue('itemMasterId', parseInt(selectItem.id))
  //     form.setValue('itemMasterCode', selectItem.code)
  //     form.setValue('itemMasterName', selectItem.name)

  //   }
    
  // }
  // function checkValue(arr:any, val:any) {
  //   const result = arr.find((arrVal:any, index:any) => { 
  //    if(arrVal.name === val) return index+1 
  //   }
  //   );
  //   console.log('checkValue',val);
    
  //   if(result){
  //     return result 
  //   }else{
  //     return null
  //   }
  // }

  useEffect(() => {
    setIsMounted(true)
    getItemBomItem().then((data) => setItemMaster(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>New Bom</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-2 '>
                <FormField
                    control={form.control}
                    name='selectedItem'
                    render={({ field }) => (
                      <FormItem className='grid space-y-2 mt-1.5'>
                        <FormLabel>Item Master</FormLabel>
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
                                   ? itemMaster.find(
                                    (item) => item.name === field.value
                                  )?.name                                    
                                  : 'Select Item master'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[250px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search Item master...' />
                              <CommandList>
                                <CommandEmpty>
                                  No Item master found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {itemMaster.map((item,index) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'selectedItem',
                                          item.name
                                        )
                                        form.setValue('id', parseInt(item.id))
                                        form.setValue('selectedItem', item.name)
                                        form.setValue('itemMasterId', parseInt(item.id))
                                        form.setValue('itemMasterCode', item.code)
                                        form.setValue('itemMasterName', item.name)
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
                                      {index+1}-{item.name}
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
                  {/* <FormField
                    control={form.control}
                    name='selectedItem'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item </FormLabel>
                        <Select
                          onValueChange={(event) => handleSelectItem(event)}
                        
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a item master' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {itemMaster?.map((item) => (
                              <SelectItem key={item.id} value={item.code}>
                                {item.code}-{item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name='quantity'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='scrap'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Scrap</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='inEffectiveDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>In Effective Date</FormLabel>
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
                    name='outEffectiveDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Out Effective Date</FormLabel>
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
                    name='status'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value='Active'>Active</SelectItem>
                            <SelectItem value='Inactive'>Inactive</SelectItem>
                          </SelectContent>
                        </Select>

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
