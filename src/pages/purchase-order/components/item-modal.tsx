import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { getItemMaster } from '@/services/itemApi'
import { ItemType } from '@/pages/master/item/components/type'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { PurchaseOrderItemType } from './type'
import InputCurrency from '@/components/custom/inputCurrency'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
  editData: PurchaseOrderItemType
}

const formSchema = z.object({
  id: z.number(),
  purchaseOrderId: z.number(),
  itemName: z.string().min(1),
  itemMasterId: z.string(),
  quantity: z.number().min(1),
  specification: z.string(),
  discountPercent: z.number(),
  discountUnit: z.number(),
  //discountTotal: z.number(),
  // vat: z.number(),
  remark: z.string(),
  price: z.number().min(1),
  // amount: z.number(),
})

export const ItemModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
  editData,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: editData,
  })

  async function addData(data: z.infer<typeof formSchema>) {
    console.log('add new item', data)
    createData(data)
    //form.reset()
    // onClose()
  }

  useEffect(() => {
    setIsMounted(true)
    getItemMaster().then((data) => setItemMaster(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>Purchase Order Item</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addData)}>
                <div className='grid grid-cols-2 gap-2'>
                  <FormField
                    control={form.control}
                    name='itemName'
                    render={({ field }) => (
                      <FormItem className='mt-2 grid space-y-1.5 '>
                        <FormLabel>Item Master</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                // disabled={parseInt(editData.id) > 0}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? itemMaster.find(
                                      (item) => item.name === field.value
                                    )?.name
                                  : 'Select item'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search item...' />
                              <CommandList>
                                <CommandEmpty>No item found.</CommandEmpty>
                                <CommandGroup>
                                  {itemMaster.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('itemName', item.name)
                                        form.setValue(
                                          'itemMasterId',
                                          item.id.toString()
                                        )
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

                  <FormField
                    control={form.control}
                    name='specification'
                    render={({ field }) => (
                      <FormItem className='col-span-2 space-y-1'>
                        <FormLabel>Specification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <InputCurrency
                    value={0}
                    label='Quantity'
                    name='quantity'
                    placeholder={'input quantity'}
                  />
                  {/* <FormField
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
                              field.onChange(parseFloat(event.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <InputCurrency
                    value={0}
                    label='Unit Price(Baht)'
                    name='price'
                    placeholder={'input price'}
                  />

                  <FormField
                    control={form.control}
                    name='discountPercent'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Discount(%)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(event) =>
                              field.onChange(parseFloat(event.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <InputCurrency
                    value={0}
                    label='Discount Unit'
                    name='discountUnit'
                    placeholder={'input discountUnit'}
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
                  <Button
                    variant='button'
                    loading={loading}
                    type='submit'
                    className='float-end w-[10rem]'
                  >
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
