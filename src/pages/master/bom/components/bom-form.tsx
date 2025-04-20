import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { format } from 'date-fns'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn, toCurrency } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
//import { Calendar } from '@/components/ui/calendar'
import { createBom, createBomItems } from '@/services/bomApi'
import { getItemBom } from '@/services/itemApi'
import { ItemType } from '../../item/components/type'
//import { BomType } from './type'
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
import { Check, ChevronsUpDown } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

type Bomitems = {
  id: string
  itemMasterCode: string
  itemMasterName: string
  quantity: number
  scrap: number
  inEffectiveDate: string
  outEffectiveDate: string
  bomId: string
  status: string
}

// const initialValue = {
//   id: '',
//   code: '',
//   name: '',
//   description: '',
//   quantity: 0,
//   scrap: 0,
//   inEffectiveDate: '',
//   outEffectiveDate: '',
//   status: '',
//   bomItems: [],
// }
const formSchema = z.object({
  //id: z.number(),
  name: z.string().min(1),
  description: z.string().min(1),
  selectedItemmaster: z.string().min(1),
  itemMasterId: z.number(),
  remark: z.string().min(0),
  status: z.string(),
})

export function BomForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  //const [bomValue, setBomValue] = useState<BomType>(initialValue)
  const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [boms, setBom] = useState<Bomitems[]>([])

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Active',
      remark: ''
    },
  })

  function addNewData(payload: any) {
    payload.inEffectiveDate = format(payload.inEffectiveDate, 'yyyy-MM-dd')
    payload.outEffectiveDate = format(payload.outEffectiveDate, 'yyyy-MM-dd')
    console.log('addNewData', payload)

    boms.push(payload)
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // const itemId: any = itemMaster.find(
    //   (item) => item.name == data.selectedItemmaster
    // )
    // data.itemMasterId = itemId.id
    const respone: any = await createBom(data)

    if (respone.id) {
      const newBomItems = {
        id: respone.id,
        name: data.name,
        description: data.description,
        remark: data.remark,
        status: data.status,
        itemMasterId: data.itemMasterId,
        bomItems: boms,
      }

      console.log('createBom', newBomItems)

      const res: any = await createBomItems(newBomItems)
      if (res.status == 200) {
        console.log('updateBomItems -success', res)
        navigate('/master/bom', { replace: true })
      }
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    setBom([])
    // setBomValue(initialValue)
    setIsLoading(false)
    getItemBom().then((data) => setItemMaster(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Bom'
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
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Bom Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                </div>

                <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <div className='mb-2  flex items-center'>
                    <IconChecklist />
                    <Label htmlFor='terms' className='ml-3 text-lg'>
                      Items List.
                    </Label>
                  </div>
                  <Table className='w-[70rem]'>
                    <TableCaption>A list of your recent items.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[10rem]'>Item code</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Scrap</TableHead>
                        <TableHead>InEffective Date</TableHead>
                        <TableHead>OutEffective Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {boms?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className='text-left'>
                            {item.itemMasterCode}
                          </TableCell>
                          <TableCell className='text-left'>
                            {item.itemMasterName}
                          </TableCell>
                          <TableCell>{toCurrency(item.quantity)}</TableCell>
                          <TableCell>{item.scrap}</TableCell>
                          <TableCell>{item.inEffectiveDate}</TableCell>
                          <TableCell>{item.outEffectiveDate}</TableCell>
                          <TableCell className='w-[8rem]'>
                          <IconTrash size={20}   onClick={() =>
                                setBom(boms.filter((a) => a.id != item.id))
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
                  className='float-end mt-2 h-10 w-full border gap-3'
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
          // data={bomValue}
        />
      </LayoutBody>
    </Layout>
  )
}
