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

import { getItemMaster } from '@/services/itemApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import InputCurrency from '@/components/custom/inputCurrency'
import { ItemType } from '@/pages/master/item/components/type'

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
  
 
})

export const AdjustInModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [selectItemMaster, setSelectItemMaster] = useState<ItemType>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      selectedItem: '',
      itemMasterId: 0,
      itemMasterCode: '',
      itemMasterName: '',
      quantity: 0,
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    //setOnloading(true)
       console.log('new adjust-in', data)
    const newData = {...selectItemMaster,
      location : {
        id: selectItemMaster?.id,
        name: selectItemMaster?.location?.name || '',
        warehouse: {
          id: selectItemMaster?.location?.warehouse?.id,
          name: selectItemMaster?.location?.warehouse?.name || '',
       
        }
      },
      itemMaster:{
        id: data?.itemMasterId || 0,
        code: data.itemMasterCode || '',
        name: data?.itemMasterName || '',
      },
      itemMasterId: data?.itemMasterId || 0,
      warehouseId: selectItemMaster?.location?.warehouse?.id || 0,
      warehouseDestinationId: selectItemMaster?.location?.warehouse?.id || 0,
      id: data?.itemMasterId || 0,
      receiveQuantity: data.quantity,
      quantity: data.quantity,
      branchesId : localStorage.getItem('branchId'),
      flag: 0,
      unit:'pcs'
    }
   console.log('selected item', newData);
   
    createData([newData])
    form.reset()
    onClose()
  }
  

  

  useEffect(() => {
    setIsMounted(true)
    getItemMaster().then((data) => setItemMaster(data))
  }, [])

  if (!isMounted) {
    return null
  }

  function getItem(value: string) {
    const item = itemMaster.find((item) => `${item.code}-${item.name}` === value)
    if (!item) return ''
    return item.code + '-' + item.name
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>Adjust-In</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-3 gap-2 '>
                  <FormField
                    control={form.control}
                    name='selectedItem'
                    render={({ field }) => (
                      <FormItem className='mt-1.5 grid space-y-2 col-span-2'>
                        <FormLabel>Item Master</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'bg-forefround hover:bg-forefround justify-between ',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? getItem(field.value) 
                                  : 'Select Item master'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent  className='w-[250px] p-0'>
                            <Command >
                              <CommandInput placeholder='Search Item master...' />
                              <CommandList>
                                <CommandEmpty>
                                  No Item master found.
                                </CommandEmpty>
                                <CommandGroup  >
                                  {itemMaster.map((item) => (
                                    <CommandItem
                                      value={`${item.code}-${item.name}`}
                                      key={item.id}
                                      
                                      onSelect={() => {
                                        setSelectItemMaster(item)                                      
                                        //form.setValue('selectedItem', item.code)
                                        form.setValue('id', parseInt(item.id))
                                        form.setValue('selectedItem', `${item.code}-${item.name}`)
                                        form.setValue(
                                          'itemMasterId',
                                          parseInt(item.id)
                                        )
                                        form.setValue(
                                          'itemMasterCode',
                                          item.code
                                        )
                                        form.setValue(
                                          'itemMasterName',
                                          item.name
                                        )
                                        console.log('selected item :', form.getValues('selectedItem'))  

                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          `${item.code}-${item.name}` == field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {`${item.code}-${item.name}`}
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
                    label='Quantity'
                    name='quantity'
                    placeholder={'Input quantity'}
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
