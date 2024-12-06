import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  createCustomerBilling,
  deleteCustomerBilling,
  updateCustomer,
  updateCustomerBilling,
} from '@/services/customerApi'
// import { customerSchema } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Customer } from './schema'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircleIcon } from 'lucide-react'
import { BillingModal } from './billing-modal'
import { CustomerBilling } from './billing-schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { AlertModal } from '@/components/custom/alert-modal'
import { cn } from '@/lib/utils'
import { ThaiAddress } from 'types/thaiaddress'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
// import { CaretSortIcon } from '@radix-ui/react-icons'
// import { cn } from '@/lib/utils'
// import useThaiAddress from '@/hooks/use-thaiAddress'
// import useDebounce from '@/hooks/use-debounce'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  data: Customer
  editble: boolean
}
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

const intial = {
  id: 0,
  code: '',
  name: '',
  type: '',
  address: '',
  district: '',
  subDistrict: '',
  province: '',
  zipcode: '',
  country: '',
  phone: '',
  email: '',
  contactName: '',
  latitude: '',
  longtitude: '',
  branch: '',
  remark: '',
}

export const EditModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  data,
  editble,
}) => {
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register, setValue } = useForm()
  const [credithold, setCreditHold] = useState(false)
  const [onloading, setOnloading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editBillings, setEditBilling] = useState<CustomerBilling>(intial)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()

  const { setRefresh } = useContext(ApiContext) as ApiType
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 500)

  function updateBilling(payload: any) {
    console.log('updateBilling', payload)

    setEditBilling(payload)
    setOpenModal(true)
  }

  function newBilling() {
    setEditBilling(intial)
    setOpenModal(true)
  }

  function deleteBilling(payload: any) {
    setDeleteId(payload.id)
    setdeleteTitle(payload.code)
    setOpenDeleteModal(true)
  }

  async function confirmDeleteBilling() {
    setIsLoading(true)
    const res: any = await deleteCustomerBilling(deleteId)
    if (res.status == 200) {
      console.log(res.data)
      const newBill = data.customerBillings.filter((x) => x.id != deleteId)
      data.customerBillings = newBill
    } else {
      console.log('update new address error', res)
    }
    setIsLoading(false)
    setDeleteId(null)
    setdeleteTitle(null)
    setOpenDeleteModal(false)
  }

  async function addNewBilling(payload: any) {
    setIsLoading(true)
    console.log('addNew billing address', payload)

    if (payload.id) {
      console.log('update address', payload)
      const res: any = await updateCustomerBilling(payload)
      if (res.status == 200) {
        console.log(res.data)
        let updateIndex = data.customerBillings.findIndex(
          (x) => x.id == payload.id
        )
        if (updateIndex != -1) {
          data.customerBillings[updateIndex] = payload
        }
      } else {
        console.log('update new address error')
      }
    } else {
      payload.customerId = data.id
      console.log('new address', payload)
      const res: any = await createCustomerBilling(payload)
      if (res.status == 200) {
        console.log('create new address success', res)
        payload.id = res.data.id
        data.customerBillings.push(payload)
      } else {
        console.log('create new address error')
      }
    }
    setTimeout(() => {
      setIsLoading(false)
      setOpenModal(false)
    }, 2000)
  }

  function handleCheck(e: ChangeEvent<HTMLInputElement>) {
    setCreditHold(e.target.checked)
    console.log('handleCheck', data)
  }

  async function updateData(data: any) {
    setOnloading(true)
    data.creditHold = credithold
    console.log('updateCustomer', data)

    const res: any = await updateCustomer(data)
    if (res.status == 200) {
      console.log('update Customer', res)
    }
    setTimeout(() => {
      setOnloading(false)
      onClose()
      setRefresh(true)
    }, 1000)
  }

  function onSelectResult(e: any) {
    if (dataValue) {
      const index = addressThai?.find((a) => a.id == e.target.value)
      console.log('onSelectResult', index)
      setValue('district', index?.districtThai)
      setValue('subDistrict', index?.tambonThai)
      setValue('province', index?.provinceThai)
      setValue('zipcode', index?.postCode)
      setValue('country', 'ประเทศไทย')

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
    setIsLoading(false)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen max-h-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid gap-4'>
            <Tabs defaultValue='information' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='information'>
                  General Information
                </TabsTrigger>
                <TabsTrigger value='account'>Billing</TabsTrigger>
              </TabsList>
              <TabsContent value='information' className='h-full'>
                <form onSubmit={handleSubmit(updateData)}>
                  {/* <div className='grid grid-cols-4 gap-2 '> */}
                  <div className='mb-3 grid grid-cols-4 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-4 mb-2  flex items-center'>
                      {/* <IconMap /> */}
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Information.
                      </Label>
                    </div>
                    <Input
                      readOnly={editble}
                      className='hidden'
                      {...register('id')}
                      defaultValue={data.id}
                    />
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='code'
                      >
                        Code
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('code')}
                        defaultValue={data.code}
                      />
                    </div>

                    <div className='col-span-3 grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='code'
                      >
                        Company Name
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('companyName')}
                        defaultValue={data.companyName}
                      />
                    </div>
                    <div className='col-span-2 grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='tax'
                      >
                        Tax ID
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('tax')}
                        defaultValue={data.tax}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='specialIntruction'
                      >
                        Special Intruction
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('specialIntruction')}
                        defaultValue={data.specialIntruction}
                      />
                    </div>
                    <div>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='meng'
                      >
                        Mang.Free%
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('meng')}
                        defaultValue={data.meng}
                      />
                    </div>

                    <div>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='costmarkup'
                      >
                        Profit Cost markup
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('costmarkup')}
                        defaultValue={data.costmarkup}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='creditLimitOrder'
                      >
                        Credit Limit Amount/Order
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('creditLimitOrder')}
                        defaultValue={data.creditLimitOrder}
                      />
                    </div>
                    <div>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='creditLimitItem'
                      >
                        Credit Limit Amount/Item
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('creditLimitItem')}
                        defaultValue={data.creditLimitItem}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='currency'
                      >
                        Currency
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('currency')}
                        defaultValue={data.currency}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='paymentTerm'
                      >
                        Payment Term
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('paymentTerm')}
                        defaultValue={data.paymentTerm}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='type'
                      >
                        Payment Type
                      </Label>
                      <select
                        {...register('type')}
                        defaultValue={data.type}
                        // id={item.id}
                        // onChange={handleChangeBranch}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value={data.type}
                        >
                          {data.type}
                        </option>

                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value='Cash'
                        >
                          Cash
                        </option>
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value='Credit'
                        >
                          Credit
                        </option>
                      </select>
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='status'
                      >
                        Status
                      </Label>
                      <select
                        {...register('status')}
                        defaultValue={data.status}
                        // id={item.id}
                        // onChange={handleChangeBranch}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        {/* <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value={data.status}
                        >
                          {data.status}
                        </option> */}

                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value='Active'
                        >
                          Active
                        </option>
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value='Inactive'
                        >
                          Inactive
                        </option>
                      </select>
                    </div>
                    <div className='grid py-[25px]'>
                      <div className='rounded-md border border-input py-1.5'>
                        <input
                          className='ml-3'
                          type='checkbox'
                          onChange={handleCheck}
                          defaultChecked={data.creditHold}
                        />

                        <Label
                          className='ml-3 space-y-2 text-[0.8rem] text-muted-foreground'
                          htmlFor='status'
                        >
                          Credit Hold
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-3 mb-2  flex items-center'>
                      {/* <IconMap /> */}
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Address.
                      </Label>
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='address'
                      >
                        Address
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('address')}
                        defaultValue={data.address}
                      />
                    </div>

                    <div className='relative mt-2 '>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='district'
                      >
                        Sub-District
                      </Label>
                      <div className='flex items-center  px-3 '>
                        <MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 border-separate opacity-50' />

                        <Input
                          readOnly={editble}
                          className='mt-1 text-[0.8rem]'
                          onClick={() => setOpen(false)}
                          {...register('subDistrict')}
                          defaultValue={data.subDistrict}
                          onChange={debounceValue}
                        ></Input>
                      </div>
                      <SearchAddress dataValue={dataValue} />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='district'
                      >
                        District
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('district')}
                        defaultValue={data.district}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='province'
                      >
                        Province
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('province')}
                        defaultValue={data.province}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='zipcode'
                      >
                        Zipcode
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('zipcode')}
                        defaultValue={data.zipcode}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='country'
                      >
                        Country
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('country')}
                        defaultValue={data.country}
                      />
                    </div>
                  </div>

                  <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-3 mb-2  flex items-center'>
                      {/* <IconMap /> */}
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Contact.
                      </Label>
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='phone'
                      >
                        Phone
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('phone')}
                        defaultValue={data.phone}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='fax'
                      >
                        Fax
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('fax')}
                        defaultValue={data.fax}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='faxExt'
                      >
                        Fax-Ext
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('ext')}
                        defaultValue={data.ext}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='attn'
                      >
                        Attn
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('attn')}
                        defaultValue={data.attn}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='email'
                      >
                        Email
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('email')}
                        defaultValue={data.email}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='alternatePhone'
                      >
                        Alternate Phone
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('alternatePhone')}
                        defaultValue={data.alternatePhone}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='phoneExt'
                      >
                        Phone-Ext
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('phoneExt')}
                        defaultValue={data.phoneExt}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='alternateFax'
                      >
                        Alternate Fax
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('alternateFax')}
                        defaultValue={data.alternateFax}
                      />
                    </div>

                    <div className='col-span-3 grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='remark'
                      >
                        Note
                      </Label>
                      <Input
                        readOnly={editble}
                        className='text-[0.8rem]'
                        {...register('remark')}
                        defaultValue={data.remark}
                      />
                    </div>
                  </div>

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
              </TabsContent>
              <TabsContent value='account' className='h-screen'>
                <Card className='min-h-full'>
                  <CardContent className='h-[35rem] space-y-2'>
                    <div className='grid gap-4'>
                      <Table className='w-full overflow-auto'>
                        <TableCaption>
                          A list of your recent permission.
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead className='w-[20rem]'>Name</TableHead>
                            <TableHead className='w-[20rem]'>Address</TableHead>
                            <TableHead className='w-[20rem]'>
                              District
                            </TableHead>
                            <TableHead className='w-[20rem]'>
                              Sub-District
                            </TableHead>
                            <TableHead className='w-[15rem]'>
                              Province
                            </TableHead>
                            <TableHead>Postcode</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.customerBillings?.map((item) => (
                            <TableRow key={item.code}>
                              <TableCell>{item.type}</TableCell>
                              <TableCell className='text-left'>
                                {item.code}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.name}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.address}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.district}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.subDistrict}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.province}
                              </TableCell>

                              <TableCell className='text-left'>
                                {item.zipcode}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.zipcode}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.branch}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.contactName}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.phone}
                              </TableCell>
                              <TableCell className='text-left'>
                                {item.email}
                              </TableCell>

                              <TableCell>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() => updateBilling(item)}
                                >
                                  <IconEdit size={20} />
                                </Button>

                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() => deleteBilling(item)}
                                >
                                  <IconTrash size={20} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell>
                              <Button
                              disabled={editble}
                                variant='button'
                                size='sm'
                                className='w-13 h-8'
                                onClick={newBilling}
                              >
                                <PlusCircleIcon className='mr-2 h-4 w-4' />
                                Add Billng
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
        <BillingModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          loading={isLoading}
          createData={(e) => addNewBilling(e)}
          editData={editBillings}
        />

        <AlertModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={confirmDeleteBilling}
          loading={isLoading}
          title={deleteTitle}
        />
      </Dialog>
    </>
  )
}
