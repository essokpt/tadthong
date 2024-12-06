import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { LocationType } from './type'
import { updateLocation } from '@/services/locationApi'
import { getWarehouse } from '@/services/warehouseApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { z } from 'zod'
//import { zodResolver } from '@hookform/resolvers/zod'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: LocationType
  editble: boolean
}
interface IWarehouse {
  id: string
  name: string
}

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, {
    message: 'Please enter location name',
  }),
  description: z.string(),
  warehouseId: z.number(),
  warehouse: z.object({
    name: z.string(),
  }),
  status: z.string(),
  remark: z.string(),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  editble,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const { handleSubmit, register } = useForm()
  const [warehouse, setWarehouse] = useState<IWarehouse[]>([])
  const [onloading, setOnloading] = useState(false)

  const { setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    values: data,
    // defaultValues:{
    //   id: data.id,
    //   warehouseId : data.warehouseId
    // }
  })
  async function updateData(payload: any) {
    setOnloading(true)
    // payload.warehouseId = parseInt(payload.warehouseId)
    console.log('updateData', payload)

    const res: any = await updateLocation(payload)
    if (res.status == 200) {
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
    getWarehouse().then((data) => setWarehouse(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen  h-full'>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='h-screen gap-4'>
            {/* <form onSubmit={handleSubmit(updateData)}> */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(updateData)}>
                <div className='mb-3 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <Input
                    className='hidden'
                    {...form.register('id')}
                    defaultValue={data.id}
                  />
                  <Input
                    className='hidden'
                    {...form.register('warehouseId')}
                    defaultValue={data.warehouseId}
                  />

                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={editble} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='warehouse.name'
                    render={({ field }) => (
                      <FormItem className='grid space-y-3'>
                        <FormLabel>Warehouse</FormLabel>
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
                                  ? warehouse.find(
                                      (item) => item.name === field.value
                                    )?.name
                                  : 'Select warehouse'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[200px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search warehouse...' />
                              <CommandList>
                                <CommandEmpty>No warehouse found.</CommandEmpty>
                                <CommandGroup>
                                  {warehouse.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue('warehouse', {
                                          name: item.name,
                                        })
                                        form.setValue(
                                          'warehouseId',
                                          parseInt(item.id)
                                        )
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

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
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
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
