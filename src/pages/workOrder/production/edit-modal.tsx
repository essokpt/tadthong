'use client'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { WorkOrder } from '../components/schema'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import { updateProduction, updateWorkOrderItems } from '@/services/workOrderApi'
import { IconRefresh } from '@tabler/icons-react'
import { UpdateProductionWip } from '@/services/itemApi'
import { format } from 'date-fns'
import {
  createInventory,
  createInventoryHistory,
} from '@/services/inventoryApi'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: WorkOrder
}
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

const formSchema = z.object({
  id: z.string(),
  // selectLocation: z.string(),
  // selectItem: z.string(),
  // unit: z.string(),
  quantity: z.number(),
  code: z.string(),
  locationId: z.number(),
  location: z.object({
    id: z.number(),
    name: z.string(),
    // warehouseId: z.number(),
  }),
  // userId: z.string(),
  // user: z.object({
  //   firstName: z.string(),
  // }),
  itemMasterId: z.number(),
  itemMaster: z.object({
    code: z.string(),
    name: z.string(),
    // stockingUom: z.string(),
  }),
  received: z.number(),
  balance: z.number(),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const { handleSubmit, register, setValue } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [locations, setLocation] = useState<LocationType[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    values: data,
  })

  function handleChangePicking(e: ChangeEvent<HTMLInputElement>) {
    const findIndex: any = data.workOrderUsages.findIndex(
      (item) => item.id == e.target.id
    )
    if (findIndex != -1) {
      data.workOrderUsages[findIndex].pickingRequest = parseInt(e.target.value)
      //updateItem(findIndex)
    }

    console.log('handleChangeQuantity value', data)
  }

  //function handleChangeLocation(e: ChangeEvent<HTMLSelectElement>) {
  //setValue('locationId', parseInt(e.target.value))
  //data.locationId = parseInt(e.target.value)
  //console.log('handleChangeLocation value', data)
  // const findIndex: any = data.purchaseRequestItems.findIndex(
  //   (item) => item.id == e.target.id
  // )
  // if (findIndex != -1) {
  //   data.purchaseRequestItems[findIndex].price = parseInt(e.target.value)
  //   updateItem(findIndex)
  // }
  //}

  async function updateData(payload: z.infer<typeof formSchema>) {
    setOnloading(true)
    console.log('updateData:', payload)

    const res: any = await updateProduction(payload)

    if (res.status == 200) {
      // stock
      const stock = {
        itemMasterId: payload.itemMasterId,
        LocationId: payload.locationId,
        warehouseId: data.location.warehouseId,
        branchesId: localStorage.getItem('branchId'),
        receiveQuantity: payload.received,
        unit: 'pcs',
      }
      console.log('add stock:', [stock])

      await createInventory([stock])

      // save history
      const history = {
        StockType: 'Production-Receipt',
        Ref: payload.code,
        StockBy: localStorage.getItem('user'),
        ReceiveQuantity: payload.received,
        Unit: 'pcs',
        Status: 'Production Receipt',
        ItemMasterId: payload.itemMasterId,
        LocationId: payload.locationId,
        warehouseId: data.location.warehouseId,
        branchesId: localStorage.getItem('branchId'),
      }

      console.log('createInventoryHistory:', history)
      await createInventoryHistory([history])
      setTimeout(() => {
        setOnloading(false)
        onClose()
      }, 1000)
    }
  }

  async function updateItem() {
    // setOnloading(true)
    console.log('updateData:', data)

    const res: any = await updateWorkOrderItems(data)

    if (res.status == 200) {
      const response: any = await UpdateProductionWip(data.workOrderUsages)
      console.log('UpdateProductionWip:', response)

      setOnloading(false)
      onClose()
    }

    setTimeout(() => {
      setOnloading(false)
    }, 1000)
  }

  useEffect(() => {
    setIsMounted(true)
    getLocation().then((data) => setLocation(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='h-screen max-w-full'>
          <DialogHeader>
            <DialogTitle>Update Production</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <Tabs defaultValue='general' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='general'>General Information</TabsTrigger>
              <TabsTrigger value='materiallist'>Usage Detail</TabsTrigger>
            </TabsList>
            <TabsContent value='general'>
              <Card>
                <CardContent className='h-[35rem] space-y-2'>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateData)}>
                      <div className='grid gap-4'>
                        <div className='grid grid-cols-2 gap-2'>
                          <FormField
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                  <Input {...field} readOnly />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='itemMaster.code'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Item Code</FormLabel>
                                <FormControl>
                                  <Input {...field} readOnly />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='quantity'
                            render={({ field }) => (
                              <FormItem className='space-y-1 '>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input type='number' {...field} readOnly />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='itemMaster.name'
                            render={({ field }) => (
                              <FormItem className='space-y-1 '>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                  <Input {...field} readOnly />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <div className='grid'>
                            <Label
                              className='py-1 text-[0.8rem]'
                              htmlFor='received'
                            >
                              Received
                            </Label>
                            <Input
                              readOnly
                              className='text-[0.8rem]'
                              defaultValue={data.received}
                            />
                          </div> */}

                          {/* <FormField
                            control={form.control}
                            name='received'
                            render={({ field }) => (
                              <FormItem className='space-y-1 '>
                                <FormLabel>Received</FormLabel>
                                <FormControl>
                                  <Input type='number' {...field} readOnly />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                            <div className='grid'>
                            <Label
                              className='py-1 text-[0.8rem]'
                              htmlFor='received'
                            >
                              Balance
                            </Label>
                            <Input
                              readOnly
                              className='text-[0.8rem]'
                              defaultValue={data.balance}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name='balance'
                            render={({ field }) => (
                              <FormItem className='space-y-1 '>
                                <FormLabel>Balance</FormLabel>
                                <FormControl>
                                  <Input type='number' {...field} readOnly />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='received'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Receipt Request</FormLabel>
                                <FormControl>
                                  <Input type='number' {...field} 
                                  disabled={data.balance == 0} 
                                  min={1}
                                  max={data.balance} 
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='location.name'
                            render={({ field }) => (
                              <FormItem className='mt-2 grid space-y-1.5'>
                                <FormLabel>Location</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant='outline'
                                        role='combobox'
                                        className={cn(
                                          'justify-between',
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value
                                          ? locations.find(
                                              (item) =>
                                                item.name === field.value
                                            )?.name
                                          : 'Select location'}
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
                                          {locations.map((item) => (
                                            <CommandItem
                                              value={item.name}
                                              key={item.id}
                                              onSelect={() => {
                                                form.setValue('location', {
                                                  id: item.id,
                                                  name: item.name,
                                                })
                                                form.setValue(
                                                  'locationId',
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
                        </div>

                        <div className='grid'>
                          <Button
                            loading={onloading}
                            type='submit'
                            variant='button'
                            size='sm'
                            className='float-end mt-8  h-8'
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                  {/* <form onSubmit={handleSubmit(updateData)}>
                      <div className='grid grid-cols-2 gap-2 '>
                        <Input
                          className='hidden'
                          {...register('id')}
                          defaultValue={data.id}
                        />
                        <Input
                          className='hidden'
                          {...register('userId')}
                          defaultValue={data.userId}
                        />
                        <Input
                          className='hidden'
                          {...register('itemMasterId')}
                          defaultValue={data.itemMasterId}
                        />
                        <Input
                          className='hidden'
                          {...register('locationId')}
                          defaultValue={data.locationId}
                        />
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='code'
                          >
                            Code
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            {...register('code')}
                            defaultValue={data.code}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='code'
                          >
                            Item Code
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.itemMaster.code}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='quantity'
                          >
                            Quantity
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.quantity}
                            {...register('quantity')}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='itemMaster'
                          >
                            Item Name
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.itemMaster.name}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='received'
                          >
                            Received
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            defaultValue={data.received}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='balance'
                          >
                            Balance
                          </Label>
                          <Input
                            readOnly
                            className='text-[0.8rem]'
                            {...register('balance')}
                            defaultValue={data.balance}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='received'
                          >
                            Receipt Request
                          </Label>
                          <Input
                            disabled={data.balance == 0}
                            type='number'
                            max={data.balance}
                            className='text-[0.8rem]'
                            {...register('received')}
                            defaultValue={data.balance}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='location'
                          >
                            Location
                          </Label>
                          <select
                            // id={item.id}
                            onChange={handleChangeLocation}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                              {data.location.name}
                            </option>
                            {locations.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <br />
                      <DialogFooter>
                        <Button
                          loading={onloading}
                          type='submit'
                          variant='button'
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </form> */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='materiallist'>
              <Card>
                <CardContent className='h-[35rem] space-y-2'>
                  <div className='grid gap-4'>
                    <Table>
                      <TableCaption>A list of your recent items.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Specifications</TableHead>
                          <TableHead>Quantity</TableHead>

                          <TableHead>Issued</TableHead>
                          <TableHead>Balance</TableHead>

                          <TableHead>Picking Request</TableHead>
                          <TableHead>Last Picking Date</TableHead>
                          <TableHead>Remark</TableHead>
                          {/* <TableHead className='items-center'>Action</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.workOrderUsages?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className='font-medium'>
                              {item.itemMaster?.code}
                            </TableCell>
                            <TableCell>{item.itemMaster?.name}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{item.quantity}</TableCell>

                            <TableCell>{item.pickingQuantity}</TableCell>
                            <TableCell>{item.pickingBalance}</TableCell>
                            <TableCell>
                              <Input
                                disabled={item.pickingBalance == 0}
                                className='w-[100px]'
                                type='number'
                                min={1}
                                max={item.pickingBalance}
                                id={item.id}
                                defaultValue={item.pickingBalance}
                                onChange={handleChangePicking}
                              />
                            </TableCell>
                            <TableCell>
                              {item.pickingDate
                                ? format(item.pickingDate, 'dd-MM-yyyy')
                                : ''}
                            </TableCell>
                            <TableCell>{item.remark}</TableCell>
                            {/* <TableCell className='w-[8rem]'>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => updatePurchaseItem(item)}
                              >
                                <IconRefresh size={20} />
                              </Button>

                            
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={10} className='text-right'>
                            <Button
                              loading={onloading}
                              onClick={updateItem}
                              variant='button'
                            >
                              <IconRefresh size={20} className='mr-2' />
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
