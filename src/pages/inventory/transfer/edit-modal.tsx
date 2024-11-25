import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Transfer } from './schema'
import { Input } from '@/components/ui/input'
import {
  IconChecklist,
  IconInfoCircle,
} from '@tabler/icons-react'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Transfer
}

const formSchema = z.object({
  id: z.number(),
  createAt: z.string(),
  code: z.string(),
  warehouseDestination: z.object({
    name: z.string(),
  }),
  locationDestination: z.object({
    name: z.string(),
  }),
  transferItems: z.array(
    z.object({
      id: z.number(),
      itemMasterId: z.number(),
      itemMaster: z.object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
      }),
      location: z.object({
        name: z.string(),
      }),
      warehouse: z.object({
        name: z.string(),
      }),
      quantity: z.number(),
      remark: z.string(),
    
    })),
    user: z.object({
      firstName: z.string(),
    }),
    remark: z.string(),
  
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    values: data,
  })

  async function onSubmit(payload: any) {
    console.log('submit data:', payload)
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
        <DialogContent className='max-w-screen h-full'>
          <DialogHeader>
            <DialogTitle>Item Transfer Detail.</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4 '>
            <Card>
              <CardContent className='h-[38rem] space-y-2 overflow-scroll m-2'>
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
                        name='user.firstName'
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
                      {/* <FormField
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
                      /> */}
                      {/* <FormField
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
                      /> */}
                      <FormField
                        control={form.control}
                        name='warehouseDestination.name'
                        render={({ field }) => (
                          <FormItem className=' space-y-1'>
                            <FormLabel>Warehouse Destination</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='locationDestination.name'
                        render={({ field }) => (
                          <FormItem className=' space-y-1'>
                            <FormLabel>Location Destination</FormLabel>
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
                          <FormItem className='space-y-1'>
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
                            <TableHead className='w-[15rem]'>
                              To Warehouse
                            </TableHead>
                            <TableHead className='w-[15rem]'>
                              To Location
                            </TableHead>
                            <TableHead className='w-[9rem]'>Quantity</TableHead>
                            <TableHead className='w-[9rem]'>Remark</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.transferItems?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                {item.itemMaster?.code}
                              </TableCell>
                              <TableCell>{item.itemMaster?.name}</TableCell>
                              <TableCell>
                                {data.warehouseDestination.name}
                              </TableCell>
                              <TableCell>
                                {data.locationDestination.name}
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.remark}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow></TableRow>
                        </TableFooter>
                      </Table>
                    </div>

                    {/* <Button
                      className='float-end mb-3 gap-3'
                      loading={isLoading}
                      type='submit'
                      variant='button'
                    >
                      <IconDeviceFloppy size={20} />
                      Confirm
                    </Button> */}
                  </form>
                </Form>
              </CardContent>
            </Card>

            <br />
            <DialogFooter>
              {/* <Button loading={onloading} type='submit'>
                  Save changes
                </Button> */}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
