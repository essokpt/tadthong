import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
//import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { createCustomer, customerUploadFiles } from '@/services/customerApi'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { CustomerBilling } from './billing-schema'
import { MagnifyingGlassIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { BillingModal } from './billing-modal'
import { format } from 'date-fns'
import {
  IconEdit,
  IconFile,
  IconPencilPlus,
  IconTrash,
} from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'
import { ThaiAddress } from 'types/thaiaddress'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { PageHeader } from '@/components/layouts/header'
import FileDrag from '@/components/custom/fileDrag'
//import { zodResolver } from '@hookform/resolvers/zod'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  code: z.string().min(1, { message: 'Please enter your email' }),
  companyName: z.string().min(1, {
    message: 'Please enter your password',
  }),
  address: z.string().min(0),
  fax: z.string(),
  ext: z.string(),
  tax: z.string(),
  type: z.string(),
  phone: z.string(),
  attn: z.string(),
  email: z.string().email({ message: 'Invalid email address' }),
  status: z.string(),
  remark: z.string(),
  country: z.string(),
  district: z.string(),
  subDistrict: z.string(),
  province: z.string(),
  zipcode: z.string(),
  paymentTerm: z.string(),
  currency: z.string(),
  creditHold: z.boolean(),
  creditLimitOrder: z.string(),
  creditLimitItem: z.string(),
  alternatePhone: z.string(),
  phoneExt: z.string(),
  alternateFax: z.string(),
  specialIntruction: z.string(),
  meng: z.string(),
  costmarkup: z.string().min(1),
  paymenTerm: z.string(),
  createAt: z.string(),
  customerBillings: z.array(
    z.object({
      type: z.string(),
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
  branch: '',
  remark: 'new',
}

export function CustomerForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [billings, setBilling] = useState<CustomerBilling[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [editBillings, setEditBilling] = useState<CustomerBilling>(intial)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()
  const [files, setFiles] = useState<File[]>([])

  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)

  let today = new Date()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    //resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Active',
      createAt: format(today, 'yyyy-MM-dd'),
    },
  })

  function newBilling() {
    console.log('updateBilling')
    setEditBilling(intial)
    setOpenModal(true)
  }

  function uploadFile(payload: any) {
    setFiles(payload)
    console.log('File data:', payload)
  }

  function updateBilling(payload: any) {
    console.log('updateBilling', payload)
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    data.customerBillings = billings
    console.log('create data', data)
    const response: any = await createCustomer(data)
    console.log('create customer -success', response)

    if (response.status == 200) {
      if (response.data.id > 0) {
        console.log('create customer -success', response)
  
        //data.files = files
        if (files?.length > 0) {
         
          const formData = new FormData()
          for (let i = 0; i < files?.length; i++) {
            formData.append('files', files[i])
            formData.append('customerId', response.data.id)
          }
  
          const res: any = await customerUploadFiles(formData)
          if (res.status == 200) {
            console.log('uploadFiles -success', res.status)
          }
        }
        navigate('/master/customer', { replace: true })
      }   
     
    } else {
      setIsLoading(false)
      setBilling([])
    }

    setTimeout(() => {
      setIsLoading(false)
      setBilling([])
    }, 1000)
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

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Customer'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
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
                    <div className='mb-3 grid grid-cols-4 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-4 mb-2  flex items-center'>
                        {/* <IconMap /> */}
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Information.
                        </Label>
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
                        name='tax'
                        render={({ field }) => (
                          <FormItem className='col-span-2 space-y-1'>
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
                        name='meng'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Mang.Free%</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='costmarkup'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Profit Cost Markup</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='creditLimitOrder'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Credit Limit Amount/Order</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='creditLimitItem'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Credit Limit Amount/Item</FormLabel>
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
                        name='type'
                        render={({ field }) => (
                          <FormItem>
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
                      <div className='mt-7'>
                        <FormField
                          control={form.control}
                          name='creditHold'
                          render={({ field }) => (
                            <FormItem className='mt-7 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2.5 shadow'>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className='space-y-1 leading-none'>
                                <FormLabel>Credit Hold</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
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
                          <FormItem className='space-y-1'>
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
                        name='ext'
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
                        name='attn'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Attn</FormLabel>
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
                        name='alternateFax'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Alternate-Fax</FormLabel>
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
                            <FormLabel>Note</FormLabel>
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
                      type='submit'
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
                      <TableHead>Type</TableHead>
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
                      <TableRow key={item.code}>
                        <TableCell>{item.type}</TableCell>
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
                          {item.branch}
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
