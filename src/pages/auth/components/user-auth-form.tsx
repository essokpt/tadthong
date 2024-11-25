import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SelectItem,
  Select,
  SelectContent,
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
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { auth } from '@/services/authApi'
import { getBranch } from '@/services/branchApi'
import { Branches } from '@/pages/master/branch/components/schema'
import { toast } from '@/components/ui/use-toast'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' }),
  password: z.string().min(1, {
    message: 'Please enter your password',
  }),
  branch: z.string().min(1, { message: 'Please enter branch code' }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  let navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [branches, setBranches] = useState<Branches[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      branch: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const isAuthenticate: any = await auth(data)
    console.log('Res Login ', isAuthenticate)
    if (isAuthenticate) {
      localStorage.setItem('user', isAuthenticate.firstName)
      localStorage.setItem('userId', isAuthenticate.id)
      localStorage.setItem('accessToken', isAuthenticate.token)
      localStorage.setItem('branchId', isAuthenticate.branch.branchId)
      localStorage.setItem('role', isAuthenticate.branch.roleBranches.name)
      localStorage.setItem(
        'permisstions',
        JSON.stringify(isAuthenticate.branch.roleBranches.permission)
      )

      console.log('Login success', isAuthenticate.token)
      setIsLoading(false)
      navigate('/', { replace: true })
    } else {
      //setIsLoading(false)
      showStatus()
      console.log('Login error', isAuthenticate)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  function showStatus() {
    toast({
      variant: "destructive",
      title: "Login error!",
      description: 'Plase check your username password and try again.',
    })
  }


  useEffect(() => {  
    getBranch().then((data) => setBranches(data))
  }, []) 

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input  {...field} />
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
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name='branch'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Input placeholder='Branch-Code' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name='branch'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select your branch' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches?.map((item) => (
                        <SelectItem key={item.id} value={item.branchName}>
                          {item.branchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              {/* <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div> */}
            </div>

            {/* <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGithub className='h-4 w-4' />}
              >
                GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandFacebook className='h-4 w-4' />}
              >
                Facebook
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  )
}
