import { Button } from '@/components/custom/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { columns } from './components/columns'
import { Tabs, TabsContent } from '@/components/ui/tabs'
// import ThemeSwitch from '@/components/layouts/theme-switch'
// import { TopNav } from '@/components/layouts/top-nav'
// import { UserNav } from '@/components/layouts/user-nav'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { DataTable } from './components/dataTable'
import { Overview } from './components/overview'
import { getDashboard } from '@/services/dashboardApi'
import { useEffect, useState } from 'react'
import { Monthly, Product, Summary } from './components/type'

const FormSchema = z.object({
  fromDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  toDate: z.date({
    required_error: 'A date of birth is required.',
  }),
})
export default function Dashboard() {
  const [summary, setSummary] = useState<Summary[]>([])
  const [product, setProduct] = useState<Product[]>([])
  const [monthly, setMonthly] = useState<Monthly[]>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const currentDate = new Date()
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    getData(format(data.fromDate, 'dd-MM-yyyy'), format(data.toDate, 'dd-MM-yyyy'))
  }

  const getData = (fromDate:string, toDate:string) => {
    
    getDashboard(fromDate, toDate).then((data) => {
      setSummary(data.summary)
      setProduct(data.product)
      setMonthly(data.monthly)
      console.log('get dashboard:', data)
    })
  }

  useEffect(() => {
    getData(format(currentDate, 'dd-MM-yyyy'), format(currentDate, 'dd-MM-yyyy'))
  }, [])
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      {/* <LayoutHeader className='m-4 border-2 rounded-md border-primary'>
        <TopNav />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader> */}

      {/* ===== Main ===== */}
      <LayoutBody className='m-4 rounded-md border-2 border-primary'>
        <div className='flex items-center  justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Dashboard
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-4'>
              <div className='grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <FormField
                  control={form.control}
                  name='fromDate'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel className='mr-3'>From Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='toDate'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel className='mr-3'>To Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='py-1'>
                
                <Button  type='submit'>Search</Button>

                </div>
              </div>
            </div>
          </form>
        </Form>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-1'
        >
          {/* <div className='w-full overflow-x-scroll pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div> */}
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Buy Material
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl text-muted-foreground '>
                    {summary[0]?.buyMaterial}
                  </div>
                  <p className='text-2xl font-bold'>
                    {summary[0]?.buyMaterialAmount == null
                      ? 0
                      : summary[0]?.buyMaterialAmount}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl text-muted-foreground '>
                    {summary[0]?.sales}
                  </div>
                  <p className='text-2xl font-bold'>
                    {summary[0]?.salesAmount == null
                      ? 0
                      : summary[0]?.salesAmount}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Buy Material Today
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl text-muted-foreground '>
                    {summary[0]?.buyMaterialToday}
                  </div>
                  <p className='text-2xl font-bold'>
                    {summary[0]?.buyMaterialTodayAmount == null
                      ? 0
                      : summary[0]?.buyMaterialTodayAmount}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Buy Month to Date
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl text-muted-foreground '>
                    {summary[0]?.buyMonthTodate}
                  </div>
                  <p className='text-2xl font-bold'>
                    {summary[0]?.buyMonthTodateAmount == null
                      ? 0
                      : summary[0]?.buyMonthTodateAmount}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Buy Year to Date
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl text-muted-foreground '>
                    {summary[0]?.buyYearToDate}
                  </div>
                  <p className='text-2xl font-bold'>
                    {summary[0]?.buyYearToDateAmount == null
                      ? 0
                      : summary[0]?.buyYearToDateAmount}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview data={monthly} />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Buy Material by Product</CardTitle>
                  {/* <CardDescription>
                    You made 265 sales this month.
                  </CardDescription> */}
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={product}
                    columns={columns}
                    // queryData={(e) => queryData(e)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}
