import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useNavigate } from 'react-router-dom'
import { createSupplier } from '@/services/supplierApi'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  code: z
    .string()
    .min(1, { message: 'Please enter your email' }),   
  name: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
  address: z.string(),
  fax: z.string(),
  tax: z.string(),
  phone: z.string(),
  contactName: z.string(),
  email: z.string()
        .email({ message: 'Invalid email address' }),
  mobile: z.string(),
  remark: z.string(),
})

export function SupplierForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      phone: '',
      fax: '',
      tax: '',
      contactName: '',
      email: '',
      mobile: '',
      remark: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const res:any = await createSupplier(data)
    if(res.status == 200) {
      console.log('createCustomer -success', res.status)     
      navigate('/master/supplier', { replace: true });
    }
   

    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Create Supplier</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid gap-2 grid-cols-2 '>
                  <FormField
                    
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input placeholder='name@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder='name@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder='name@example.com' {...field} />
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
                          <Input placeholder='name@example.com' {...field} />
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
                          <Input placeholder='name@example.com' {...field} />
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
                        <FormLabel>Tax</FormLabel>
                        <FormControl>
                          <Input placeholder='name@example.com' {...field} />
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
                          <Input placeholder='name@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='mobile'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>mobile</FormLabel>
                        <FormControl>
                          <Input placeholder='name@example.com' {...field} />
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
                      <FormItem className='space-y-1'>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Input placeholder='name@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> 
                    <Button className='mt-2 w-full' loading={isLoading}>
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
