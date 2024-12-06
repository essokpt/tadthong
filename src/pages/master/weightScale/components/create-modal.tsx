'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
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
import { getItemBomItem } from '@/services/itemApi'
import { ItemType } from '../../item/components/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { gethWeightScaleVenderType } from '@/services/weightScaleApi'
import { VenderType, weightScaleItem } from './type'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
  editValue: weightScaleItem
}
 
const formSchema = z.object({
  id: z.number(),
  selectedItem: z.string(),
  itemMasterId: z.number(),
  selectedVenderType: z.string(),
  venderTypeId: z.number(),
  price: z.number(), 
  
})

export const CreateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
  editValue
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const [onloading, setOnloading] = useState(false)
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [venderType, setVenderType] = useState<VenderType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: editValue
  })

  function onSubmit(data: z.infer<typeof formSchema>) {   

    console.log( 'createBom', data)
    createData(data)
    form.reset()
    //onClose()
    
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
    gethWeightScaleVenderType().then((data) => setVenderType(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>Add Vender </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-1 gap-2 '>
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
                                        // form.setValue('id', parseInt(item.id))
                                        form.setValue('selectedItem', item.name)
                                        form.setValue('itemMasterId', parseInt(item.id))
                                        //form.setValue('itemMasterName', item.name)
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
                  <FormField
                    control={form.control}
                    name='selectedVenderType'
                    render={({ field }) => (
                      <FormItem className='grid space-y-2 mt-1.5'>
                        <FormLabel>Vender Type</FormLabel>
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
                                   ? venderType.find(
                                    (item) => item.typeName === field.value
                                  )?.typeName                                    
                                  : 'Select vender type'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[250px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search vender type...' />
                              <CommandList>
                                <CommandEmpty>
                                  No vender type found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {venderType.map((item) => (
                                    <CommandItem
                                      value={item.typeName}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'selectedVenderType',
                                          item.typeName
                                        )
                                        //form.setValue('id', parseInt(item.id))
                                        form.setValue('venderTypeId', item.id)
                                      //  form.setValue('itemMasterCode', item.code)
                                        //form.setValue('typeName', item.typeName)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.typeName === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {item.typeName}
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
                    name='price'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Price</FormLabel>
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
