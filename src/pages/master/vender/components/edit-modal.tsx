import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import {
  createVenderBilling,
  deleteVenderBillig,
  getVenderType,
  updateVender,
  updateVenderBilling,
  venderUploadFiles,
} from '@/services/vendersApi'
import { Venders } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { PlusCircleIcon } from 'lucide-react'
import { Billing } from './billing-schema'
import { BillingModal } from './billing-modal'
import { AlertModal } from '@/components/custom/alert-modal'
import { IconDownload, IconEdit, IconEye, IconTrash } from '@tabler/icons-react'

import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { ThaiAddress } from 'types/thaiaddress'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import FileDrag from '@/components/custom/fileDrag'
import { IVenderType } from './type'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Venders
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
  selectedBranch: '',
  branch: '',
  remark: '',
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [venderTypes, setVenderType] = useState<IVenderType[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register, setValue } = useForm()
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [onloading, setOnloading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editBillings, setEditBilling] = useState<Billing>(intial)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [editId, setEditId] = useState(null)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()
  const { setRefresh } = useContext(ApiContext) as ApiType
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 600)

 async function addFile(payload: any) {
    //setFiles(payload)
    const formData = new FormData()
    for (let i = 0; i < payload?.length; i++) {
      formData.append('files', payload[i])
      formData.append('venderId', data.id)
    }

    console.log('upload file data:', formData)


    const res: any = await venderUploadFiles(formData)
    if (res.status == 200) {
      console.log('uploadFiles -success', res.status)
    }
  }

  function updateBilling(payload: any) {
    console.log('updateBilling', payload)
    setEditId(payload.id)
    setEditBilling(payload)
    setOpenModal(true)
  }

  function newBilling() {
    setEditBilling(intial)
    setOpenModal(true)
  }

  function deleteBilling(payload: any) {
    console.log('deleteBilling', payload)

    setDeleteId(payload.id)
    setdeleteTitle(payload.code)
    setOpenDeleteModal(true)
  }

  async function confirmDeleteBilling() {
    setIsLoading(true)
    const res: any = await deleteVenderBillig(deleteId)
    if (res.status == 200) {
      console.log(res.data)
      const newBill = data.venderBillings.filter((x) => x.id != deleteId)
      data.venderBillings = newBill
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
    console.log('addNew billing address', editId)

    if (payload.id) {
      console.log('update address', payload)
      payload.id = editId
      const res: any = await updateVenderBilling(payload)

      if (res.status == 200) {
        console.log(res.data)
        let updateIndex = data.venderBillings.findIndex((x) => x.id == editId)
        if (updateIndex != -1) {
          data.venderBillings[updateIndex] = payload
          console.log('update new address ', data.venderBillings[updateIndex])
        }
      } else {
        console.log('update new address error')
      }
    } else {
      payload.venderId = data.id
      console.log('new address', payload)
      const res: any = await createVenderBilling(payload)
      if (res.status == 200) {
        console.log('create new address success', res)
        payload.id = res.data.id
        data.venderBillings.push(payload)
      } else {
        console.log('create new address error')
      }
    }
    setEditId(null)
    setTimeout(() => {
      setIsLoading(false)
      setOpenModal(false)
    }, 2000)
  }

  async function updateData(data: any) {
    setOnloading(true)
    const res: any = await updateVender(data)

    if (res.status != 200) {
      console.log('error:', res)
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
    getVenderType().then((data) => setVenderType(data))

  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen  h-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Vender</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <Tabs defaultValue='general' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='general'>General Information</TabsTrigger>
              <TabsTrigger value='billing'>Billing</TabsTrigger>
              <TabsTrigger value='file'>File Attached</TabsTrigger>
            </TabsList>
            <TabsContent value='general' className='h-full'>
              <div className='grid gap-4'>
                <form onSubmit={handleSubmit(updateData)}>
                  <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-3 mb-2  flex items-center'>
                      {/* <IconMap /> */}
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Information.
                      </Label>
                    </div>
                    <Input
                      className='hidden'
                      {...register('id')}
                      defaultValue={data.id}
                    />
                    <div className='col-span-3 grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='code'
                      >
                        Company Name
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('companyName')}
                        defaultValue={data.companyName}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='code'
                      >
                        Code
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('code')}
                        defaultValue={data.code}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='tax'
                      >
                        Tax ID
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('tax')}
                        defaultValue={data.tax}
                      />
                    </div>
                    <div>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='bankAccount'
                      >
                        Bank Account
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('bankAccount')}
                        defaultValue={data.bankAccount}
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
                        className='text-[0.8rem]'
                        {...register('specialIntruction')}
                        defaultValue={data.specialIntruction}
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
                        className='text-[0.8rem]'
                        {...register('paymentTerm')}
                        defaultValue={data.paymentTerm}
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
                        className='text-[0.8rem]'
                        {...register('currency')}
                        defaultValue={data.currency}
                      />
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='venderType'
                      >
                        Vender Type
                      </Label>
                      <select
                        {...register('venderTypeId')}
                        defaultValue={data.venderTypeId}
                        // id={item.id}
                        // onChange={handleChangeBranch}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        {/* <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value={data.paymentType}
                        >
                          {data.paymentType}
                        </option> */}

                        {venderTypes?.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.id}
                              >
                                {item.typeName}
                              </option>
                            ))}
                      </select>
                    </div>
                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='venderType'
                      >
                        Payment Type
                      </Label>
                      <select
                        {...register('paymentType')}
                        defaultValue={data.paymentType}
                        // id={item.id}
                        // onChange={handleChangeBranch}
                        className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                      >
                        <option
                          className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                          value={data.paymentType}
                        >
                          {data.paymentType}
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
                  </div>
                  <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-3 mb-2  flex items-center'>
                      {/* <IconMap /> */}
                      <Label htmlFor='terms' className='ml-3 text-lg'>
                        Address.
                      </Label>
                    </div>

                    <div className='col-span-3 grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='address'
                      >
                        Address
                      </Label>
                      <Input
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
                        className='text-[0.8rem]'
                        {...register('country')}
                        defaultValue={data.country}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='latitude'
                      >
                        Latitude
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('latitude')}
                        defaultValue={data.latitude}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='longtitude'
                      >
                        Longtitude
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('longtitude')}
                        defaultValue={data.longtitude}
                      />
                    </div>
                  </div>
                  <div className='mb-3 grid grid-cols-4 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                    <div className='col-span-4 mb-2  flex items-center'>
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
                        className='text-[0.8rem]'
                        {...register('phone')}
                        defaultValue={data.phone}
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
                        className='text-[0.8rem]'
                        {...register('phoneExt')}
                        defaultValue={data.phoneExt}
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
                        className='text-[0.8rem]'
                        {...register('faxExt')}
                        defaultValue={data.faxExt}
                      />
                    </div>

                    <div className='grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='contactName'
                      >
                        Contact Name
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('contactName')}
                        defaultValue={data.contactName}
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
                        className='text-[0.8rem]'
                        {...register('alternatePhone')}
                        defaultValue={data.alternatePhone}
                      />
                    </div>

                    <div className='col-span-4 grid'>
                      <Label
                        className='py-1 text-[0.8rem] text-muted-foreground'
                        htmlFor='remark'
                      >
                        Remark
                      </Label>
                      <Input
                        className='text-[0.8rem]'
                        {...register('remark')}
                        defaultValue={data.remark}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button loading={onloading} type='submit' variant='button'>
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </TabsContent>
            <TabsContent value='billing' className='h-screen w-full '>
              <Table className='overflow-scroll'>
                <TableCaption>A list of your recent permission.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[300px]'>Code</TableHead>
                    <TableHead className='w-[250px]'>Name</TableHead>
                    <TableHead className='w-[350px]'>Address</TableHead>
                    <TableHead className='w-[350px]'>District</TableHead>
                    <TableHead className='w-[350px]'>Sub-District</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Postcode</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.venderBillings?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='text-left'>{item.code}</TableCell>
                      <TableCell className='text-left'>{item.name}</TableCell>
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
                        {item.country}
                      </TableCell>
                      <TableCell className='text-left'>{item.branch}</TableCell>
                      <TableCell className='text-left'>
                        {item.contactName}
                      </TableCell>
                      <TableCell className='text-left'>{item.phone}</TableCell>
                      <TableCell className='text-left'>{item.email}</TableCell>

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
            </TabsContent>
            <TabsContent value='file' className='h-[35rem]'>
                {/* <Card className='min-h-full overflow-scroll '>
                  <CardContent className='h-[35rem] space-y-2'> */}
                    <div className='grid gap-4'>
                    <FileDrag uploadData={(e) => addFile(e)} />  
                     

                      <Table className='overflow-scroll'>
                        <TableCaption>A list of file attached.</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>

                            <TableHead className='items-center'>
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.venderFileAttach?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                {item.fileName}
                              </TableCell>

                              <TableCell className='w-[8rem]'>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  //onClick={() => downloadFile(item.path)}
                                >
                                  <IconDownload size={20} />
                                </Button>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                 // onClick={() => openFile(item.path)}
                                >
                                  <IconEye size={20} />
                                </Button>

                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  //onClick={() => deleteAction(item)}
                                >
                                  <IconTrash size={20} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={10} className='text-right'>
                              {/* <Button loading={false} >
                            <IconRefresh size={20} />
                            Add
                          </Button> */}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  {/* </CardContent>
                </Card> */}
              </TabsContent>
          </Tabs>
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
