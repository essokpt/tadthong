//import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Card, CardContent } from '@/components/ui/card'
//import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn, formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
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

import {
  Table,
  TableBody,  
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CalendarIcon } from 'lucide-react'
import {
  IconChecklist,
  IconDeviceFloppy,
  IconEdit,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { AlertModal } from '@/components/custom/alert-modal'
import { Badge } from '@/components/ui/badge'
import { CreateModal } from './create-modal'
import { WeightScalePrice } from './schema'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createWeightScaleItem,
  deleteWeightScaleItemById,
  updateWeightScale,
  updateWeightScaleItems,
} from '@/services/weightScaleApi'
import { weightScaleItem } from './type'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: WeightScalePrice
  editble: boolean
  type: string
}

const initItemValue = {
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
  inEffectiveDate: z.string(),
  outEffectiveDate: z.string(),
  weightScaleVenderTypeItem: z.array(
    z.object({
      id: z.number(),
      price: z.number(),
      itemMaster: z.object({
        id: z.number(),
        code: z.string(),
        name: z.string(),
      }),
      venderType: z.object({
        id: z.number(),
        typeName: z.string(),
        description: z.string(),
      }),
    })
  ),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  editble,
  type,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editItemValue, setEditItemValue] =
    useState<weightScaleItem>(initItemValue)
  const [openModal, setOpenModal] = useState(false)
  const [outDate, setOutDate] = useState<Date>()
  const [inDate, setInDate] = useState<Date>()
  const [deleteItemId, setDeleteItemId] = useState()
  const [openDeleteItem, setOpenDeleteItem] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [actionStatus, setActionStatus] = useState('')

  const { setRefresh } = useContext(ApiContext) as ApiType
  //const [alert, setAlert] = useState('')

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     outEffectiveDate: '',
  //     inEffectiveDate: '',
  //     status: 'Active',
  //   },
  // })

  const form = useForm<z.infer<typeof formSchema>>({
    //resolver: zodResolver(formSchema),
    values: data,
  })

  async function addItem(payload: any) {
    //setAlert('')
    setIsLoading(true)
    payload.weightScalePriceId = data.id
    if (payload.id > 0) {
      const respone: any = await updateWeightScaleItems(payload)
      if (respone.status == 400) {
        setIsLoading(false)
        console.log('updateWeightScaleItems error:', respone)
      }
      if (respone.status == 200) {
        console.log('updateWeightScaleItems success', respone)
        data.weightScaleVenderTypeItem = []
        for (let index = 0; index < respone.data.length; index++) {
          data.weightScaleVenderTypeItem.push(respone.data[index])
        }
      }
    } else {
      console.log('add item', payload)
      const respone: any = await createWeightScaleItem(payload)
      // if (respone.status == 400) {
      //   setIsLoading(false)
      //   console.log('updateWeightScaleItems error:', respone)
      // }
      if (respone.status == 200) {
        console.log('createWeightScaleItem success', respone)
        data.weightScaleVenderTypeItem = []
        for (let index = 0; index < respone.data.length; index++) {
          data.weightScaleVenderTypeItem.push(respone.data[index])
        }
      }
    }

    setTimeout(() => {
      setIsLoading(false)
      setOpenModal(false)
    }, 2000)
  }

  async function deleteItem(id: any) {
    setDeleteItemId(id)
    setOpenDeleteItem(true)
    console.log('delete Item:', id)
  }

  async function editItem(item: any) {
    item.selectedItem = item.itemMaster?.name
    item.selectedVenderType = item.venderType?.typeName
    setEditItemValue(item)
    setOpenModal(true)
  }

  async function updateGeneralData(payload: any) {
    setIsLoading(true)
    if(actionStatus){
      payload.status = actionStatus
    }
    payload.inEffectiveDate = format(payload.inEffectiveDate, 'yyyy-MM-dd')
    payload.outEffectiveDate = format(payload.outEffectiveDate, 'yyyy-MM-dd')

    console.log('update Genral Data:', payload)
    const res: any = await updateWeightScale(payload)

    if (res.status == 200) {
      console.log(res.data)
    }
    setTimeout(() => {
      setIsLoading(false)
      setRefresh(true)
      setOutDate(payload.inEffectiveDate)
      setInDate(payload.outEffectiveDate)
      setActionStatus('')
      onClose()
    }, 1000)
  }

  async function confirmDeleteItem() {
    setIsLoading(true)
    console.log('deleteWeightScaleItemById', deleteItemId)

    const res: any = await deleteWeightScaleItemById(deleteItemId)

    if (res.status == 200) {
      console.log('delete Weight Scale Item success')
      const deleteIndex = data.weightScaleVenderTypeItem.findIndex(
        (a) => a.id == deleteItemId
      )
      if (deleteIndex != -1) {
        data.weightScaleVenderTypeItem.splice(deleteIndex, 1)
      }
    }

    setTimeout(() => {
      setOpenDeleteItem(false)
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    setIsMounted(true)
    setdeleteTitle(null)
   
  
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen h-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Weight Scale Price Detail</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Card>
              <CardContent className='m-2 h-[35rem] space-y-2'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(updateGeneralData)}>
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
                          <FormItem className='space-y-1 '>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a status'>
                                    {field.value}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              <SelectItem value='New'>New</SelectItem>
                                <SelectItem value='Active'>Active</SelectItem>
                                <SelectItem value='Inactive'>Inactive</SelectItem>
                                <SelectItem value='None'>None</SelectItem>

                              </SelectContent>
                            </Select>

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
                              <Input {...field} readOnly={editble} />
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
                                    disabled={editble}
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
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={inDate}
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
                                    disabled={editble}
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
                                    {/* {data.outEffectiveDate ? (
                                      format(
                                        data.outEffectiveDate,
                                        'dd-MM-yyyy'
                                      )
                                    ) : data.outEffectiveDate ? (
                                      format(
                                        data.outEffectiveDate,
                                        'dd-MM-yyyy'
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )} */}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={outDate}
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
                            <TableHead className='w-[10rem]'>
                              Vender Type
                            </TableHead>
                            <TableHead>Item Code</TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Price(Baht)</TableHead>

                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.weightScaleVenderTypeItem?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='text-left'>
                                {item.venderType?.typeName}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.itemMaster?.code}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.itemMaster?.name}
                              </TableCell>
                              <TableCell>{formatCurrency(item.price)}</TableCell>

                              <TableCell
                                className={`${type === 'approve' || type === 'view' ? 'hidden' : 'w-[8rem] text-white hover:bg-primary'}`}
                              >
                                <div className='flex items-center gap-3'>
                                  <IconEdit
                                    size={20}
                                    onClick={() => editItem(item)}
                                  />
                                  <IconTrash
                                    size={20}
                                    onClick={() => deleteItem(item.id)}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell className='item-center' colSpan={9}>
                              <Badge
                                className={`${editble ? 'hidden' : 'text-white hover:bg-primary'}`}
                                variant={'default'}
                                onClick={() => {
                                  setEditItemValue(initItemValue)
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
                      className={`${editble ? 'hidden' : 'w-full text-white hover:bg-primary'}`}
                      // className='float-end mt-2 h-10 w-full gap-3 border'
                      loading={isLoading}
                      type='submit'
                      variant='button'
                    >
                      <IconDeviceFloppy size={20} />
                      Update
                    </Button>
                    <div
                      className={`${type === 'approve' ? ' grid grid-cols-2 gap-3 text-white' : 'hidden'}`}
                    >
                      <Button
                        className='float-end mt-2 h-10 w-full gap-3 border'
                        loading={isLoading}
                        type='submit'
                        variant='button'
                        onClick={() => setActionStatus('reject')}
                      >
                        Reject
                      </Button>
                      <Button
                        className='float-end mt-2 h-10 w-full gap-3 border bg-primary'
                        loading={isLoading}
                        type='submit'
                        variant='button'
                        onClick={() => setActionStatus('approve')}
                      >
                        Approve
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <br />
            <DialogFooter></DialogFooter>
          </div>
        </DialogContent>

        <AlertModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={confirmDeleteItem}
          loading={isLoading}
          title={deleteTitle}
        />

        <AlertModal
          isOpen={openDeleteItem}
          onClose={() => setOpenDeleteItem(false)}
          onConfirm={confirmDeleteItem}
          loading={isLoading}
          title={'Are you sure to delete this item.'}
        />

        <CreateModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addItem(e)}
          editValue={editItemValue}
        />
      </Dialog>
    </>
  )
}
