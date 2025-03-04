import { HTMLAttributes, SyntheticEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Calendar } from '@/components/ui/calendar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
import {
  createUser,
  updateUserRoleBranch,
  uploadUserImage,
} from '@/services/userApi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircleIcon } from 'lucide-react'
import { CreateModal } from './create-modal'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import {
  IconEdit,
  IconInfoCircle,
  IconLogin,
  IconMap,
  IconPencilPlus,
  IconTrash,
  IconUserSquare,
} from '@tabler/icons-react'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/layouts/header'
import { ThaiAddress } from 'types/thaiaddress'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

type BranchRole = {
  id: number
  branchId: number
  branchName: string
  roleId: number
  roleName: string
  name: string
}

const intial = {
  id: 0,
  branchId: 0,
  branchName: '',
  roleId: 0,
  roleName: '',
  name: '',
}

const formSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1, { message: 'Please enter your email' }),
  lastName: z.string().min(1, {
    message: 'Please enter your password',
  }),
  address: z.string(),
  phoneNumber: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  userId: z.string(),
  employeeId: z.string(),
  subDistrict: z.string(),
  district: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country: z.string(),
  idCard: z.string(),
  birth: z.date(),
  hire: z.date(),
  dateOfBirth: z.string(),
  dateOfHire: z.string(),
  division: z.string(),
  status: z.string(),
  branchesUser: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
})

export function UserForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectRoleBranch, setSelectRoleBranch] = useState<BranchRole[]>([])
  const [image, setImage] = useState('')
  const [editValue, setEditValue] = useState<BranchRole>(intial)
  const [isOpen, setIsOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()

  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      employeeId: Date.now().toString(),
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      email: '',
      district: '',
      subDistrict: '',
      username: '',
      password: '',
      dateOfBirth: '2024-04-20',
      dateOfHire: '2024-04-20',
      branchesUser: [],
      status: 'Active',
      //userRoleBranch: [{ firstname: '1', lastname: '1' }],
    },
  })

  function addNewData(payload: any) {
    if(payload.id > 0 ){
      console.log('edit role', payload);
      
      setSelectRoleBranch(selectRoleBranch.map(artwork => {
        if (artwork.id === payload.id) {
          // Create a *new* object with changes
          return { ...artwork, 
            RoleBranchesId: payload.RoleBranchesId,
            branchId: payload.branchId,
            branchName: payload.branchName,
            roleName: payload.roleName   
          };
        } else {
          // No changes
          return artwork;
        }
      }));
      
    }else{
      payload.id = selectRoleBranch.length + 1
      console.log('addNewData', payload)
      selectRoleBranch.push(payload)
    }
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

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    if (files.length) {
      setImage(files[0])
      console.log('handle file', image)
    }
  }
  const newRoleBranch = () => {
    setEditValue(intial)
    setOpenModal(true)
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
   
    data.dateOfBirth = format(data.birth, 'yyyy-MM-dd')
    data.dateOfHire = format(data.hire, 'yyyy-MM-dd')
    console.log('submit data:', data)
    const respone: any = await createUser(data)
    if (respone.id) {
      data.id = respone.id
      data.branchesUser = selectRoleBranch
      console.log('user permission data:', data)

      const res: any = await updateUserRoleBranch(data)

      console.log('updateUserRoleBranch -success', res.status)

      if (image) {
        const formData = new FormData()
        formData.append('file', image)
        formData.append('userId', respone.id)
        console.log('update', image)

        const response: any = await uploadUserImage(formData)
        if (response.status == 200) {
          console.log('uploadUserImage -success', response.status)
        }
      }
      navigate('/master/user', { replace: true })
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    setSelectRoleBranch([])
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create User'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Tabs defaultValue='information' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='information'>General Information</TabsTrigger>
                <TabsTrigger value='account'>Branch & Role</TabsTrigger>
              </TabsList>
              <TabsContent value='information'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='mb-3 mt-2 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-2 mb-2  flex items-center'>
                        <IconInfoCircle />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Information
                        </Label>
                      </div>
                      <div className='border-red row-span-3 mt-2 items-center'>
                        <IconUserSquare size={150} />

                        <div className='grid w-52 max-w-sm items-center gap-1.5'>
                          <input type='file' onChange={handleImport} />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name='userId'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>User ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='employeeId'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Employee ID</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='idCard'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>I.D.Card</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='division'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Division</FormLabel>
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
                          <FormItem className='space-y-1 '>
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
                        name='birth'
                        render={({ field }) => (
                          <FormItem className='mt-1 flex w-full flex-col'>
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-[240px] pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'yyyy-MM-dd')
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
                      <FormField
                        control={form.control}
                        name='hire'
                        render={({ field }) => (
                          <FormItem className='mt-1 flex w-full flex-col'>
                            <FormLabel>Date of Hire</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-[240px] pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'yyyy-MM-dd')
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
                    </div>
                    <div className='mb-3 mt-2 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-3 mb-2  flex items-center'>
                        <IconMap />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Address/Contact
                        </Label>
                      </div>
                      <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                          <FormItem className='col-span-3 space-y-1 '>
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
                        name='phoneNumber'
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
                        name='email'
                        render={({ field }) => (
                          <FormItem className='space-y-1 '>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='mb-3 mt-2 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-2 mb-2  flex items-center'>
                        <IconLogin />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          Account
                        </Label>
                      </div>

                      <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button className='mt-2 w-full' loading={isLoading} variant='button'>
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
                      <TableHead className='w-[15rem]'>Branch</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectRoleBranch?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className='text-left'>
                          {item.branchName}
                        </TableCell>
                        <TableCell className='text-left'>
                          {item.roleName}
                        </TableCell>

                        <TableCell>
                          <Button
                          size='icon'
                          variant='ghost'
                          className='rounded-full'
                          onClick={() => {
                            setOpenModal(true)
                            console.log(item);
                            
                            setEditValue(item)
                          }}
                        >
                          <IconEdit size={20} />
                        </Button> 
                          <Button
                            size='icon'
                            variant='ghost'
                            className='rounded-full'
                            onClick={() =>
                              setSelectRoleBranch(
                                selectRoleBranch.filter((a) => a.id != item.id)
                              )
                            }
                          >
                            <IconTrash size={20} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  variant='button'
                  size='sm'
                  className='float-end h-8 border '
                  onClick={newRoleBranch}
                >
                  <PlusCircleIcon className='mr-2 h-4 w-4' />
                  Add Role
                </Button>

                {/* </form>
                </Form> */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <CreateModal
          value={editValue}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addNewData(e)}
        />
      </LayoutBody>
    </Layout>
  )
}
