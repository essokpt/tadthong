import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { createBranch } from '@/services/branchApi'
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'
import { IconMap, IconPencilPlus, IconPhone } from '@tabler/icons-react'
import { ThaiAddress } from 'types/thaiaddress'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { PageHeader } from '@/components/layouts/header'
interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  code: z.string().min(1, { message: 'Please enter your email' }),
  branchName: z.string().min(1, {
    message: 'Please enter your password',
  }),
  subDistrict: z.string(),
  district: z.string(),
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
  status: z.string(),
  companyId: z.number(),
  createAt: z.string(),
})

export function BranchForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notifnotification, setNotification] = useState('')
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()

  const navigate = useNavigate()
  let today = new Date()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      branchName: '',
      address: '',
      phone: '',
      fax: '',
      tax: '',
      email: '',
      remark: '',
      companyId: 1,
      createAt: format(today, 'yyyy-MM-dd'),
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    console.log('create branch data', data)
    const res: any = await createBranch(data)

    if (res.status == 400) {
      setIsLoading(false)
      setNotification(res.data)
      console.log('Create error:', res.data)
    }
    if (res.status == 200) {
      console.log('createBranch -success', res.status)
      setIsLoading(false)
      setNotification('')
      navigate('/master/branch', { replace: true })
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
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

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
       
        <PageHeader
          label='Create Branch'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <div className='col-span-3 mb-2  flex items-center'>
                    {/* <IconMap /> */}
                    <Label htmlFor='terms' className='ml-3 text-lg'>
                      Information.
                    </Label>
                  </div>
                  <div className='col-span-3 mb-2' hidden={!notifnotification}>
                    <Alert variant='destructive'>
                      <ExclamationTriangleIcon className='h-4 w-4' />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{notifnotification}</AlertDescription>
                    </Alert>
                  </div>

                  <FormField
                    control={form.control}
                    name='branchName'
                    render={({ field }) => (
                      <FormItem className='col-span-2 space-y-1'>
                        <FormLabel>Branch Name</FormLabel>
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
                  {/* <FormField
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
                  /> */}
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
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a status for active' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='active'>Active</SelectItem>
                            <SelectItem value='inactive'>Inactive</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <br />
                  <div className='col-span-3 mb-2  flex items-center'>
                    <IconMap />
                    <Label htmlFor='terms' className='text-lg'>
                      Address.
                    </Label>
                  </div>
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem className='space-y-1 col-span-3'>
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

                  <br />
                  <br />
                  <div className='col-span-3 mb-2  flex items-center'>
                    <IconPhone />
                    <Label htmlFor='terms' className='text-lg'>
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
                          <Input placeholder='name@example.com' {...field} />
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
                  <div className='col-span-3 grid'>
                    <Button className='mt-2 w-full' loading={isLoading}  variant='button'>
                      Create
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
