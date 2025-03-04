import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { getBranch } from '@/services/branchApi'
import { getRoles } from '@/services/roleApi'
import { Branches } from '../../branch/components/schema'
import { Role } from '../../role/components/schema'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'

type BranchRole = {
  id: number
  branchId: number
  branchName: string
  roleId: number
  roleName: string
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
  value: BranchRole
}

const formSchema = z.object({
  id: z.number(),
  roleName: z.string().min(1),
  branchName: z.string().min(1),
})

export const CreateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const [onloading, setOnloading] = useState(false)
  // const [itemMaster, setItemMaster] = useState<ItemType[]>([])
  const [branch, setBranch] = useState<Branches[]>([])
  const [roles, setRole] = useState<Role[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: value,
    defaultValues: {
      id: 0,
     
    },
  })

  // async function updateData(data: any) {

  //   console.log('updateData', data)
  //   loading = true
  //   const res: any = await updateBom(data)
  //   loading = false
  //   if (res.status == 200) {
  //     setTimeout(() => {
  //       loading = false
  //       onClose()
  //     }, 1000)
  //   }
  // }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const branchid: any = branch.find(
      (item) => item.branchName == data.branchName
    )
    const roleid: any = roles.find((item) => item.name == data.roleName)

    const newValue = {
      id : data.id,
      branchId: branchid.id,
      branchName: branchid.branchName,
      RoleBranchesId: roleid.id,
      roleName: roleid.name,
    }
    console.log('create role branch', newValue)
    createData(newValue)
    // const res: any = await createBom(data)
    // if (res.status == 200) {
    //   console.log('createVender -success', res.status)
    //   navigate('/master/bom', { replace: true })
    // }

    setTimeout(() => {
      onClose()
    }, 100)
  }

  useEffect(() => {
    setIsMounted(true)
    getBranch().then((data) => setBranch(data))
    getRoles().then((data) => setRole(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>New Role</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-2 '>
                <FormField
                    control={form.control}
                    name='id'
                    render={({ field }) => (
                      <FormItem className='space-y-1 hidden'>
                        <FormLabel>Id</FormLabel>
                        <FormControl>
                          <Input {...field} hidden />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='branchName'
                    render={({ field }) => (
                      <FormItem className='flex w-auto flex-col'>
                        <FormLabel>Branch</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-[350px] justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? branch.find(
                                      (item) => item.branchName === field.value
                                    )?.branchName
                                  : 'Select branch'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search branch...' />
                              <CommandList>
                                <CommandEmpty>No branch found.</CommandEmpty>
                                <CommandGroup>
                                  {branch.map((item) => (
                                    <CommandItem
                                      value={item.branchName}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(
                                          'branchName',
                                          item.branchName
                                        )
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          item.branchName === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {item.branchName}
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

                  <FormField
                    control={form.control}
                    name='roleName'
                    render={({ field }) => (
                      <FormItem className='flex w-auto flex-col'>
                        <FormLabel>Roles</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'w-[350px] justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? roles.find(
                                      (item) => item.name === field.value
                                    )?.name
                                  : 'Select role'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search role...' />
                              <CommandList>
                                <CommandEmpty>No role found.</CommandEmpty>
                                <CommandGroup>
                                  {roles.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('roleName', item.name)
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

                 
                </div>
                <br />
                <DialogFooter>
                  <Button loading={loading} type='submit'>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
