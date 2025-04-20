// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
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
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Adjustment } from './schema'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { IconChecklist, IconInfoCircle } from '@tabler/icons-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toCurrency } from '@/lib/utils'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { ChevronsUpDown } from 'lucide-react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Adjustment
}

const formSchema = z.object({
  id: z.number(),
  date: z.string(),
  createAt: z.string(), 
  code: z.string(),
  remark: z.string(),
  adjustmentReason: z.object({
    desc : z.string()
  }),
  userId: z.number(),
  user: z.object({
    firstName: z.string(),
  }),
  inventoryAdjustItems: z.array(
    z.object({
      id: z.number(),
      stockOnHandId: z.number(),
      stockOnHand: z.object({
        itemMasterId: z.number(),
        itemMaster: z.object({
          id: z.number(),
          code: z.string(),
          name: z.string(),
        }),
      }),
      quantity: z.number(),
      flag: z.number(),
    })
  ),
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

  async function onUpdate(payload: any) {
    //setIsLoading(true)

    //data.inventoryAdjustItems = selectedAdjustItems
    console.log('create transfer', payload)

    // const respone: any = await createInventoryAdjust(data)
    // console.log('respone', respone)
    // if (respone.status == 200) {
    //   setIsLoading(false)
    //   navigate('/adjustment', { replace: true })
    // }
    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 2000)
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
        <DialogContent className='max-w-screen h-full overflow-scroll '>
          <DialogHeader>
            <DialogTitle>Item Adjustment Detail </DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4 '>
            <Card>
              <CardContent className='m-2 h-[35rem] space-y-2'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onUpdate)}>
                    <div className='mb-3 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-2 mb-2  flex items-center'>
                        <IconInfoCircle />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          General Information.
                        </Label>
                      </div>
                      {/* <Input
                      className='hidden'
                      {...register('userId')}
                      defaultValue={userId}
                    />
                    
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='planDate'
                      >
                        Date
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        readOnly
                        defaultValue={formatDate(today, 'yyyy-MM-dd')}
                        {...register('createAt')}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='planDate'
                      >
                        Create By
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        readOnly
                        defaultValue={user}
                      />
                    </div>   */}
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
                       <FormField
                        control={form.control}
                        name='adjustmentReason.desc'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Reason</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <FormField
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
                                      No location found.
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
                      /> */}

                    
                      <FormField
                        control={form.control}
                        name='remark'
                        render={({ field }) => (
                          <FormItem className='space-y-1 col-span-2'>
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
                            <TableHead className='w-[9rem]'>Quantity</TableHead>
                            <TableHead className='w-[9rem]'>Flag</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.inventoryAdjustItems?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                {item.stockOnHand?.itemMaster?.code}
                              </TableCell>
                              <TableCell>
                                {item.stockOnHand?.itemMaster?.name}
                              </TableCell>
                              <TableCell>{toCurrency(item.quantity)}</TableCell>
                              <TableCell>
                                <Badge variant={'destructive'}>
                                  {item.flag}
                                </Badge>
                              </TableCell>

                              
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow></TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
