import { HTMLAttributes, SyntheticEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatDate } from 'date-fns'
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
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { LocationType } from '@/pages/location/components/type'
import { getWarehouseByBranch } from '@/services/warehouseApi'
import { Warehouse } from '@/pages/warehouse/components/schema'
import { Label } from '@/components/ui/label'
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
import { TransferItem } from './transfer-item-schema'
import { createInventoryTransfer } from '@/services/inventoryApi'
import { PageHeader } from '@/components/layouts/header'
import { z } from 'zod'
//import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

const formSchema = z.object({
  userId: z.number(),
  selectWarehouseDestination: z.string(),
  selectLocationDestination: z.string(),
  warehouseDestinationId: z.number(),
  locationDestinationId: z.number(),
  remark: z.string(),
  createAt: z.string(),
  createBy: z.string(),
  branchDestinationId: z.number(),
})

export function TransferForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [warehouse, setWarehouse] = useState<Warehouse[]>([])
  const [locationDestination, setLocationDestination] = useState<
    LocationType[]
  >([])
  const [selectedTransferItems, setSelectedTransferItems] = useState<
    TransferItem[]
  >([])

  //const { handleSubmit, register } = useForm()

  let today = new Date()
  let user: any = localStorage.getItem('user')
  let userId: any = localStorage.getItem('userId')
  let branchId: any = localStorage.getItem('branchId')
  const navigate = useNavigate()

  // function handleSelectOriginal(e: ChangeEvent<HTMLSelectElement>) {
  //   const des: any = locationOrinal.filter((item) => item.id != e.target.value)
  //   setLocationDestination(des)
  //   console.log('handleSelectOriginal', des)
  // }
  function handleChangeValue(e: ChangeEvent<HTMLInputElement>) {
    const itemIndex: any = selectedTransferItems.findIndex(
      (item) => item.id == e.target.id
    )
    if (itemIndex != -1) {
      selectedTransferItems[itemIndex].quantity = parseInt(e.target.value)
    }
    console.log('handleSelectOriginal', e.target.id)
  }

  function handleChangeWarehouse(warehouseId: any) {
    const location: any = warehouse.find((item) => item.id == warehouseId)
    setLocationDestination(location.locations)
    console.log('handleChangeWarehouse', location)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    //resolver: zodResolver(formSchema),
    defaultValues: {
       createAt: formatDate(today, 'yyyy-MM-dd'),
       createBy: user,
       userId: userId,
       branchDestinationId: branchId,
       remark: '',   
      // selectWarehouseDestination: '',
      // selectLocationDestination: '',
      // warehouseDestinationId: 0,
      // locationDestinationId: 0,
     
    },
  })

  function addNewData(payload: any) {
    console.log('add Newdata to form', payload)
    setSelectedTransferItems(payload)
  }

  async function onSubmit(payload: any) {
    setIsLoading(true)

    payload.transferItems = selectedTransferItems
    console.log('create transfer', payload)

    const respone: any = await createInventoryTransfer(payload)
    console.log('respone', respone)
    if (respone.status == 200) {
      setIsLoading(false)
      navigate('/transfer', { replace: true })
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    const branchId: any = localStorage.getItem('branchId')
    getWarehouseByBranch(branchId).then((data) => setWarehouse(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Transfer'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Card>
              <CardContent className='m-3 h-[35rem] space-y-2 '>
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
                        name='selectWarehouseDestination'
                        render={({ field }) => (
                          <FormItem className='mt-3 grid space-y-1.5 py-2'>
                            <FormLabel>Warehouse Destination</FormLabel>
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
                                      ? warehouse.find(
                                          (item) => item.name === field.value
                                        )?.name
                                      : 'Select Warehouse'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search Warehouse...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      No Warehouse found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {warehouse.map((item) => (
                                        <CommandItem
                                          value={item.name}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'selectWarehouseDestination',
                                              item.name
                                            )
                                            form.setValue(
                                              'warehouseDestinationId',
                                              parseInt(item.id)
                                            )
                                            handleChangeWarehouse(item.id)
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
                        name='selectLocationDestination'
                        render={({ field }) => (
                          <FormItem className='mt-3 grid space-y-1.5 py-2'>
                            <FormLabel>Location Destination</FormLabel>
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
                                      ? locationDestination.find(
                                          (item) => item.name === field.value
                                        )?.name
                                      : 'Select Location'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search location...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      No location found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {locationDestination.map((item) => (
                                        <CommandItem
                                          value={item.name}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'selectLocationDestination',
                                              item.name
                                            )
                                            form.setValue(
                                              'locationDestinationId',
                                              item.id
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

                    <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='mb-2  flex items-center'>
                        <IconChecklist />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Itemd List.
                        </Label>
                      </div>

                      <Table>
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
                            <TableHead>Quantity</TableHead>
                            {/* <TableHead>To-Warehouse</TableHead>
                        <TableHead>To-Location</TableHead> */}
                            <TableHead className='w-[8rem]'>
                              Transfer Value
                            </TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTransferItems?.map((item) => (
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
                                  max={item.receiveQuantity}
                                  type='number'
                                  onChange={handleChangeValue}
                                />
                              </TableCell>

                              <TableCell className='w-[8rem]'>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() =>
                                    setSelectedTransferItems(
                                      selectedTransferItems.filter(
                                        (a) => a.id != item.id
                                      )
                                    )
                                  }
                                >
                                  <IconTrash size={20} />
                                </Button>
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
                                onClick={() => setOpenSelect(true)}
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
                      className='float-end mb-3 gap-3'
                      loading={isLoading}
                      type='submit'
                      variant='button'
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
      </LayoutBody>
    </Layout>
  )
}
