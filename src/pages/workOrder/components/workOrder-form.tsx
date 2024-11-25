import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
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

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, formatDate } from 'date-fns'
import { Textarea } from '@/components/ui/textarea'
import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import { ItemType } from '@/pages/master/item/components/type'
import { getItemBom } from '@/services/itemApi'
import { createWorkOrder, workOrderUploadFiles } from '@/services/workOrderApi'
import FileDrag from '@/components/custom/fileDrag'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  code: z.string(),
  cause: z.string().min(0),
  selectLocation: z.string(),
  selectItem: z.string(),
  quantity: z.string(),
  unit: z.string(),
  remark: z.string().min(0),
  status: z.string(),
  createAt: z.string(),
  createBy: z.string(),
})

export function WorkOrderForm() {
  //  const [items, setItem] = useState<ItemList[]>([])
  // const [user, setUser] = useState('')
  //const [editValue, setEditValue] = useState<ItemList>(initalValue)
  const [locations, setLocation] = useState<LocationType[]>([])
  const [itemMasters, setItems] = useState<ItemType[]>([])
  const [files, setFiles] = useState<File[]>()
  const [isLoading, setIsLoading] = useState(false)
  // const [openModal, setOpenModal] = useState(false)

  const navigate = useNavigate()
  let today = new Date()
  let user: any = localStorage.getItem('user')
  let dateCode = formatDate(today, 'yyyy-MM-dd')
  let newCode = dateCode.split('-')
  // const { handleSubmit, register, setValue } = useForm()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cause: '',
      //selectLocation: '1',
      code: 'WO' + newCode[0] + newCode[1] + newCode[2],
      createBy: user,
      createAt: formatDate(today, 'yyyy-MM-dd'),
      status: 'New WorkOrder',
      remark: '',
    },
  })

  function addFile(payload: any) {
    setFiles(payload)
    console.log('File data:', payload)
  }

  async function onSubmit(data: any) {
    setIsLoading(true)

    const selectedLocation: any = locations.find(
      (item) => item.name == data.selectLocation
    )

    const selectedItemMaster: any = itemMasters.find(
      (item) => item.name == data.selectItem
    )
    const userid: any = localStorage.getItem('userId')
    data.itemMasterId = selectedItemMaster.id

    data.locationId = selectedLocation.id
    data.userId = parseInt(userid)
    data.files = files
    data.createAt = format(today, 'yyyy-MM-dd')
    //data.purchaseRequestItems = items
    console.log('onSubmit', data)

    const respone: any = await createWorkOrder(data)
    console.log('createWorkOrder ', respone)
    if (respone.id) {
      if (files) {
        const formData = new FormData()
        for (let i = 0; i < data.files?.length; i++) {
          formData.append('files', data.files[i])
          formData.append('WorkOrderId', respone.id)
        }
        console.log('uploadFiles', formData)
        const res: any = await workOrderUploadFiles(formData)
        if (res.status == 200) {
          console.log('uploadFiles -success', res.status)
        }
      }
      setTimeout(() => {
        setIsLoading(false)
        navigate('/workOrder', { replace: true })
      }, 2000)
    }
  }

  useEffect(() => {
    //setItem([])
    getItemBom().then((data) => setItems(data))
    getLocation().then((data) => setLocation(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Work Order'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />

        <Separator />
        <br />

       
        <Card>
          <CardContent className='space-y-2'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid gap-4'>
                  <div className='grid grid-cols-2 gap-2'>
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
                      name='selectLocation'
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
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? locations.find(
                                        (item) => item.name === field.value
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
                                          form.setValue(
                                            'selectLocation',
                                            item.name
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
                      name='createBy'
                      render={({ field }) => (
                        <FormItem className='space-y-1'>
                          <FormLabel>Request By</FormLabel>
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
                      name='selectItem'
                      render={({ field }) => (
                        <FormItem className='mt-2 grid space-y-1.5'>
                          <FormLabel>Item Master</FormLabel>
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
                                    ? itemMasters.find(
                                        (item) => item.name === field.value
                                      )?.name
                                    : 'Select item master'}
                                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[200px] p-0'>
                              <Command>
                                <CommandInput placeholder='Search item master...' />
                                <CommandList>
                                  <CommandEmpty>
                                    No item master found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {itemMasters.map((item) => (
                                      <CommandItem
                                        value={item.name}
                                        key={item.id}
                                        onSelect={() => {
                                          form.setValue('selectItem', item.name)
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
                      name='quantity'
                      render={({ field }) => (
                        <FormItem className='space-y-1 '>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='unit'
                      render={({ field }) => (
                        <FormItem className='space-y-1 '>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} readOnly />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='cause'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cause</FormLabel>
                          <FormControl>
                            <Textarea
                              className='col-span-3 resize-none'
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='remark'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remark</FormLabel>
                          <FormControl>
                            <Textarea className='resize-none' {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FileDrag uploadData={(e) => addFile(e)} />

                  <div className='grid'>
                    <Button
                      loading={isLoading}
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
          </CardContent>
        </Card>
      </LayoutBody>
    </Layout>
  )
}
