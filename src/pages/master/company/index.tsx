import { Layout, LayoutBody } from '@/components/custom/layout'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
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
import {
  companyDeleteFileAttach,
  companyDownloadFileAttach,
  companyUploadFiles,
  findCompany,
  updateCompany,
  updateCompanyLogo,
} from '@/services/companyApi'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import {
  IconBuildingBank,
  IconDownload,
  IconEye,
  IconFile,
  IconFileInvoice,
  IconHomeInfinity,
  IconMap,
  IconPhone,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react'
import { CompanySchema } from './components/schema'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn, downloadFileData } from '@/lib/utils'
import { AlertModal } from '@/components/custom/alert-modal'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { Loading } from '@/components/custom/loading'
import { ThaiAddress } from 'types/thaiaddress'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { PageHeader } from '@/components/layouts/header'
import usePermission from '@/hooks/use-permission'

const initalData = {
  id: '',
  code: '',
  companyName: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  zipcode: '',
  country: '',
  phone: '',
  fax: '',
  tax: '',
  email: '',
  remark: '',
  ext: '',
  attn: '',
  foundedDate: new Date('1900-01-01'),
  billAddress: '',
  billProvince: '',
  billZipcode: '',
  billCountry: '',
  billDistrict: '',
  billSubDistrict: '',
  logo: '',
  companyFileAttach: [
    {
      id: 0,
      fileName: '',
      path: '',
      expireDate: '',
      remark: '',
    },
  ],
}

const FormSchema = z.object({
  code: z.string().min(1, { message: 'Please enter your email' }),
  companyName: z.string().min(1, {
    message: 'Please enter your password',
  }),
  district: z.string(),
  subDistrict: z.string(),
  province: z.string(),
  zipcode: z.string(),
  phone: z.string(),
  fax: z.string(),
  tax: z.string(),
  address: z.string(),
  country: z.string(),
  ext: z.string(),
  attn: z.string(),
  email: z.string().email({ message: 'Invalid email address' }),
  remark: z.string(),
  foundedDate: z.coerce.date(),
  billAddress: z.string(),
  billDistrict: z.string(),
  billSubDistrict: z.string(),
  billProvince: z.string(),
  billZipcode: z.string(),
  billCountry: z.string(),
  logo: z.string(),
})

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

export default function Company() {
  //const comLogo = "https://localhost:7244/swagger/index.html"
  const [data, setData] = useState<CompanySchema>(initalData)
  const [logoFile, setLogoFile] = useState('')
  const [isLoading, setIsloading] = useState(false)
  const [files, setFiles] = useState('')
  const [open, setOpen] = useState(false)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [deleteId, setdeleteId] = useState(null)
  const [onloading, setOnloading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenBill, setIsOpenBill] = useState(false)
  const [expireDate, setExpireDate] = useState<Date>()
  const [uploadRemark, setUploadRemark] = useState('')

  const { refresh, setRefresh } = useContext(ApiContext) as ApiType
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)

  const { userInputCallback: billCallback, dataValue: billValue } =
    useThaiAddress()
  const debounceValueBill = useDebounce(billCallback, 800)

  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()
  const [billAddressThai, setBillAddressThai] = useState<ThaiAddress[]>()

  const rule: any = usePermission('company')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: data,
  })

  function handleChangeRemark(e: ChangeEvent<HTMLInputElement>) {
    console.log('handleChangeRemark', e.target.value)
    setUploadRemark(e.target.value)
  }

  async function handleUploadFile() {
    if (files && expireDate) {
      console.log('uploadFiles -success', files)
      const formData = new FormData()
      //for (let i = 0; i < files?.length; i++) {
      formData.append('files', files)
      formData.append('companyId', data.id)
      formData.append('remark', uploadRemark)
      formData.append('expireDate', format(expireDate, 'dd-MM-yyyy'))
      // }

      setIsloading(true)
      const res: any = await companyUploadFiles(formData)
      if (res) {
        console.log('uploadFiles -success', res)
        data.companyFileAttach.push(res)
      }
      setTimeout(() => {
        setIsloading(false)
      }, 1000)
    } else {
      console.log('Please select File ')
    }
  }
  async function downloadFile(filename: any) {
    const response: any = await companyDownloadFileAttach(filename)
    downloadFileData(filename, response.data)
  }

  const openFile = (file: any) => {
    window.open(
      `http://tadthongback.c-space.store/files/Company/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  async function deleteFile() {
    setOnloading(true)
    console.log('updateData:', deleteId)

    const res: any = await companyDeleteFileAttach(deleteId)

    if (res.status == 200) {
      const deleteIndex = data.companyFileAttach.findIndex(
        (a) => a.id == deleteId
      )
      if (deleteIndex != -1) {
        data.companyFileAttach.splice(deleteIndex, 1)
      }
    }

    setTimeout(() => {
      setOnloading(false)
      setOpen(false)
    }, 1000)
  }

  function deleteAction(row: any) {
    setOpen(true)
    setdeleteId(row.id)
    setdeleteTitle(row.fileName)
  }

  async function onSubmit(payload: any) {
    setIsloading(true)
    payload.id = data.id
    //payload = files

    const respone: any = await updateCompany(payload)
    console.log('update Data', respone)
    if (respone.id) {
      console.log('update company -success', respone.status)
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        console.log('update', logoFile)
        const response: any = await updateCompanyLogo(formData)
        console.log('update updateCompanyLogo -success', response.status)
      }

      setTimeout(() => {
        showStatus()
        setIsloading(false)
        setRefresh(true)
      }, 1000)
    }
  }

  function showStatus() {
    toast({
      description: 'Update completed!',
    })
  }

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    if (files.length) {
      setLogoFile(files[0])
      console.log('handle file', logoFile)
    }
  }

  const onChangeFileAttach = (event: ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    console.log('onChangeFileAttach', files)
    if (files.length) {
      setFiles(files[0])
      console.log('handle file', logoFile)
    }
  }

  const getData = () => {
    console.log('Get Company data')
    findCompany(1).then((data) => setData(data))
    setRefresh(false)
  }

  function onSelectResult(e: any) {
    if (dataValue) {
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

  function onSelectBillAddress(e: any) {
    if (billValue) {
      const index: any = billAddressThai?.find((a) => a.id == e.target.value)
      console.log('onSelectBillAddress', index)
      form.setValue('billDistrict', index?.districtThai)
      form.setValue('billSubDistrict', index?.tambonThai)
      form.setValue('billProvince', index?.provinceThai)
      form.setValue('billZipcode', index?.postCode)
      form.setValue('billCountry', 'ประเทศไทย')

      setIsOpenBill(true)
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

  const SearchฺBillAddress: React.FC<{ billValue?: ThaiAddress[] }> = ({
    billValue,
  }) => {
    if (billValue) {
      setBillAddressThai(billValue)
    } else {
      return null
    }

    return (
      <div
        className={cn(
          'absolute float-start w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95 dark:bg-black',
          isOpenBill ? 'hidden' : 'block'
        )}
      >
        <ul
          className=' max-h-56 w-full overflow-y-auto rounded-lg ring-1 ring-slate-200 '
          onClick={onSelectBillAddress}
        >
          {billValue?.map(
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
    getData()
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Company'
          icon={<IconBuildingBank size={45} className='mt-2 ' />}
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-1 lg:space-y-0'>
          <Separator className='bg-primary' />
          <br />
          {!data ? (
            <Loading timeout={500} />
          ) : (
            <Tabs defaultValue='information' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='information'>Information</TabsTrigger>
                <TabsTrigger value='files'>File Attachment</TabsTrigger>
              </TabsList>
              <TabsContent value='information' className='h-full'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='mb-2 grid grid-flow-col grid-rows-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        <IconHomeInfinity />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Information.
                        </Label>
                      </div>

                      <FormField
                        control={form.control}
                        name='companyName'
                        render={({ field }) => (
                          <FormItem className='col-span-2 space-y-1'>
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
                          <FormItem className='space-y-1 '>
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
                        name='foundedDate'
                        render={({ field }) => (
                          <FormItem className='flex flex-col space-y-3'>
                            <FormLabel>Founded Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'mt-3 w-[240px] pl-3 text-left font-normal',
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
                                className='w-auto p-0 '
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <FormField
                  control={form.control}
                  name='foundedDate'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Founded Date</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                      <div className='row-span-3 justify-center'>
                        <img
                          src={`data:image/jpeg;base64,${data.logo}`}
                          className='relative mb-2'
                          width={200}
                          height={70}
                          alt='Vite'
                        />
                        <div className='grid w-52 max-w-sm items-center gap-1.5'>
                          <input type='file' onChange={handleImport} />
                          {/* <Input id='picture' type='file' onChange={handleImport}/> */}
                        </div>
                      </div>
                    </div>
                    <div className='mb-3 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-2 mb-2  flex items-center'>
                        <IconMap />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Company Address.
                        </Label>
                      </div>
                      <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                          <FormItem className='col-span-2 space-y-1'>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='relative mt-2 '>
                        <Label className='py-1 ' htmlFor='district'>
                          Sub-District
                        </Label>
                        <div className='flex items-center  px-3 '>
                          <MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 border-separate opacity-50' />

                          <Input
                            className='mt-1 text-[0.8rem]'
                            onClick={() => setIsOpen(false)}
                            {...form.register('subDistrict')}
                            defaultValue={data.subDistrict}
                            onChange={debounceValue}
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
                            <FormLabel>City/Province</FormLabel>
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
                    </div>

                    <div className='mb-3 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-2 mb-2  flex items-center'>
                        <IconFileInvoice />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Bill Address.
                        </Label>
                      </div>
                      <FormField
                        control={form.control}
                        name='billAddress'
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

                      <div className='relative mt-2 '>
                        <Label className='py-1 ' htmlFor='district'>
                          Sub-District
                        </Label>
                        <div className='flex items-center  px-3 '>
                          <MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 border-separate opacity-50' />

                          <Input
                            className='mt-1 text-[0.8rem]'
                            onClick={() => setIsOpenBill(false)}
                            {...form.register('billSubDistrict')}
                            defaultValue={data.billSubDistrict}
                            onChange={debounceValueBill}
                          ></Input>
                        </div>
                        <SearchฺBillAddress billValue={billValue} />
                      </div>

                      <FormField
                        control={form.control}
                        name='billDistrict'
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
                        name='billProvince'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>City/Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='billCountry'
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
                        name='billZipcode'
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
                    </div>
                    <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        <IconPhone />
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
                              <Input
                                placeholder='name@example.com'
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
                          <FormItem className='space-y-1'>
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <br />

                    <Button
                      disabled={!rule[0]?.canUpdate}
                      className='mt-2 w-full'
                      loading={isLoading}
                      variant='button'
                    >
                      Update
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value='files' className='h-screen'>
                <div className='mb-3 grid items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <div className='mb-3 grid grid-cols-3  gap-2 space-x-3 space-y-0 rounded-md border p-4 '>
                    <div className='col-span-3 mb-2 flex  items-center'>
                      <IconFile />
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Attach Files.
                      </Label>
                    </div>

                    <div className='grid w-full  items-center'>
                      <Label className='py-1 text-[0.8rem]' htmlFor='picture'>
                        Select file.
                      </Label>
                      {/* <input type='file' onChange={onChangeFileAttach} /> */}
                      <Input
                        id='picture'
                        type='file'
                        onChange={onChangeFileAttach}
                      />
                    </div>
                    <div className='grid w-full'>
                      <Label className='py-1 text-[0.8rem]' htmlFor='address'>
                        Expire Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !expireDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {expireDate ? (
                              format(expireDate, 'dd-MM-yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={expireDate}
                            onSelect={setExpireDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className='grid w-full items-center'>
                      <Label className='py-1 text-[0.8rem]' htmlFor='picture'>
                        Remark.
                      </Label>
                      {/* <input type='file' onChange={onChangeFileAttach} /> */}
                      <Input
                        id='remark'
                        type='text'
                        onChange={handleChangeRemark}
                      />
                    </div>

                    <div className='align-items-end col-start-3 grid'>
                      <Button
                        className='w-[110px]'
                        variant='button'
                        loading={isLoading}
                        onClick={handleUploadFile}
                      >
                        <IconUpload className='mr-2' />
                        Upload
                      </Button>
                    </div>
                  </div>
                  <hr />
                  <div className='grid items-center'>
                    <Table className='overflow-scroll'>
                      <TableCaption>A list of file attached.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>
                          <TableHead>Expire Date</TableHead>
                          <TableHead>Remark</TableHead>
                          <TableHead className='items-center'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.companyFileAttach?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className='font-medium'>
                              {item.fileName}
                            </TableCell>
                            <TableCell className='font-medium'>
                              {item.expireDate}
                            </TableCell>
                            <TableCell className='font-medium'>
                              {item.remark}
                            </TableCell>
                            <TableCell className='w-[8rem]'>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => downloadFile(item.path)}
                              >
                                <IconDownload size={20} />
                              </Button>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => openFile(item.path)}
                              >
                                <IconEye size={20} />
                              </Button>

                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => deleteAction(item)}
                              >
                                <IconTrash size={20} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={10} className='text-right'>
                            {/* <Button loading={false} >
                            <IconRefresh size={20} />
                            Add
                          </Button> */}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={deleteFile}
          loading={onloading}
          title={deleteTitle}
        />
      </LayoutBody>
    </Layout>
  )
}
