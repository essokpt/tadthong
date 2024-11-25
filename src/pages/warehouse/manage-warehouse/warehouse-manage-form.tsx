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
import { useNavigate } from 'react-router-dom'
import { createWarehouse } from '@/services/warehouseApi'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'


interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}


const formSchema = z.object({
  code: z.string().min(1, { message: 'Please enter warehouse code' }),
  name: z.string().min(1, {
    message: 'Please enter warehouse name',
  }),
  address: z.string(),
  description: z.string(),
  fax: z.string(),
  attn: z.string(),
  phone: z.string(),
  ext: z.string(),
  branchId: z.number(),
  status: z.string(),
  remark: z.string(),
})

export function WarehouseManageForm({ className, ...props }: SignUpFormProps) {
  const [branchid, setBranchId] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [notifnotification, setNotification] = useState("")

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      phone: '',
      fax: '',
      attn: '',
      branchId: 0,
      remark: '',
      description: '',
      ext: '',
      status: 'Active',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    data.branchId = branchid
     console.log('createWarehouse data', data)
    const res: any = await createWarehouse(data)
    if (res.status == 400) {
      setIsLoading(false)
      setNotification(res.data)
      console.log('Create error:', res)
    }
    if (res.status == 200) {
      setIsLoading(false)
      setNotification('')
      navigate('/warehouseBranch', { replace: true })
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    const id: any = localStorage.getItem('branchId')
    setBranchId(id)
    // console.log('getWarehouse', branch)
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
       
        <PageHeader
          label='  Create Warehouse By Branch'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                
                  <div className='col-span-3' hidden={!notifnotification}>
                    <Alert variant='destructive' >
                      <ExclamationTriangleIcon className='h-4 w-4' />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{notifnotification}</AlertDescription>
                    </Alert>
                  </div>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-1 col-span-2'>
                        <FormLabel>Warehouse Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* <FormField                    
                    control={form.control}
                    name='branchId'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Branch</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
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
                          <Input {...field} readOnly/>
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
                <div className='col-span-3'>
                  <Button className='mt-2 w-full' loading={isLoading} variant='button'>
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
