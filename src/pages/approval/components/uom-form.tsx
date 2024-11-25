import { HTMLAttributes, useEffect, useState } from 'react'
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
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
//import { getUom } from '@/services/bomApi'
import { createUom } from '@/services/uomApi'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const itemStatus = [
  { value: 'none', name: 'None' },
  { value: 'active', name: 'Active' },
  { value: 'pending', name: 'Pending' },
  { value: 'inactive', name: 'Inactive' },
]


// interface Uom {
//   id: string
//   code: string
// }

const formSchema = z.object({
  code: z.string().min(1, { message: 'Please enter your email' }),
  description: z.string(),
  status: z.string(),
})

export function UomForm({ className, ...props }: SignUpFormProps) {
 // const [uom, setUom] = useState<Uom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      description: '',
      status: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log('onSubmit', data)

    const res: any = await createUom(data)
    if (res.status == 200) {
      console.log('createUom -success', res.status)
      navigate('/master/uom', { replace: true })
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }

  useEffect(() => {
   // getUom().then((data) => setUom(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Create Uom</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-3 gap-2 '>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {itemStatus.map((item) => (
                              <SelectItem key={item.value} value={item.name}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <br />
                <div>
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
