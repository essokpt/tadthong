import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { CustomerBilling } from './billing-schema'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import { ThaiAddress } from 'types/thaiaddress'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
  editData: CustomerBilling
}

const formSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  type: z.string(),
  address: z.string(),
  district: z.string(),
  subDistrict: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string(),
  contactName: z.string(),
  latitude: z.string().min(0),
  longtitude: z.string().min(0),
  branch: z.string().min(1),
  remark: z.string().min(0),
})

export const BillingModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
  editData,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: editData,
    // defaultValues: {
    //   code: editData?.code ,
    //   name: '',
    //   address: '',
    //   district: '',
    //   subDistrict: '',
    //   province: '',
    //   zipcode: '',
    //   country: '',
    //   phone: '',
    //   email: '',
    //   contactName: '',
    //   latitude: '',
    //   longtitude: '',
    //   branch: '',
    //   branchId: 0,
    // },
  })

  function onSubmit(data: any) {
    console.log('submit', data)
    createData(data)
  }

  function onSelectResult(e: any) {
    if (dataValue) {
      setAddressThai(dataValue)
      const index: any = addressThai?.find((a) => a.id == e.target.value)
      console.log('onSelectResult', index)
      form.setValue('district', index?.districtThai)
      form.setValue('subDistrict', index?.tambonThai)
      form.setValue('province', index?.provinceThai)
      form.setValue('zipcode', index?.postCode)
      form.setValue('country', 'ประเทศไทย')

      setOpen(true)
    }
  }

  const SearchAddress: React.FC<{ dataValue?: ThaiAddress[] }> = ({
    dataValue,
  }) => {
    if (dataValue) {
      setAddressThai(dataValue)
    } else {
      return null
    }

    return (
      <div
        className={cn(
          'absolute float-start w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95 dark:bg-black',
          open ? 'hidden' : 'block'
        )}
      >
        <ul
          className=' max-h-56 w-full overflow-y-auto rounded-lg ring-1 ring-slate-200 '
          onClick={onSelectResult}
        >
          {dataValue?.map(
            ({ id, districtThai, tambonThai, provinceThai, postCode }) => (
              <li
                className='relative flex w-full items-center gap-2 text-[0.8rem] text-black  dark:text-muted-foreground'
                value={id}
                key={id}
              >
                -{tambonThai}-{districtThai}-{provinceThai}-{postCode}
              </li>
            )
          )}
        </ul>
      </div>
    )
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>Billing</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-3 gap-2 '>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='col-span-2 space-y-1'>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='relative'>
                    <Label
                      className='text-[0.8rem] '
                      htmlFor='district'
                    >
                      Sub-District
                    </Label>
                    <div className='flex items-center  px-3 '>
                      <MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 border-separate opacity-50' />

                      <Input
                        {...form.register('subDistrict')}
                        className='mt-1 text-[0.8rem]'
                        onChange={debounceValue}
                        onClick={() => setOpen(false)}
                      ></Input>
                    </div>
                    <SearchAddress dataValue={dataValue} />
                  </div>
                  <FormField
                    control={form.control}
                    name='district'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='province'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='zipcode'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Post code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='branch'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Branch</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='contactName'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='latitude'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='longtitude'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Longtitude</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Address Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a type for address' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value='Billing'>Billing</SelectItem>
                            <SelectItem value='Ship-to'>Ship-to</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <br />
                <DialogFooter>
                  <Button loading={loading} type='submit' variant='button'>
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
