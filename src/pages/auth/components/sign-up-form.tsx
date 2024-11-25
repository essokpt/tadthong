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
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '@/services/authApi'
import { toast } from '@/components/ui/use-toast'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z
  .object({
    // email: z
    //   .string()
    //   .min(1, { message: 'Please enter your email' })
    //   .email({ message: 'Invalid email address' }),
    verifyCode: z.string().min(1, { message: 'Please enter your verifycode' }),    
    newPassword: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      }),
     
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verifyCode: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  function showStatus() {
    toast({
      variant: "destructive",
      title: "Reset password error!",
      description: 'Plase check your verify code again.',
    })
  }


  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log(data)

    const res: any = await resetPassword(data)
    console.log('status', res)
    if (res.status == 200) {  
      console.log('forgotpassword success')
      setIsLoading(false)
      navigate('/login', { replace: true })
    }else{
      showStatus()
      console.log('verify code error.')
      setIsLoading(false)
    }


    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='verifyCode'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Verifycode</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Reset Password
            </Button>
{/* 
            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div> */}

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
