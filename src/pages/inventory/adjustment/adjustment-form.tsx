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
  getAdjustmentReason,
} from '@/services/inventoryApi'
import { PageHeader } from '@/components/layouts/header'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { z } from 'zod'
import { IReason } from './type'
import { Badge } from '@/components/ui/badge'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

const formSchema = z.object({
  userId: z.number(),
  selectReason: z.string(),
  adjustmentReasonId: z.number(),
  remark: z.string().min(0),
  createAt: z.string(),
  createBy: z.string(),
})

export function AdjustForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)

  const [adjustmentReason, setAdjustmentReason] = useState<IReason[]>([])

  const [selectedAdjustItems, setSelectedAdjustItems] = useState<AdjustItem[]>(
    []
  )

  //const { handleSubmit, register } = useForm()

  let today = new Date()
  let user: any = localStorage.getItem('user')
  let userId: any = localStorage.getItem('userId')

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createBy: user,
      userId: parseInt(userId),
      createAt: formatDate(today, 'yyyy-MM-dd'),
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
    console.log('add Newdata to form', payload)
    setSelectedAdjustItems(payload)
  }

  async function onSubmit(data: any) {
    setIsLoading(true)

    data.inventoryAdjustItems = selectedAdjustItems
    console.log('create transfer', data)

    const respone: any = await createInventoryAdjust(data)
    console.log('respone', respone)
    if (respone.status == 200) {
      setIsLoading(false)
      navigate('/adjustment', { replace: true })
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
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
                                      No location found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {adjustmentReason.map((item) => (
                                        <CommandItem
                                          value={item.desc}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue('selectReason', item.desc )
                                            form.setValue('adjustmentReasonId', item.id )
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
      </LayoutBody>
    </Layout>
  )
}
