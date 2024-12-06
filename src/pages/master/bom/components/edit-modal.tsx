//import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Card, CardContent } from '@/components/ui/card'
//import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

import { cn } from '@/lib/utils'
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
import { BomType } from './type'
import {
  createBomItem,
  deleteBomItemById,
  updateBom,
  updateBomItems,
} from '@/services/bomApi'
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
import { ItemType } from '../../item/components/type'
import { getItemBom } from '@/services/itemApi'
import { Check, ChevronsUpDown } from 'lucide-react'
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

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: BomType
  editble: boolean
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

const formSchema = z.object({
  // bomId: z.number(),
  // itemMasterId: z.number(),
  // selectItem: z.string(),
  // outEffectiveDate: z.string(),
  // inEffectiveDate: z.string(),
  // quantity: z.number(),
  // scrap: z.number(),
  // outDate: z.date({
  //   required_error: 'A date of birth is required.',
  // }),
  // inDate: z.date({
  //   required_error: 'A date of birth is required.',
  // }),
  // status: z.string(),
  id: z.string(),
  description: z.string(),
  name: z.string(),
  status: z.string(),
  // quantity: z.number(),
  // scrap: z.number(),
  // inEffectiveDate: z.string(),
  // outEffectiveDate: z.string(),
  selectedItemmaster: z.string(),
  itemMasterId: z.number(),
  // itemMaster: z.object({
  //   code: z.string(),
  // }),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  editble,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  //const [updateLoading, setUpdateLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  //const [items, setItems] = useState<ItemType[]>([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
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

  // const handleSelectItem = (e: any) => {
  //   console.log('handleSelectItem', e)
  //   const selectItem = itemMaster.find((x) => x.name == e)
  //   if (selectItem) {
  //     console.log('selectItem', selectItem)
  //     form.setValue('bomId', parseInt(data.id))
  //     form.setValue('selectItem', e)
  //     form.setValue('itemMasterId', parseInt(selectItem.id))

  //   }
  // }

  async function addItem(payload: any) {
    //setAlert('')
    setIsLoading(true)
    console.log('add item', payload)
    const newItem = {
      bomId: data.id,
      inEffectiveDate: format(payload.inEffectiveDate, 'yyyy-MM-dd'),
      outEffectiveDate: format(payload.outEffectiveDate, 'yyyy-MM-dd'),
      status: payload.status,
      quantity: payload.quantity,
      scrap: payload.scrap,
      itemMasterId: payload.itemMasterId,
    }

    console.log('add new item', newItem)

    const respone: any = await createBomItem(newItem)

    if (respone.status == 400) {
      setIsLoading(false)
      //setAlert(respone.data)
      console.log('Create error:', respone)
    }
    if (respone.status == 200) {
      console.log('createBomItem success', respone)
      data.bomItems = []
      for (let index = 0; index < respone.data.length; index++) {
        data.bomItems.push(respone.data[index])
      }
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  async function updateBomItem(id: any) {
    //setUpdateLoading(true)
    const updateItem = data.bomItems.findIndex((item) => item.id == id)
    console.log('updateBomItem:', data.bomItems[updateItem])

    if (updateItem != -1) {
      const res: any = await updateBomItems(data.bomItems[updateItem])

      if (res.status == 200) {
        console.log('updateBomItem success')
      }
    }
  }

  async function updateGeneralData(payload: any) {
    setIsLoading(true)
    console.log('update Genral Data:', payload)
    const res: any = await updateBom(payload)

    if (res.status == 200) {
      console.log(res.data)
    }
    setTimeout(() => {
      setIsLoading(false)
      setRefresh(true)

      onClose()
    }, 1000)
  }
  function deleteBomItem(payload: any) {
    console.log('deleteBomItem', payload)
    setDeleteId(payload.id)
    setdeleteTitle(payload.itemMaster?.name)
    setOpenDeleteModal(true)
  }

  async function confirmDeleteItem() {
    setIsLoading(true)
    console.log('deleteBomItem', deleteId)

    const res: any = await deleteBomItemById(deleteId)

    if (res.status == 200) {
      console.log('delete Bom Item success')
      const deleteIndex = data.bomItems.findIndex((a) => a.id == deleteId)
      if (deleteId != -1) {
        data.bomItems.splice(deleteIndex, 1)
      }
    }

    setTimeout(() => {
      setOpenDeleteModal(false)
      setIsLoading(false)
    }, 1000)
  }

  function handleChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
    const changeItem: any = data.bomItems.findIndex(
      (item) => item.id == e.target.id
    )
    data.bomItems[changeItem].quantity = parseFloat(e.target.value)
    //console.log('handleChangePrice id', id)
    console.log('handleChangeQuantity value', data.bomItems[changeItem])
  }

  function handleChangeScrap(e: ChangeEvent<HTMLInputElement>) {
    const changeItem: any = data.bomItems.findIndex(
      (item) => item.id == e.target.id
    )
    data.bomItems[changeItem].scrap = parseFloat(e.target.value)
    //console.log('handleChangePrice id', id)
    console.log('handleChangeScrap value', data.bomItems[changeItem])
  }

  const handleChangeInEffectiveDate = (e: ChangeEvent<HTMLInputElement>) => {
    const changeItem = data.bomItems.findIndex((item) => item.id == e.target.id)
    data.bomItems[changeItem].inEffectiveDate = e.target.value
    //console.log('handleChangePrice id', id)
    console.log('handleChangeScrap value', data.bomItems[changeItem])
  }

  const handleChangeOutEffectiveDate = (e: ChangeEvent<HTMLInputElement>) => {
    const changeItem = data.bomItems.findIndex((item) => item.id == e.target.id)
    data.bomItems[changeItem].outEffectiveDate = e.target.value
  }

  const handleChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const changeItem = data.bomItems.findIndex((item) => item.id == e.target.id)
    if (changeItem != -1) {
      data.bomItems[changeItem].status = e.target.value
    }
  }

  useEffect(() => {
    setIsMounted(true)
    //getItemBomItem().then((data) => setItems(data))
    getItemBom().then((data) => setItemMaster(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen h-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Bom</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            {/* <form onSubmit={form.handleSubmit(updateData)}> */}
            {/* <Tabs defaultValue='general' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='general'>General</TabsTrigger>
                <TabsTrigger value='materiallist'>Material List</TabsTrigger>
              </TabsList>
              <TabsContent value='general'> */}
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
                        name='name'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Bom Name</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly={editble} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='selectedItemmaster'
                        render={({ field }) => (
                          <FormItem className='grid space-y-3'>
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
                                      {itemMaster.map((item) => (
                                        <CommandItem
                                          value={item.name}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'selectedItemmaster',
                                              item.name
                                            )
                                            form.setValue(
                                              'itemMasterId',
                                              parseInt(item.id)
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
                        name='description'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly={editble} />
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
                              <Input {...field} readOnly={editble} />
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
                      <Table className='w-[70rem]'>
                        <TableCaption>
                          A list of your recent items.
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='w-[10rem]'>
                              Item code
                            </TableHead>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Scrap</TableHead>
                            <TableHead>InEffective Date</TableHead>
                            <TableHead>OutEffective Date</TableHead>
                            <TableHead className='w-[7rem]'>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.bomItems?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='text-left'>
                                {item.itemMaster?.code}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.itemMaster?.name}
                              </TableCell>
                              <TableCell>
                                <Input
                                  className='w-[80px]'
                                  type='float'
                                  id={item.id}
                                  defaultValue={item.quantity?.toFixed(2)}
                                  onChange={handleChangeQuantity}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  className='w-[100px]'
                                  type='float'
                                  id={item.id}
                                  defaultValue={item.scrap?.toFixed(2)}
                                  onChange={handleChangeScrap}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  className='w-[100px]'
                                  id={item.id}
                                  type='text'
                                  name='inEffectiveDate'
                                  defaultValue={item.inEffectiveDate}
                                  onChange={handleChangeInEffectiveDate}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  className='w-[100px]'
                                  type='text'
                                  name='outEffectiveDate'
                                  id={item.id}
                                  defaultValue={item.outEffectiveDate}
                                  onChange={handleChangeOutEffectiveDate}
                                />
                              </TableCell>
                              <TableCell>
                                <select
                                  // {...register('itemMasterId')}
                                  defaultValue={item.status}
                                  id={item.id}
                                  onChange={handleChangeStatus}
                                  className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                                >
                                  <option
                                    className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                    value='Active'
                                  >
                                    Active
                                  </option>
                                  <option
                                    className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                    value='Inactive'
                                  >
                                    Inactive
                                  </option>
                                </select>
                              </TableCell>

                              <TableCell className='w-[8rem]'>
                                <div className='flex items-center gap-3'>
                                  <IconEdit
                                    size={20}
                                    onClick={() => updateBomItem(item.id)}
                                  />
                                  <IconTrash
                                    size={20}
                                    onClick={() => deleteBomItem(item)}
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
                                onClick={() => setOpenModal(true)}
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
                      disabled={editble}
                      className='float-end mb-3 mt-2 h-10 w-full gap-3 border'
                      loading={isLoading}
                      type='submit'
                      variant='button'
                    >
                      <IconDeviceFloppy size={20} />
                      Save Change
                    </Button>
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

        <CreateModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addItem(e)}
        />
      </Dialog>
    </>
  )
}
