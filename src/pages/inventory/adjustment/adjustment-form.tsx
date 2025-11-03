/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLAttributes, SyntheticEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatDate } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  IconChecklist,
  IconDeviceFloppy,
  IconInfoCircle,
  IconPencilPlus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { SelectItemModal } from './selectItem-modal'
import { AdjustItem } from './adjust-item-schema'
import {
  createInventoryAdjust,
  createInventoryAdjustIn,
  createInventoryHistory,
  getAdjustmentReason,
} from '@/services/inventoryApi'
import { PageHeader } from '@/components/layouts/header'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { z } from 'zod'
import { IReason } from './type'
import { Badge } from '@/components/ui/badge'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { AdjustInModal } from './adjustIn-modal'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

const formSchema = z.object({
  userId: z.number(),
  selectReason: z.string(),
  adjustmentReasonId: z.number(),
  drawerBy: z.string(),
  remark: z.string(),
  createAt: z.string(),
  createBy: z.string(),
  adjustType: z.enum(['adjust-in', 'adjust-out'], {
    required_error: 'You need to select a notification type.',
  }),
})

export function AdjustForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [openAdjustIn, setOpenAdjustIn] = useState(false)
  const [adjustmentReason, setAdjustmentReason] = useState<IReason[]>([])

  const [selectedAdjustItems, setSelectedAdjustItems] = useState<AdjustItem[]>(
    []
  )

  //const { handleSubmit, register } = useForm()

  const today = new Date()
  const user: any = localStorage.getItem('user')
  const userId: any = localStorage.getItem('userId')

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createBy: user,
      userId: parseInt(userId),
      drawerBy: '',
      remark: '',
      createAt: formatDate(today, 'yyyy-MM-dd'),
      adjustType: 'adjust-in',
    },
  })

  function handleChangeValue(e: ChangeEvent<HTMLInputElement>) {
    const itemIndex: any = selectedAdjustItems.findIndex(
      (item) => item.id == e.target.id
    )
    if (itemIndex != -1) {
      selectedAdjustItems[itemIndex].quantity = parseInt(e.target.value)

      if (
        parseInt(e.target.value) >
        selectedAdjustItems[itemIndex].receiveQuantity
      ) {
        selectedAdjustItems[itemIndex].flag =
          parseInt(e.target.value) -
          selectedAdjustItems[itemIndex].receiveQuantity
        console.log('value more than existing', e.target.value)
      } else {
        selectedAdjustItems[itemIndex].flag =
          parseInt(e.target.value) -
          selectedAdjustItems[itemIndex].receiveQuantity
        console.log(
          'value less than existing',
          selectedAdjustItems[itemIndex].flag
        )
      }
    }
    console.log('handleSelectOriginal', e.target.id)
  }

  function addNewData(payload: any) {
    if(form.getValues('adjustType') === 'adjust-in') {
    console.log('add Newdata to adjust-in', payload)

      setSelectedAdjustItems((prevItems) => [
        ...prevItems,
        {
          ...payload[0],
        },
      ])
    }else{
          console.log('add Newdata to adjust-out', payload)

    setSelectedAdjustItems(payload)
    }
  }

  async function onSubmit(data: any) {
   // setIsLoading(true)
    const userid: any = localStorage.getItem('userId')
    data.inventoryAdjustItems = selectedAdjustItems
    console.log('create adjustment', data)

    
    if(form.getValues('adjustType') === 'adjust-in'){
      const res = await createInventoryAdjustIn(data)
      console.log('create adjust-in res', res);
      
    }
    else{
    const res = await createInventoryAdjust(data)
    
    console.log('respone', res)
    if (res?.status == 200) {
      // save history
      const history = {
        StockType: data.adjustType,
        Ref: res.data.code,
        StockBy: localStorage.getItem('user'),
        ReceiveQuantity: selectedAdjustItems[0].receiveQuantity,
        Unit: 'pcs',
        Status: 'Completed',
        ItemMasterId: 0,
        LocationId: selectedAdjustItems[0].locationId,
        warehouseId: selectedAdjustItems[0].location?.warehouse?.id || 1,
        branchesId: localStorage.getItem('branchId'),
        userId: parseInt(userid),
      }

      console.log('createInventoryHistory:', history)
      await createInventoryHistory([history])
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      setIsLoading(false)
     
    }
  }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

     navigate('/adjustment', { replace: true })
  }

  useEffect(() => {
    getAdjustmentReason().then((data) => setAdjustmentReason(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Adjustment'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Card>
              <CardContent className='m-3 h-[30rem]  space-y-2'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='mb-3  grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-2 mb-2  flex items-center'>
                        <IconInfoCircle />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          General Information.
                        </Label>
                      </div>

                      <FormField
                        control={form.control}
                        name='createAt'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Create Date</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='createBy'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Create By</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='selectReason'
                        render={({ field }) => (
                          <FormItem className='mt-3 grid space-y-1.5 py-2'>
                            <FormLabel>Reason</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    role='combobox'
                                    className={cn(
                                      'justify-between',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value
                                      ? adjustmentReason.find(
                                          (item) => item.desc === field.value
                                        )?.desc
                                      : 'Select reason'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search location...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      No reason found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {adjustmentReason.map((item) => (
                                        <CommandItem
                                          value={item.desc}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'selectReason',
                                              item.desc
                                            )
                                            form.setValue(
                                              'adjustmentReasonId',
                                              item.id
                                            )
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              item.desc === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {item.desc}
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
                        name='drawerBy'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Drawer/Return By</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
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

                      <FormField
                        control={form.control}
                        name='adjustType'
                        render={({ field }) => (
                          <FormItem className='space-y-3 '>
                            <FormLabel>Select adjust type...</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => field.onChange(value)}
                                defaultValue={'adjust-in'}
                                className='flex items-center gap-3'
                              >
                                <FormItem className='flex items-center gap-3'>
                                  <FormControl>
                                    <RadioGroupItem value='adjust-in' />
                                  </FormControl>
                                  <FormLabel className='py-0 font-normal'>
                                    Adjust-In
                                  </FormLabel>
                                </FormItem>
                                <FormItem className='flex items-center gap-3'>
                                  <FormControl>
                                    <RadioGroupItem value='adjust-out' />
                                  </FormControl>
                                  <FormLabel className='font-normal'>
                                    Adjust-Out
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='mb-2  flex items-center'>
                        <IconChecklist />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Items List.
                        </Label>
                      </div>
                      <Table className='overflow-scroll'>
                        <TableCaption>
                          A list of your recent items.
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='w-[7rem]'>
                              Item Code
                            </TableHead>
                            <TableHead className='w-[15rem]'>
                              Item Name
                            </TableHead>
                            <TableHead className='w-[9rem]'>
                              Warehouse
                            </TableHead>
                            <TableHead className='w-[9rem]'>Location</TableHead>
                            <TableHead className='w-[9rem]'>
                              Onhand Stock
                            </TableHead>
                            <TableHead className='w-[8rem]'>
                              Adjust Value
                            </TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAdjustItems?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                {item.itemMaster?.code}
                              </TableCell>
                              <TableCell>{item.itemMaster?.name}</TableCell>
                              <TableCell>
                                {item.location?.warehouse?.name}
                              </TableCell>
                              <TableCell>{item.location?.name}</TableCell>
                              <TableCell>{item.receiveQuantity}</TableCell>
                              <TableCell>
                                <Input
                                  id={item.id}
                                  className='text-[0.8rem]'
                                  min={0}
                                  type='number'
                                  onChange={handleChangeValue}
                                  defaultValue={item.receiveQuantity}
                                />
                              </TableCell>

                              <TableCell className='w-[8rem]'>
                                {/* <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full'
                              onClick={() => updatePurchaseItem(item)}
                            >
                              <IconEdit size={20} />
                            </Button> */}

                                <IconTrash
                                  size={20}
                                  onClick={() =>
                                    setSelectedAdjustItems(
                                      selectedAdjustItems.filter(
                                        (a) => a.id !== item.id
                                      )
                                    )
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell className='item-center' colSpan={9}>
                              <Badge
                                className='text-white hover:bg-primary'
                                variant={'default'}
                                onClick={() => {
                                  if (form.getValues('adjustType') === 'adjust-in') {
                                    setOpenAdjustIn(true)
                                  } else {
                                    setOpenSelect(true)
                                  }
                                  console.log('open modal', form.getValues('adjustType'));
                                  
                                }}
                              >
                                <IconPlus size={20} />
                                Add Item.
                              </Badge>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>

                    <Button
                      className='float-end mb-3 gap-2'
                      loading={isLoading}
                      variant='button'
                      type='submit'
                    >
                      <IconDeviceFloppy size={20} />
                      Confirm
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <br />
          </div>
        </div>

        <SelectItemModal
          isOpen={openSelect}
          onClose={() => setOpenSelect(false)}
          createData={(e) => addNewData(e)}
        />

        <AdjustInModal
          isOpen={openAdjustIn}
          onClose={() => setOpenAdjustIn(false)}
          createData={(e) => addNewData(e)}
          loading={isLoading}
        />
      </LayoutBody>
    </Layout>
  )
}
