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
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import {
  createItem,
  createWip,
  getItemCategory,
  getItemGroup,
  getItemType,
  itemMasterUploadFiles,
} from '@/services/itemApi'

import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUom } from '@/services/bomApi'
import { LocationType } from '@/pages/location/components/type'
import { getLocation } from '@/services/locationApi'
import FileDrag from '@/components/custom/fileDrag'
import { PageHeader } from '@/components/layouts/header'
import { IconFile, IconPencilPlus } from '@tabler/icons-react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { IconInfoCircle } from '@tabler/icons-react'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const itemStatus = [
  { value: 'Active', name: 'Active' },
  { value: 'Inactive', name: 'Inactive' },
]
interface ItemType {
  id: number
  name: string
}

interface ItemGroup {
  id: number
  name: string
}

interface ItemCategory {
  id: number
  name: string
}

interface Uom {
  id: string
  code: string
}

const formSchema = z.object({
  code: z.string().min(1, { message: 'Please enter your email' }),
  name: z.string().min(1, {
    message: 'Please enter your password',
  }),
  description: z.string(),
  status: z.string(),
  category: z.string(),
  itemCategoryId: z.number(),
  itemGroupId: z.number(),
  itemTypeId: z.number(),
  subCategory1: z.string(),
  subCategory2: z.string(),
  subCategory3: z.string(),
  brand: z.string(),
  size: z.string(),
  model: z.string(),
  feature: z.string(),
  material: z.string(),
  specification: z.string(),
  group: z.string(),
  type: z.string(),
  purchaseLeadTime: z.string(),
  manufacturingLeadTime: z.string(),
  weight: z.string(),
  safetyStock: z.string(),
  stockingUom: z.string(),
  alternateUom: z.string(),
  cubicVolumn: z.string(),
  lenght: z.string(),
  width: z.string(),
  height: z.string(),
  standardCost: z.number(),
  averageCost: z.number(),
  convertFactor: z.number(),
  selectedLocation: z.string(),
  locationId: z.number(),
  combineMtFlag: z.boolean(),
  lotControlFlag: z.boolean(),
  shefLifeDay: z.string(),
  specialInstruction: z.string(),
})

export function ItemForm({ className, ...props }: SignUpFormProps) {
  const [uom, setUom] = useState<Uom[]>([])
  const [itemType, setType] = useState<ItemType[]>([])
  const [itemGroup, setGroup] = useState<ItemGroup[]>([])
  const [itemCategory, setCategory] = useState<ItemCategory[]>([])
  const [locations, setLocation] = useState<LocationType[]>([])
  const [files, setFiles] = useState<File[]>()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      status: '',
      category: '',
      itemCategoryId: 0,
      locationId: 0,
      itemGroupId: 0,
      itemTypeId: 0,
      alternateUom: '',
      subCategory1: '',
      subCategory2: '',
      subCategory3: '',
      brand: '',
      size: '',
      model: '',
      feature: '',
      material: '',
      specification: '',
      group: '',
      purchaseLeadTime: '',
      manufacturingLeadTime: '',
      weight: '',
      safetyStock: '',
      stockingUom: '',
      cubicVolumn: '',
      lenght: '',
      width: '',
      height: '',
      selectedLocation: '',

      combineMtFlag: false,
      lotControlFlag: false,
      shefLifeDay: '',
      specialInstruction: '',
      type: '',
    },
  })

  function uploadFile(payload: any) {
    setFiles(payload)
    console.log('File data:', payload)
  }

  async function onSubmit(data: any) {
    setIsLoading(true)
    const locatId: any = locations.find((x) => x.name === data.selectedLocation)
    if (locatId) data.locationId = locatId.id

    const catId: any = itemCategory.find((x) => x.name === data.category)
    if (catId) data.itemCategoryId = catId.id

    const typeId: any = itemType.find((x) => x.name === data.type)
    if (typeId) data.itemTypeId = typeId.id

    const groupId: any = itemGroup.find((x) => x.name === data.group)
    if (groupId) data.itemGroupId = groupId.id
    console.log('onSubmit', data)

    const response: any = await createItem(data)
    console.log('uploadFiles -success', response)
    if (response.id) {
      if (typeId.name == 'Work in Process') {
        const res: any = await createWip(response.id)
        console.log('CreateWip', res.data)
      }
      data.files = files
      if (data.files) {
        const formData = new FormData()
        for (let i = 0; i < data.files?.length; i++) {
          formData.append('files', data.files[i])
          formData.append('itemMasterId', response.id)
        }

        const res: any = await itemMasterUploadFiles(formData)
        if (res.status == 200) {
          console.log('uploadFiles -success', res.status)
        }
      }

      console.log('createVender -success')
      navigate('/master/item', { replace: true })
    }

    setTimeout(() => {
      setIsLoading(false)
      navigate('/master/item', { replace: true })
    }, 2000)
  }

  useEffect(() => {
    getUom().then((data) => setUom(data))
    getItemCategory().then((data) => setCategory(data))
    getItemGroup().then((data) => setGroup(data))
    getItemType().then((data) => setType(data))
    getLocation().then((data) => setLocation(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Item'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* <Tabs defaultValue='general' className='w-full'>
                  <TabsList className='grid w-full grid-cols-2 '>
                    <TabsTrigger value='general'>
                      General Information
                    </TabsTrigger>
                    <TabsTrigger value='planing'>
                      Planing & Stock Information
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value='general'> */}
                {/* <Card> */}
                  {/* <CardHeader>
                        <CardTitle>general</CardTitle>
                        <CardDescription>
                          Make changes to your account here. Click save when
                          you're done.
                        </CardDescription>
                      </CardHeader> */}
                  {/* <CardContent className='space-y-2 p-2'> */}
                    <div className='grid grid-cols-3 gap-2 rounded-md border p-4 m-2 shadow'>
                      <div className='col-span-3 mb-3 mt-3 flex items-center'>
                        <IconInfoCircle />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Information.
                        </Label>
                      </div>
                      <div className='col-span-3'>
                        <hr />
                      </div>
                      <FormField
                        control={form.control}
                        name='code'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem className='col-span-2 space-y-1'>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem className='col-span-3 space-y-1'>
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
                        name='category'
                        render={({ field }) => (
                          <FormItem className='grid space-y-3'>
                            <FormLabel>Category</FormLabel>
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
                                      ? itemCategory.find(
                                          (item) => item.name === field.value
                                        )?.name
                                      : 'Select category'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search category...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      No category found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {itemCategory.map((item) => (
                                        <CommandItem
                                          value={item.name}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue('category', item.name)
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
                        name='subCategory1'
                        render={({ field }) => (
                          <FormItem className='hidden space-y-1'>
                            <FormLabel>Sub-Category1</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='subCategory2'
                        render={({ field }) => (
                          <FormItem className='hidden space-y-1'>
                            <FormLabel>Sub-Category2</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='subCategory3'
                        render={({ field }) => (
                          <FormItem className='hidden space-y-1'>
                            <FormLabel>Sub-Category3</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='brand'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='size'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='stockingUom'
                        render={({ field }) => (
                          <FormItem className='grid space-y-3'>
                            <FormLabel>Stocking-Uom</FormLabel>
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
                                      ? uom.find(
                                          (item) => item.code === field.value
                                        )?.code
                                      : 'Select stocking Uom'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search stocking Uom...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      No stockingUom found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {uom.map((item) => (
                                        <CommandItem
                                          value={item.code}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'stockingUom',
                                              item.code
                                            )
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              item.code === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {item.code}
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
                        name='alternateUom'
                        render={({ field }) => (
                          <FormItem className='grid space-y-3'>
                            <FormLabel>Alternal UOM </FormLabel>
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
                                      ? uom.find(
                                          (item) => item.code === field.value
                                        )?.code
                                      : 'Select Alternal Uom'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search Alternal Uom...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      No Alternal UOM found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {uom.map((item) => (
                                        <CommandItem
                                          value={item.code}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue(
                                              'alternateUom',
                                              item.code
                                            )
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              item.code === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {item.code}
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
                        name='convertFactor'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Convert Factor</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                {...field}
                                onChange={(event) =>
                                  field.onChange(parseFloat(event.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <FormField
                            control={form.control}
                            name='stockingUom'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Stocking-Uom</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select Stocking-Uom' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {uom.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.code}
                                      >
                                        {item.code}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                      <FormField
                        control={form.control}
                        name='model'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='feature'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Feature</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='material'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Material</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='specification'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Specification</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem className='grid space-y-3'>
                            <FormLabel>Type</FormLabel>
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
                                      ? itemType.find(
                                          (item) => item.name === field.value
                                        )?.name
                                      : 'Select type'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-[200px] p-0'>
                                <Command>
                                  <CommandInput placeholder='Search type...' />
                                  <CommandList>
                                    <CommandEmpty>No type found.</CommandEmpty>
                                    <CommandGroup>
                                      {itemType.map((item) => (
                                        <CommandItem
                                          value={item.name}
                                          key={item.id}
                                          onSelect={() => {
                                            form.setValue('type', item.name)
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

                      {/* <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select Type' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {itemType.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.name}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                      <FormField
                        control={form.control}
                        name='group'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Group</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select Group' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {itemGroup.map((item) => (
                                  <SelectItem key={item.id} value={item.name}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select Status' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {itemStatus.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.name}
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                    </div>

                    {/* </CardContent> */}
                    {/* <CardFooter>
                        <Button>Save changes</Button>
                      </CardFooter> */}
                    {/* </Card>
                  </TabsContent>
                  <TabsContent value='planing'>
                    <Card> */}
                    {/* <CardHeader>
                        <CardTitle>Planing</CardTitle>
                        <CardDescription>
                          Change your password here. After saving, you'll be
                          logged out.
                        </CardDescription>
                      </CardHeader> */}
                    {/* <CardContent className='space-y-2'> */}
                    <div className='grid grid-cols-3 gap-2 rounded-md border p-4 m-2 shadow'>
                      <div className='col-span-3 mb-3 mt-3 flex items-center '>
                        <IconInfoCircle />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Planing.
                        </Label>
                      </div>
                      <div className='col-span-3'>
                        <hr />
                      </div>
                      <FormField
                        control={form.control}
                        name='purchaseLeadTime'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Purchase LeadTime</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='manufacturingLeadTime'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Manufacturing LeadTime</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='weight'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='safetyStock'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Safety Stock</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='cubicVolumn'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Cubic Volumn</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='lenght'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Lenght</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='width'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Width</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='height'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='selectedLocation'
                        render={({ field }) => (
                          <FormItem className='grid space-y-3'>
                            <FormLabel>Default Location</FormLabel>
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
                                              'selectedLocation',
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

                      {/* <FormField
                            control={form.control}
                            name='selectedLocation'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Default Location</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select Location'/>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {locations.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.name}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}

                      <FormField
                        control={form.control}
                        name='shefLifeDay'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>ShefLife Day</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='specialInstruction'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Special Instruction</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='standardCost'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Standard Cost</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                {...field}
                                onChange={(event) =>
                                  field.onChange(parseFloat(event.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   
                  
                      <FormField
                        control={form.control}
                        name='averageCost'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Average Cost</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                {...field}
                                onChange={(event) =>
                                  field.onChange(parseFloat(event.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      

                      <FormField
                        control={form.control}
                        name='combineMtFlag'
                        render={({ field }) => (
                          <FormItem className='mt-7 flex h-[37px] flex-row items-start space-x-3 space-y-0 rounded-md border p-2.5  shadow'>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel>Combine Mt Flag</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='lotControlFlag'
                        render={({ field }) => (
                          <FormItem className='mt-4 flex h-[37px] flex-row items-start space-x-3 space-y-0 rounded-md border p-2.5 shadow'>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel>Lot Control Flag</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                 
                    </div>
                    <div className='mb-3 m-2 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        <IconFile />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          File Attachment.
                        </Label>
                      </div>
                      <div className='col-span-3 mb-2  flex items-center'>
                        <FileDrag uploadData={(e) => uploadFile(e)} />
                      </div>
                    </div>
                  {/* </CardContent>
                  <CardFooter>
                        <Button>Save password</Button>
                      </CardFooter>
                </Card> */}
                {/* </TabsContent>
                </Tabs> */}

                <br />
                <div>
                  <Button
                    className='mt-2 w-full'
                    loading={isLoading}
                    variant='button'
                  >
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
