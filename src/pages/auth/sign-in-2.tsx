import { Card } from '@/components/ui/card'
import { UserAuthForm } from './components/user-auth-form'
import logo from '@/assets/logo-2.jpg'

export default function SignIn2() {
  return (
    <>
      <div className='container bg-logo bg-no-repeat bg-cover bg-center grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col space-y-2 sm:w-[480px] lg:p-8'>
          {/* <div className='mb-4 flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            <h1 className='text-xl font-medium'>Tadthong</h1> */}
             
          {/* </div> */}
          <Card className='p-6 float-end'>
          <img
            src={logo}
            className='relative m-auto'
            width={120}
            height={60}
            alt='Vite'
          />
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password below                
              </p>
            </div>
            <UserAuthForm />
            {/* <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              By clicking login, you agree to our{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
              .
            </p> */}
          </Card>
        </div>
      </div>
    </>
  )
}
