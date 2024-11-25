import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { createVender, getVenderType, venderUploadFiles } from '@/services/vendersApi'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MagnifyingGlassIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { BillingModal } from './billing-modal'
import { Billing } from './billing-schema'
import { IconEdit, IconFile, IconPencilPlus, IconTrash } from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { ThaiAddress } from 'types/thaiaddress'
import { PageHeader } from '@/components/layouts/header'
import FileDrag from '@/components/custom/fileDrag'
import { Check, ChevronsUpDown } from 'lucide-react'
import { IVenderType } from './type'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  //id: z.string(),
  code: z.string().min(1, { message: 'Please enter your code' }),
  companyName: z.string().min(1, { message: 'Please enter your name' }),
  address: z.string(),
  fax: z.string(),
  tax: z.string(),
  phone: z.string(),
  contactName: z.string(),
  email: z.string().email({ message: 'Invalid email address' }),
  district: z.string(),
  subDistrict: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country: z.string(),
  phoneExt: z.string(),
  faxExt: z.string(),
  status: z.string(),
  specialIntruction: z.string(),
  paymentTerm: z.string(),
  paymentType: z.string(),
  currency: z.string(),
  alternatePhone: z.string(),
  latitude: z.string(),
  longtitude: z.string(),
  bankAccount: z.string(),
  remark: z.string(),
  selectedVenderType: z.string(),
  venderTypeId : z.number(),
  venderType : z.object({
    id: z.number(),
    typeName: z.string()
  }),
  venderBillings: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      address: z.string(),
      district: z.string(),
      subDistrict: z.string(),
      province: z.string(),
      zipcode: z.string(),
      country: z.string(),
      phone: z.string(),
      email: z.string(),
      contactName: z.string(),
      latitude: z.string(),
      longtitude: z.string(),
      branch: z.string(),
    })
  ),
})

const intial = {
  id: 0,
  code: '',
  name: '',
  type: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  zipcode: '',
  country: '',
  phone: '',
  email: '',
  contactName: '',
  latitude: '',
  longtitude: '',
  selectedBranch: '',
  branch: '',
  remark: 'new',
  selectedVenderType : '',
  venderTypeId : 0,
}

export function VenderForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [billings, setBilling] = useState<Billing[]>([])
  const [venderTypes, setVenderType] = useState<IVenderType[]>([])
  const [editBillings, setEditBilling] = useState<Billing>(intial)
  const [files, setFiles] = useState<File[]>([])
  const navigate = useNavigate()
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      companyName: '',
      address: '',
      phone: '',
      fax: '',
      tax: '',
      contactName: '',
      email: '',
      remark: '',
      status: 'Active',
      venderBillings: [],
    },
  })

  function uploadFile(payload: any) {
    setFiles(payload)
    console.log('File data:', payload)
  }

  function newBilling() {
    console.log('updateBilling')
    setEditBilling(intial)
    setOpenModal(true)
  }

  function updateBilling(payload: any) {
    console.log('updateBilling', payload)
    //payload.selectedBranch = '007'

    setEditBilling(payload)
    setOpenModal(true)
  }

  function deleteBilling(payload: any) {
    setBilling(billings.filter((x) => x.remark != payload.remark))
    console.log('deleteBilling', payload)
  }

  function addNewBilling(payload: any) {
    if (payload.remark == 'new') {
      console.log('add New Data', payload)
      payload.remark = uuidv4()
      billings.push(payload)
    } else {
      let existingIndex = billings.findIndex((x) => x.remark == payload.remark)
      if (existingIndex != -1) {
        billings[existingIndex] = payload
      }
    }
    setOpenModal(false)
    setEditBilling(intial)
  }

  function onSelectResult(e: any) {
    if (dataValue) {
      setAddressThai(dataValue)
      const index: any = addressThai?.find((a) => a.id == e.target.value)
      console.log('onSelectResult', index)
      form.setValue('district', index?.districtThai)
      form.setValue('subDistrict', index?.tambonThai)
      form.setValue('province', index?.provinceThai)
      form.setValue('zipcode', index?.postCode)
      form.setValue('country', 'ประเทศไทย')

      setIsOpen(true)
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    data.venderBillings = billings
    console.log('create new vender', data)

    const response: any = await createVender(data)
    if (response.id > 0) {
      console.log('createVender -success', response.status)

      //data.files = files
      if (files?.length > 0) {
        console.log('upload file to vender id:', response);
        
        const formData = new FormData()
        for (let i = 0; i < files?.length; i++) {
          formData.append('files', files[i])
          formData.append('venderId', response.id)
        }

        const res: any = await venderUploadFiles(formData)
        if (res.status == 200) {
          console.log('uploadFiles -success', res.status)
        }
      }
      navigate('/master/vender', { replace: true })
    }
    setEditBilling(intial)
    setTimeout(() => {
      setIsLoading(false)
      setBilling([])
    }, 2000)
  }
  const SearchAddress: React.FC<{ dataValue?: ThaiAddress[] }> = ({
    dataValue,
  }) => {
    if (dataValue) {
      setAddressThai(dataValue)
    } else {
      return null
    }

    
    return (
      <div
        className={cn(
          'absolute float-start w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95 dark:bg-black',
          isOpen ? 'hidden' : 'block'
        )}
      >
        <ul
          className=' max-h-56 w-full overflow-y-auto rounded-lg ring-1 ring-slate-200 '
          onClick={onSelectResult}
        >
          {dataValue?.map(
            ({ id, districtThai, tambonThai, provinceThai, postCode }) => (
              <li
                className='relative flex w-full items-center gap-2 text-[0.8rem] text-black  dark:text-muted-foreground'
                value={id}
                key={id}
              >
                -{tambonThai}-{districtThai}-{provinceThai}-{postCode}
              </li>
            )
          )}
        </ul>
      </div>
    )
  }

  useEffect(() => {
    
    getVenderType().then((data) => setVenderType(data))
   
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Vender'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('gap-4', className)} {...props}>
            <Tabs defaultValue='information' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='information'>
                  General Information
                </TabsTrigger>
                <TabsTrigger value='account'>Billing</TabsTrigger>
              </TabsList>
              <TabsContent value='information'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        {/* <IconMap /> */}
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Information.
                        </Label>
                      </div>
                      <FormField
                        control={form.control}
                        name='companyName'
                        render={({ field }) => (
                          <FormItem className='col-span-3 space-y-1'>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='tax'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Tax ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='bankAccount'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Bank Account</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='specialIntruction'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Special Intruction</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='paymentTerm'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Payment Term</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                            control={form.control}
                            name='selectedVenderType'
                            render={({ field }) => (
                              <FormItem className='grid space-y-3'>
                                <FormLabel>Vender Type</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant='outline'
                                        role='combobox'
                                        className={cn(
                                          'bg-forefround hover:bg-forefround justify-between',
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value
                                          ? venderTypes.find(
                                              (item) =>
                                                item.typeName === field.value
                                            )?.typeName
                                          : 'Select type'}
                                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-[200px] p-0'>
                                    <Command>
                                      <CommandInput placeholder='Search type...' />
                                      <CommandList>
                                        <CommandEmpty>
                                          No type found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {venderTypes.map((item) => (
                                            <CommandItem
                                              value={item.typeName}
                                              key={item.id}
                                              onSelect={() => {
                                                form.setValue('selectedVenderType', item.typeName)
                                                form.setValue('venderTypeId', item.id)

                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  'mr-2 h-4 w-4',
                                                  item.typeName === field.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                              {item.typeName}
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
                        name='paymentType'
                        render={({ field }) => (
                          <FormItem className='space-y-1 '>
                            <FormLabel>Payment Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Cash'>Cash</SelectItem>
                                <SelectItem value='Credit'>Credit</SelectItem>
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
                          <FormItem className='space-y-1 '>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        {/* <IconMap /> */}
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Address.
                        </Label>
                      </div>
                      <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                          <FormItem className='col-span-3 space-y-1'>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='relative mt-2 '>
                        <Label className='py-1' htmlFor='district'>
                          Sub-District
                        </Label>
                        <div className='flex items-center  px-3 '>
                          <MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 border-separate opacity-50' />

                          <Input
                            {...form.register('subDistrict')}
                            className='mt-1 text-[0.8rem]'
                            onChange={debounceValue}
                            onClick={() => setIsOpen(false)}
                          ></Input>
                        </div>
                        <SearchAddress dataValue={dataValue} />
                      </div>

                      <FormField
                        control={form.control}
                        name='district'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='province'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='zipcode'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Zipcode</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='country'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='latitude'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='longtitude'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Longtitude</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        {/* <IconMap /> */}
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Contact.
                        </Label>
                      </div>
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='phoneExt'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Phone-Ext</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='fax'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Fax</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='faxExt'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Fax-Ext</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='contactName'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='alternatePhone'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Alternate Phone</FormLabel>
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
                          <FormItem className='col-span-3 space-y-1'>
                            <FormLabel>Remark</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
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
                    <Button
                      className='mt-2 w-full'
                      loading={isLoading}
                      variant='button'
                    >
                      Create
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value='account'>
                <Table>
                  <TableCaption>A list of your recent permission.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Sub-District</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>Postcode</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billings?.map((item) => (
                      <TableRow key={item.remark}>
                        <TableCell className='text-left'>{item.code}</TableCell>
                        <TableCell className='text-left'>{item.name}</TableCell>
                        <TableCell className='text-left'>
                          {item.address}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.district}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.subDistrict}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.province}
                        </TableCell>

                        <TableCell className='text-left'>
                          {item.zipcode}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.country}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.contactName}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.phone}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.email}
                        </TableCell>

                        <TableCell>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='rounded-full'
                            onClick={() => updateBilling(item)}
                          >
                            <IconEdit size={20} />
                          </Button>

                          <Button
                            size='icon'
                            variant='ghost'
                            className='rounded-full'
                            onClick={() => deleteBilling(item)}
                          >
                            <IconTrash size={20} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant='button'
                          size='sm'
                          className='w-13 h-8'
                          onClick={newBilling}
                        >
                          <PlusCircledIcon className='mr-2 h-4 w-4' />
                          Add Billng
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <BillingModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addNewBilling(e)}
          editData={editBillings}
        />
      </LayoutBody>
    </Layout>
  )
}
