import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'
import { columns } from './priceTable/columns'
import { VenderType } from '../../vender/components/type'
import { ExclamationTriangleIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { getCustomer } from '@/services/customerApi'
import { createPrice } from '@/services/priceApi'
import { Price } from './schema'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PriceDataTable } from './priceTable/priceDataTable'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import InputCurrency from '@/components/custom/inputCurrency'
// import { PriceList } from './priceTable/schema'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Price
}

const formSchema = z.object({
  selectedCustomer: z.string(),
  itemMasterId: z.string(),
  price: z.number().min(1),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [alert, setAlert] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [onloading, setOnloading] = useState(false)
  const [venders, setVender] = useState<VenderType[]>([])
  // const [priceData, setPriceData] = useState<PriceList[]>(data.priceMaster)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemMasterId: '1',
    },
    mode: 'onChange',
  })

  async function updateData(payload: z.infer<typeof formSchema>) {
    setOnloading(true)
    setAlert('')
    console.log('updateData', payload)
    const customer: any = venders.find(
      (x) => x.companyName == payload.selectedCustomer
    )

    if (customer.id) {
      const datas = {
        customersId: customer.id,
        itemMasterId: data.id,
        price: payload.price,
      }

      console.log('updateData', datas)
      const respone: any = await createPrice(datas)
      if (respone.status == 400) {
        setOnloading(false)
        setAlert(respone.data)
        console.log('Create error:', respone)
      }

      if (respone.id) {
        console.log('create price success', respone)
        data.priceMaster.push(respone)
        form.reset()
      }
      setTimeout(() => {
        setOnloading(false)
      }, 1000)
    }
  }

  const getDataPrice = () => {
    console.log('Get Customers price data')
    //setPriceData(data.priceMaster)
  }

  useEffect(() => {
    setIsMounted(true)
    getCustomer().then((data) => setVender(data))
    getDataPrice()
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen h-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Price Master</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Tabs defaultValue='general' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='general'>Item Information</TabsTrigger>
                <TabsTrigger value='materiallist'>
                  Customer Price List
                </TabsTrigger>
              </TabsList>
              <TabsContent value='general'>
                <Card>
                  <CardContent className='h-[30rem] space-y-2'>
                    <div className='grid grid-cols-2 gap-2 '>
                      <div className='grid '>
                        <Label
                          className='py-1 text-[0.8rem] text-muted-foreground'
                          htmlFor='name'
                        >
                          Item Code
                        </Label>
                        <Input
                          readOnly
                          className='text-[0.8rem]'
                          defaultValue={data.code}
                        />
                      </div>
                      <div className='grid '>
                        <Label
                          className='py-1 text-[0.8rem] text-muted-foreground'
                          htmlFor='name'
                        >
                          Item Name
                        </Label>
                        <Input
                          readOnly
                          className='text-[0.8rem]'
                          defaultValue={data.name}
                        />
                      </div>

                      <div className='col-span-2 grid'>
                        <Label
                          className='py-1 text-[0.8rem] text-muted-foreground'
                          htmlFor='description'
                        >
                          Item Description
                        </Label>
                        <Input
                          readOnly
                          className='text-[0.8rem]'
                          defaultValue={data.description}
                        />
                      </div>
                      <div className='grid'>
                        <Label
                          className='py-1 text-[0.8rem] text-muted-foreground'
                          htmlFor='name'
                        >
                          Stocking-UOM
                        </Label>
                        <Input
                          readOnly
                          className='text-[0.8rem]'
                          defaultValue={data.stockingUom}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='materiallist'>
                <Card>
                  <CardContent className='h-[30rem] space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateData)}>
                          <div hidden={!alert}>
                            <Alert variant='destructive'>
                              <ExclamationTriangleIcon className='h-4 w-4' />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{alert}</AlertDescription>
                            </Alert>
                          </div>
                          <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                            <FormField
                              control={form.control}
                              name='selectedCustomer'
                              render={({ field }) => (
                                <FormItem className='mt-2 grid space-y-1.5'>
                                  <FormLabel>Customer</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant='outline'
                                          role='combobox'
                                          className={cn(
                                            'w-[200px] justify-between',
                                            !field.value &&
                                              'text-muted-foreground'
                                          )}
                                        >
                                          {field.value
                                            ? venders.find(
                                                (item) =>
                                                  item.companyName ===
                                                  field.value
                                              )?.companyName
                                            : 'Select customer'}
                                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-[200px] p-0'>
                                      <Command>
                                        <CommandInput placeholder='Search customer...' />
                                        <CommandList>
                                          <CommandEmpty>
                                            No customer found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {venders.map((item) => (
                                              <CommandItem
                                                value={item.companyName}
                                                key={item.id}
                                                onSelect={() => {
                                                  form.setValue(
                                                    'selectedCustomer',
                                                    item.companyName
                                                  )
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    'mr-2 h-4 w-4',
                                                    item.companyName ===
                                                      field.value
                                                      ? 'opacity-100'
                                                      : 'opacity-0'
                                                  )}
                                                />
                                                {item.companyName}
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

                            {/* <FormField
                              control={form.control}
                              name='selectedCustomer'
                              render={({ field }) => (
                                <FormItem className='w-[25rem] space-y-1'>
                                  <FormLabel>Customer</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder='Select Customer' />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {venders.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={item.code}
                                        >
                                          {item.companyName}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /> */}
                            <InputCurrency
                              value={0}
                              label='Price(Baht)'
                              name='price'
                              placeholder={'input price'}
                            />
                            {/* <FormField
                              control={form.control}
                              name='price'
                              render={({ field }) => (
                                <FormItem className='space-y-1'>
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <Input
                                      type='number'
                                      {...field}
                                      onChange={(event) =>
                                        field.onChange(
                                          parseFloat(event.target.value)
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /> */}

                            <Button
                              loading={onloading}
                              variant='button'
                              size='sm'
                              type='submit'
                              className='float-end mt-8  h-8'
                            >
                              <PlusCircledIcon className='mr-2 h-4 w-4' />
                              New
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                    <hr></hr>

                    <PriceDataTable data={data.priceMaster} columns={columns} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <br />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
