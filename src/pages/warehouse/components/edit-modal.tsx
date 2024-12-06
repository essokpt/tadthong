import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
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
import { updateWarehouse } from '@/services/warehouseApi'
import { BranchType } from '@/pages/master/branch/components/type'
import { getBranch } from '@/services/branchApi'
import { Warehouse } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
//import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Warehouse
  editble: boolean
}

const formSchema = z.object({
  id: z.string(),
  code: z.string().min(1, { message: 'Please enter your code' }),
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
  branch: z.object({
    branchName: z.string(),
  }),
  status: z.string(),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  editble,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const { handleSubmit, register } = useForm()
  const [branches, setBranch] = useState<BranchType[]>([])
  const [onloading, setOnloading] = useState(false)

  const { setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    values: data,
  })

  async function updateData(payload: any) {
    // setOnloading(true)
    console.log('updateData', payload)
    payload.branchId = parseInt(payload.branchId)
    const res: any = await updateWarehouse(payload)
    if (res.status != 200) {
      console.log('update error', res)
    }
    setTimeout(() => {
      setOnloading(false)
      onClose()
      setRefresh(true)
    }, 1000)
  }

  useEffect(() => {
    setIsMounted(true)
    getBranch().then((data) => setBranch(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen  h-full'>
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid h-screen gap-4'>
            {/* <form onSubmit={handleSubmit(updateData)}> */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(updateData)}>
                <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <Input
                    className='hidden'
                    {...form.register('id')}
                    defaultValue={data.id}
                  />
                  <Input
                    className='hidden'
                    {...form.register('branchId')}
                    defaultValue={data.branchId}
                  />
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Warehouse Name</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={editble} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={editble} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='branch.branchName'
                    render={({ field }) => (
                      <FormItem className='grid space-y-3'>
                        <FormLabel>Branch</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={editble}
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? branches.find(
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
                                <CommandEmpty>No role found.</CommandEmpty>
                                <CommandGroup>
                                  {branches.map((item) => (
                                    <CommandItem
                                      value={item.branchName}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('branch', {
                                          branchName: item.branchName,
                                        })
                                        form.setValue('branchId', item.id)
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
                    name='description'
                    render={({ field }) => (
                      <FormItem className='col-span-3 space-y-1'>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={editble} />
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
                          <Input {...field} readOnly={editble} />
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
                          <Input {...field} readOnly={editble} />
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
                          <Input {...field} readOnly={editble} />
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
                          <Input {...field} readOnly={editble} />
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
                          <Input {...field} readOnly={editble} />
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
                          <Input {...field} readOnly={editble} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <br />
                <DialogFooter>
                  <Button
                    disabled={editble}
                    loading={onloading}
                    type='submit'
                    variant='button'
                  >
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
