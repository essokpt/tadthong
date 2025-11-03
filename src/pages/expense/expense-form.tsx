/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLAttributes, useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { formatDate } from 'date-fns'

// import { Form } from '@/components/ui/form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'

import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  IconChecklist,
  IconDeviceFloppy,
  IconPencilPlus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { PageHeader } from '@/components/layouts/header'
//import { z } from 'zod'
//import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import { ExpenseInterface } from './type'
import { createExpense } from '@/services/expenseApi'
import { ExpenseModal } from './components/create-modal'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

// const formSchema = z.object({
//   actualDate: z.string(),
//   expenseMonth: z.string(),
//   expenseTypeName: z.string(),
//   expenseTypeId: z.number(),
//   value: z.number(),
//   remark: z.string(),
//   createAt: z.string(),
// })

export function ExpenseForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [count, setCount] = useState(1)

  const [openExpenseModel, setOpenExpenseModel] = useState(false)
  // const [expense, setexpense] = useState<Warehouse[]>([])

  const [expenseList, setExpenseList] = useState<ExpenseInterface[]>([])

  //const { handleSubmit, register } = useForm()

  //const today = new Date()

  const navigate = useNavigate()

  // const form = useForm<z.infer<typeof formSchema>>({
  //   //resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     createAt: formatDate(today, 'yyyy-MM-dd'),

  //     remark: '',
  //   },
  // })

  function addNewData(payload: any) {
    console.log('add Newdata to form', payload)
    payload.id = count
    setExpenseList((prevItems) => [
      ...prevItems,
      {
        ...payload,
      },
    ])

    setCount((prev) => prev + 1)
  }

  async function onSubmit() {
    // setIsLoading(true)

    console.log('create expense', expenseList)

    if (expenseList.length > 0) {
      const respone: any = await createExpense(expenseList)
      console.log('respone', respone)
      if (respone.status == 200) {
        setIsLoading(false)
        navigate('/expense', { replace: true })
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {}, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <PageHeader
          label='Create Expense'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Card>
              <CardContent className='m-3 h-[35rem] space-y-2 '>
                {/* <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}> */}
                {/* <div className='mb-3  grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                      <div className='col-span-2 mb-2  flex items-center'>
                        <IconInfoCircle />
                        <Label htmlFor='terms' className='ml-3 text-lg'>
                          General Information.
                        </Label>
                      </div>

                      <FormField
                        control={form.control}
                        name='createAt'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>Create Date</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='remark'
                        render={({ field }) => (
                          <FormItem className='col-span-2 space-y-1'>
                            <FormLabel>Remark</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div> */}

                <div className='mb-3  grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <div className='mb-2  flex items-center'>
                    <IconChecklist />
                    <Label htmlFor='terms' className='ml-3 text-lg'>
                      New Expense.
                    </Label>
                  </div>

                  <Table>
                    <TableCaption>A list of your recent items.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[7rem]'>Actual Date</TableHead>
                        <TableHead className='w-[15rem]'>Month</TableHead>
                        <TableHead className='w-[9rem]'>Expense Type</TableHead>
                        <TableHead className='w-[9rem]'>Value</TableHead>
                        <TableHead>Remark</TableHead>

                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseList?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className='font-medium'>
                            {item.actualDate}
                          </TableCell>
                          <TableCell>{item.expenseMonth}</TableCell>
                          <TableCell>{item.expenseType?.name}</TableCell>
                          <TableCell>{item.value}</TableCell>
                          <TableCell>{item.remark}</TableCell>

                          <TableCell className='w-[8rem]'>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full'
                              onClick={() =>
                                setExpenseList(
                                  expenseList.filter((a) => a.id != item.id)
                                )
                              }
                            >
                              <IconTrash size={20} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell className='item-center' colSpan={9}>
                          <Badge
                            className='text-white hover:bg-primary'
                            variant={'default'}
                            onClick={() => setOpenExpenseModel(true)}
                          >
                            <IconPlus size={20} />
                            Add Item.
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>

                <Button
                  className='float-end mb-3 gap-3'
                  loading={isLoading}
                  type='submit'
                  variant='button'
                  onClick={onSubmit}
                >
                  <IconDeviceFloppy size={20} />
                  Confirm
                </Button>
                {/* </form>
                </Form> */}
              </CardContent>
            </Card>

            <br />
          </div>
        </div>

        <ExpenseModal
          isOpen={openExpenseModel}
          onClose={() => setOpenExpenseModel(false)}
          createData={(e) => addNewData(e)}
          loading={isLoading}
        />
      </LayoutBody>
    </Layout>
  )
}
