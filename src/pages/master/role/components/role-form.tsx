import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  createRole,
  getPermissions,
  updateRoleWithPermissions,
} from '@/services/roleApi'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Permission } from '../../../../../types/permission'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'
//import { Role } from './schema'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'Please enter your email' }),
  description: z.string().min(1, {
    message: 'Please enter your password',
  }),
  status: z.string(),
  permission: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  // .refine((value) => value.some((item) => item), {
  //   message: 'You have to select at least one item.',
  // }),
})

export function RoleForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newPermissions, setNewPermissions] = useState<Permission[]>([])
  const [notifnotification, setNotification] = useState("")
  const [options, setOptions] = useState<Permission[]>([])

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      name: '',
      description: '',
      status: 'Active',
      permission: [],
    },
  })

  useEffect(() => {
    getPermissions().then((data) => setOptions(data))
  }, [])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    data.permission = []

    console.log('create role data:', data)

    const respone = await createRole(data)
    console.log('create role res:', respone)
    if (respone.status == 400) {
      setIsLoading(false)
      setNotification(respone.data)
      console.log('Create error:', respone)
    }
    if (respone.id) {
      data.id = respone.id
      data.permission = newPermissions

      console.log('update role data:', data)
      // updatePermission = newPermissions

      const resUpdate: any = await updateRoleWithPermissions(data)
     
      if (resUpdate.status == 200) {
        setIsLoading(false)
        console.log('update role with permisstion success.')
        navigate('/master/role', { replace: true })
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  function onCheck(e: any) {
    const selected = newPermissions.findIndex((item) => item.id == e.id)
    if (selected == 1) {
      console.log('delete old check:', selected)
      const newArray = [
        ...newPermissions.slice(0, selected),
        ...newPermissions.slice(selected + 1),
      ]
      setNewPermissions(newArray)
      newPermissions.slice(0, selected)
    } else {
      console.log('push old check:', selected)
      newPermissions.push(e)
    }
    console.log('new', newPermissions)
  }

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
                 
        <PageHeader
          label='Create Role'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
              <div hidden={!notifnotification}>
                  <Alert variant='destructive'>
                    <ExclamationTriangleIcon className='h-4 w-4' />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      { notifnotification }
                    </AlertDescription>
                  </Alert>
                </div>
                <div className='grid grid-cols-3 gap-2 '>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Role Name</FormLabel>
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
                        <FormLabel>Remark</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <br />
                <Separator />
                <div className='mb-2 grid items-center justify-between space-y-2'>
                  <div>
                    <h2 className='text-xl font-bold tracking-tight'>
                      Permissions
                    </h2>
                    <p className='text-muted-foreground'>
                      Select the permissions you want to access.
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-2 '>
                  {options.map((item) => (
                    <div
                      key={item.id}
                      className='flex flex-row items-start space-x-3 space-y-1'
                    >
                      {/* <input type='checkbox' onClick={() => onCheck(item)} /> */}
                      <Checkbox className='mt-1' onCheckedChange={() => onCheck(item)} />
                      <Label className='mb-5 font-normal'>{item.description}</Label>
                    </div>
                  ))}
                </div>

                <br />
                <Button className='mt-2 w-full' loading={isLoading} variant='button'>
                  Create
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
