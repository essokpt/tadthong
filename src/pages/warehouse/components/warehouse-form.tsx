import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { createWarehouse } from '@/services/warehouseApi'
import { getBranch } from '@/services/branchApi'

import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
import { Check, ChevronsUpDown } from 'lucide-react'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}
interface Branch {
  id: string
  branchName: string
}

const formSchema = z.object({
  code: z.string().min(1, { message: 'Please enter your code' }),
  name: z.string().min(1, {
    message: 'Please enter warehouse name',
  }),
  address: z.string(),
  description: z.string(),
  fax: z.string(),
  attn: z.string(),
  phone: z.string(),
  ext: z.string(),
  branchId: z.string(),
  status: z.string(),
})

export function WarehouseForm({ className, ...props }: SignUpFormProps) {
  const [branch, setBranch] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [notifnotification, setNotification] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      address: '',
      phone: '',
      fax: '',
      attn: '',
      branchId: '',
      status: 'Active',
      ext: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const index = branch.find((item) => item.branchName == data.branchId)
    if (index) {
      data.branchId = index.id
      // console.log('createWarehouse -success', data)
      const res: any = await createWarehouse(data)
      if (res.status == 400) {
        setIsLoading(false)
        setNotification(res.data)
        console.log('Create error:', res)
      }
      if (res.status == 200) {
        setIsLoading(false)
        setNotification('')
        navigate('/warehouse', { replace: true })
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    getBranch().then((data) => setBranch(data))
    console.log('getWarehouse', branch)
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Warehouse'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <div className='col-span-3' hidden={!notifnotification}>
                    <Alert variant='destructive'>
                      <ExclamationTriangleIcon className='h-4 w-4' />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{notifnotification}</AlertDescription>
                    </Alert>
                  </div>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Warehouse Name</FormLabel>
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
                    name='branchId'
                    render={({ field }) => (
                      <FormItem className='grid space-y-3'>
                        <FormLabel>Branch</FormLabel>
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
                                  ? branch.find(
                                      (item) => item.branchName === field.value
                                    )?.branchName
                                  : 'Select branch'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search branch...' />
                              <CommandList>
                                <CommandEmpty>No role found.</CommandEmpty>
                                <CommandGroup>
                                  {branch.map((item) => (
                                    <CommandItem
                                      value={item.branchName}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'branchId',
                                          item.branchName
                                        )
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.branchName === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {item.branchName}
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
                    name='branchId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Branch</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {branch.map((item) => (
                              <SelectItem key={item.id} value={item.branchName}>
                                {item.branchName}
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
                  <FormField
                    control={form.control}
                    name='attn'
                    render={({ field }) => (
                      <FormItem className='col-span-2 space-y-1'>
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
                        <FormLabel>Ext</FormLabel>
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
                <div className='col-span-3'>
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
