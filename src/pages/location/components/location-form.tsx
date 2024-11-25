import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

import { createLocation } from '@/services/locationApi'
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
import { getWarehouse } from '@/services/warehouseApi'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
import { Check, ChevronsUpDown } from 'lucide-react'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

interface ICategory {
  id: string
  name: string
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Please enter location name',
  }),
  description: z.string(),
  warehouseId: z.string().min(1, {
    message: 'Please select warehouse',
  }),
  status: z.string(),
})

export function LocationForm({ className, ...props }: SignUpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      warehouseId: '',
      status: 'Active',
    },
  })
  const [warehouse, setWarehouse] = useState<ICategory[]>([])
  const [notifnotification, setNotification] = useState('')

  useEffect(() => {
    getWarehouse().then((data) => setWarehouse(data))
  }, [])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const index = warehouse.find((item) => item.name == data.warehouseId)
    if (index) {
      data.warehouseId = index.id
      console.log('Create data:', data)
      const res: any = await createLocation(data)
      console.log('Create res:', res)
      if (res.status == 400) {
        setIsLoading(false)
        setNotification(res.data)
        console.log('Create error:', res)
      }
      if (res.status == 200) {
        setIsLoading(false)
        setNotification('')
        console.log('create Location -success', res.status)
        navigate('/location', { replace: true })
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='  Create Location'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-3 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <div hidden={!notifnotification}>
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
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='warehouseId'
                    render={({ field }) => (
                      <FormItem className='grid space-y-3'>
                        <FormLabel>Warehouse</FormLabel>
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
                                  ? warehouse.find(
                                      (item) => item.name === field.value
                                    )?.name
                                  : 'Select warehouse'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search warehouse...' />
                              <CommandList>
                                <CommandEmpty>No warehouse found.</CommandEmpty>
                                <CommandGroup>
                                  {warehouse.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('warehouseId', item.name)
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
                    name='warehouseId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warehouse</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a warehouse' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {warehouse.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
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
                <div className='grid'>
                  <Button
                    className='mt-2 w-full'
                    loading={isLoading}
                    variant='button'
                  >
                    Save
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
