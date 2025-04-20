import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import {
  Table,
  TableBody,  
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn, formatCurrency } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'

import { CreateModal } from './create-modal'
import {
  IconChecklist,
  IconDeviceFloppy,
  IconInfoCircle,
  IconPencilPlus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { PageHeader } from '@/components/layouts/header'
import { CalendarIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { createWeightScale } from '@/services/weightScaleApi'
import { weightScaleItem } from './type'
interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

type venderItem = {
  id: number
  selectedItem: string
  selectedItemCode: string
  itemMasterId: number
  //itemMasterName: string
  selectedVenderType: string
  venderTypeId: number
  // typeName: string
  price: number
}

const initialValue = {
  id: 0,
  selectedItem: '',
  selectedItemCode: '',
  itemMasterId: 0,
  selectedVenderType: '',
  venderTypeId: 0,
  price: 0,
}
const formSchema = z.object({
  id: z.string(),
  priceNumber: z.string(),
  status: z.string(),
  createAt: z.string(),
  reason: z.string(),
  outEffectiveDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  inEffectiveDate: z.date({
    required_error: 'A date of birth is required.',
  }),
})

export function WeightScalePriceForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [editValue, setEditValue] = useState<weightScaleItem>(initialValue)
  //const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [venderItem, setVenderItem] = useState<venderItem[]>([])

  const navigate = useNavigate()
  let today = new Date()
  let dateCode = format(today, 'yyyy-MM-dd')
  let newCode = dateCode.split('-')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '0',
      priceNumber: 'P' + newCode[0] + newCode[1] + newCode[2],
      status: 'New',
      reason: '',
      createAt: format(today, 'yyyy-MM-dd'),
    },
  })

  function addNewData(payload: any) {
    console.log('addNewData', payload)
    venderItem.push(payload)
    setOpenModal(false)
  }

  async function onSubmit(data: any) {
    data.inEffectiveDate = format(data.inEffectiveDate, 'yyyy-MM-dd')
    data.outEffectiveDate = format(data.outEffectiveDate, 'yyyy-MM-dd')
    data.weightScaleVenderTypeItem = venderItem
    setIsLoading(true)

    console.log('create data:', data)
    const respone: any = await createWeightScale(data)

    console.log('createWeightScale', respone)
    if (respone.status == 200) {
      console.log('createWeightScale -success', respone)
      setTimeout(() => {
        setIsLoading(false)
        navigate('/master/weightScalePrice', { replace: true })

      }, 3000)
    }else{
      setIsLoading(false)
    }

   
  }

  useEffect(() => {
    // setBom([])
    // setBomValue(initialValue)
    setIsLoading(false)
    // getItemBom().then((data) => setItemMaster(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Weight Scale Price Master'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
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
                    name='priceNumber'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Price Number</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
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
                        <FormControl>
                          <Input {...field} />
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
                    name='reason'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='inEffectiveDate'
                    render={({ field }) => (
                      <FormItem className='flex w-full flex-col'>
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
                </div>

                <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <div className='mb-2  flex items-center'>
                    <IconChecklist />
                    <Label htmlFor='terms' className='ml-3 text-lg'>
                      Vender Type List.
                    </Label>
                  </div>
                  <Table className='w-full'>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[10rem]'>Vender Type</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Price(Baht)</TableHead>

                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {venderItem?.map((item) => (
                        <TableRow key={item.selectedItem}>
                          <TableCell className='text-left'>
                            {item.selectedVenderType}
                          </TableCell>
                          <TableCell className='text-left'>
                            {item.selectedItemCode}
                          </TableCell>
                          <TableCell className='text-left'>
                            {item.selectedItem}
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>

                          <TableCell className='w-[8rem]'>
                            <IconTrash
                              size={20}
                              onClick={() =>
                                setVenderItem(
                                  venderItem.filter(
                                    (a) => a.selectedItem != item.selectedItem
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
                              setEditValue(initialValue)
                              setOpenModal(true)
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
                  className='float-end mt-2 h-10 w-full gap-3 border'
                  loading={isLoading}
                  type='submit'
                  variant='button'
                >
                  <IconDeviceFloppy size={20} />
                  Create
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <CreateModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addNewData(e)}
          editValue={editValue}
        />
      </LayoutBody>
    </Layout>
  )
}
