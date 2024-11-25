import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Card, CardContent } from '@/components/ui/card'
import { User } from './schema'
import { Loading } from '@/components/custom/loading'
import { getUserProfile, updateUser, uploadUserImage } from '@/services/userApi'
import { PasswordInput } from '@/components/custom/password-input'
import {
  IconLogin,
  IconMap,
  IconUser,
  IconUserSquare,
} from '@tabler/icons-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
//import { zodResolver } from '@hookform/resolvers/zod'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { PageHeader } from '@/components/layouts/header'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { ThaiAddress } from 'types/thaiaddress'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}
const initalUser = {
  id: '',
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
  email: '',
  userId: '',
  employeeId: '',
  province: '',
  zipcode: '',
  country: '',
  idCard: '',
  dateOfBirth: '',
  dateOfHire: '',
  division: '',
  status: '',
  username: '',
  password: '',
  userImage: '',
  subDistrict: '',
  district: '',
}

const formSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  userId: z.string(),
  employeeId: z.string(),
  subDistrict: z.string(),
  district: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country: z.string(),
  idCard: z.string(),
  dateOfBirth: z.string(),
  dateOfHire: z.string(),
  division: z.string(),
  status: z.string(),
  username: z.string(),
  password: z.string(),
  userImage: z.string(),
})
export default function UserProfile() {
  const [data, setData] = useState<User>(initalUser)
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [logoFile, setLogoFile] = useState('')
  const [onloading, setOnloading] = useState(false)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)

  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    values: data,
  })
  async function updateData(payload: any) {
    setOnloading(true)
    console.log('updateData', payload)

    const res: any = await updateUser(payload)
    setOnloading(false)
    if (res.status == 200) {
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        formData.append('userId', data.id)
        console.log('update', logoFile)

        const response: any = await uploadUserImage(formData)
        if (response.status == 200) {
          console.log('uploadUserImage -success', response.status)
          setTimeout(() => {
            setOnloading(false)
            setRefresh(true)
          }, 1000)
        }
      }
      setTimeout(() => {
        setOnloading(false)
        setRefresh(true)
      }, 1000)
    }
  }

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    if (files.length) {
      setLogoFile(files[0])
      console.log('handle file', logoFile)
    }
  }

  const getData = (id: any) => {
    setTimeout(() => {
      //setData(initalUser)
    }, 1000)
    console.log('Get user profile')
    getUserProfile(id).then((data) => setData(data))
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
    setIsMounted(true)
    const userId = localStorage.getItem('userId')
    getData(userId)
  }, [refresh])

  if (!isMounted) {
    return null
  }

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Profile'
          icon={<IconUser size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {data.id && data.userImage ? (
            <div className='grid gap-4'>
              <Card>
                <CardContent className='h-full space-y-2'>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateData)}>
                      <div className='grid grid-cols-3 gap-2 '>
                        <FormField
                          control={form.control}
                          name='id'
                          render={({ field }) => (
                            <FormItem className='hidden space-y-1'>
                              <FormLabel>Id</FormLabel>
                              <FormControl>
                                <Input {...field} className='hidden' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='userId'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>User Id</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='employeeId'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Employee Id</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className='row-span-4 mt-2 grid justify-items-center rounded-md border p-1'>
                          {data.userImage ? (
                            <img
                              src={`data:image/jpeg;base64,${data.userImage}`}
                              className='relative mb-2'
                              width={180}
                              height={70}
                              alt='Vite'
                            />
                          ) : (
                            <IconUserSquare size={150} />
                          )}

                          <div className='grid w-52 max-w-sm items-center gap-1.5'>
                            <input type='file' onChange={handleImport} />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name='firstName'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
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
                            <FormItem className='space-y-1 '>
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
                            <FormItem className='space-y-1 '>
                              <FormLabel>ID.Card</FormLabel>
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
                            <FormItem className='space-y-1 '>
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
                          name='dateOfBirth'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Date Of Birth</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='dateOfHire'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Date Of Hire</FormLabel>
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
                      </div>
                      <div className='mb-3 mt-2 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                        <div className='col-span-2 mb-2  flex items-center'>
                          <IconMap />
                          <Label htmlFor='terms' className='ml-3 text-lg'>
                            Address/Contact
                          </Label>
                        </div>
                        <FormField
                          control={form.control}
                          name='address'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className='relative mt-2 '>
                          <Label className='py-1 text-[0.9rem]' htmlFor='district'>
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
                            <FormItem className='space-y-1 '>
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
                            <FormItem className='space-y-1 '>
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
                            <FormItem className='space-y-1 '>
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
                            <FormItem className='space-y-1 '>
                              <FormLabel>Phone Number</FormLabel>
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
                            User Account
                          </Label>
                        </div>

                        <FormField
                          control={form.control}
                          name='username'
                          render={({ field }) => (
                            <FormItem className='space-y-1 '>
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
                            <FormItem className='space-y-1 '>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <PasswordInput
                                  placeholder='********'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='grid'>
                        <Button
                          className='float-end mt-5'
                          loading={onloading}
                          type='submit'
                        >
                          Save changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <br />
            </div>
          ) : (
            <Loading timeout={10000} />
          )}
        </div>
      </LayoutBody>
    </Layout>
  )
}
