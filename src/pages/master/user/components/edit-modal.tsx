// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { User } from './schema'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  createBranchUser,
  deleteBranchUser,
  editUserRoleBranch,
  updateUserRoleBranch,
  uploadUserImage,
} from '@/services/userApi'
import { PasswordInput } from '@/components/custom/password-input'
import { getBranch } from '@/services/branchApi'
import { BranchType } from '../../branch/components/type'
import { getRoles } from '@/services/roleApi'
import { RoleType } from '../../role/components/type'
import {
  IconDeviceFloppy,
  IconLogin,
  IconMap,
  IconTrash,
  IconUserSquare,
} from '@tabler/icons-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { AlertModal } from '@/components/custom/alert-modal'
import { ThaiAddress } from 'types/thaiaddress'
import useDebounce from '@/hooks/use-debounce'
import useThaiAddress from '@/hooks/use-thaiAddress'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'

type UserRoleBanch = {
  id: string
  userId: number
  branchId: number
  roleBranchesId: number
  branch: {
    id: string
    branchName: string
    code: string
  }
  roleBranches: {
    id: string
    name: string
  }
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: User
  rolebranch: UserRoleBanch[]
}

const formSchema = z.object({
  branch: z.string(),
  roleBranches: z.string(),
})

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  rolebranch,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register, setValue } = useForm()
  const [logoFile, setLogoFile] = useState('')
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [onloading, setOnloading] = useState(false)
  const [branches, setBranch] = useState<BranchType[]>([])
  const [roles, setRoles] = useState<RoleType[]>([])
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()
  const [isOpenAddress, setIsOpenAddress] = useState(false)

  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)

  const navigate = useNavigate()
  const { setRefresh } = useContext(ApiContext) as ApiType

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: '',
      roleBranches: '',
    },
  })

  async function addUserRoleBranch(user: any) {
    setOnloading(true)
    const selectBranch: any = branches.find(
      (item) => item.branchName == user.branch
    )
    const selectRole: any = roles.find((item) => item.name == user.roleBranches)

    user.userId = parseInt(data.id)
    user.branchId = selectBranch.id
    user.roleBranchesId = selectRole.id

    console.log('addUserRoleBranch ', user)
    const res: any = await createBranchUser(user)
    if (res.status == 200) {
      console.log('createBranchUser -success', res.status)
      setOnloading(false)
      form.reset()
      setTimeout(() => {
        //onClose()
      }, 1000)
    }
    setOnloading(false)
  }

  function handleChangeBranch(e: ChangeEvent<HTMLSelectElement>) {
    const findBranch = branches.find((i) => i.id == parseInt(e.target.value))
    if (findBranch) {
      const roleIndex = rolebranch.findIndex((i) => i.id == e.target.id)
      rolebranch[roleIndex].branchId = findBranch.id
      console.log('edit role', rolebranch)
    }
  }

  function handleChangeRole(e: ChangeEvent<HTMLSelectElement>) {
    const select = roles.find((i) => i.id == parseInt(e.target.value))
    if (select) {
      const roleIndex = rolebranch.findIndex((i) => i.id == e.target.id)
      rolebranch[roleIndex].roleBranchesId = select.id
      console.log('edit role', rolebranch)
    }
  }

  const deleteItem = async (item: any) => {
    console.log('delete use role branch', item)
    setDeleteId(item.id)
    setdeleteTitle(item.branch.branchName + item.roleBranches.name)
    setOpen(true)
  }

  const onConfirm = async () => {
    setOnloading(true)
    console.log('delete use role branch', deleteId)

    const res: any = await deleteBranchUser(deleteId)

    if (res.status == 200) {
      setTimeout(() => {
        onClose()
      }, 1000)
    }
    setTimeout(() => {
      setOnloading(false)
      setOpen(false)
    }, 1000)
  }

  const editItem = async (item: any) => {
    const updateRole = rolebranch.find((i) => i.id == item)
    //rolebranch[roleIndex].roleBranchesId = select.id
    console.log('editItem', updateRole)
    const res: any = await editUserRoleBranch(updateRole)

    if (res.status == 200) {
      setTimeout(() => {
        onClose()
      }, 1000)
    }
  }
  async function updateData(data: any) {
    setOnloading(true)
    console.log('updateData', data)
    data.id = parseInt(data.id)
    console.log('updateData', data)

    const res: any = await updateUserRoleBranch(data)
    setOnloading(false)
    if (res.status == 200) {
      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        formData.append('userId', data.id)
        console.log('update', logoFile)

        const response: any = await uploadUserImage(formData)
        if (response.status == 200) {
          console.log('uploadUserImage -success', response.status)
        }
      }
      setTimeout(() => {
        setOnloading(false)
        setRefresh(true)
        onClose()
        navigate('/master/user', { replace: true })
      }, 1000)
    }
  }

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    if (files.length) {
      setLogoFile(files[0])
      console.log('handle file', logoFile)
    }
  }

  function onSelectResult(e: any) {
    if (dataValue) {
      const index: any = addressThai?.find((a) => a.id == e.target.value)
      console.log('onSelectResult', index)
      setValue('district', index?.districtThai)
      setValue('subDistrict', index?.tambonThai)
      setValue('province', index?.provinceThai)
      setValue('zipcode', index?.postCode)
      setValue('country', 'ประเทศไทย')

      setIsOpenAddress(true)
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
          isOpenAddress ? 'hidden' : 'block'
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
    getBranch().then((data) => setBranch(data))
    getRoles().then((data) => setRoles(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen  max-h-full overflow-scroll '>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Tabs defaultValue='general' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='general'>General Information</TabsTrigger>
                <TabsTrigger value='materiallist'>Branch & Role</TabsTrigger>
              </TabsList>
              <TabsContent value='general'>
                <Card>
                  <CardContent className='h-full space-y-2'>
                    <form onSubmit={handleSubmit(updateData)}>
                      <div className='grid grid-cols-3 gap-2 '>
                        <Input
                          className='hidden text-[0.8rem]'
                          {...register('id')}
                          defaultValue={data.id}
                        />
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='userId'
                          >
                            User ID
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('userId')}
                            defaultValue={data.userId}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='employeeId'
                          >
                            Employee ID
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('employeeId')}
                            defaultValue={data.employeeId}
                          />
                        </div>
                        <div className='row-span-4 mt-2 grid justify-items-center rounded-md border p-1'>
                          {data.userImage ? (
                            <img
                              src={`data:image/jpeg;base64,${data.userImage}`}
                              className='relative mb-2'
                              width={180}
                              height={70}
                              alt='Vite'
                            />
                          ) : (
                            <IconUserSquare size={150} />
                          )}

                          <div className='grid w-52 max-w-sm items-center gap-1.5'>
                            <input type='file' onChange={handleImport} />
                          </div>
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='firstName'
                          >
                            Firstname
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('firstName')}
                            defaultValue={data.firstName}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='lastName'
                          >
                            Lastname
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('lastName')}
                            defaultValue={data.lastName}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='idCard'
                          >
                            ID.Card
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('idCard')}
                            defaultValue={data.idCard}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='division'
                          >
                            Division
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('division')}
                            defaultValue={data.division}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='dateOfBirth'
                          >
                            Date Of Birth
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('dateOfBirth')}
                            defaultValue={data.dateOfBirth}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='dateOfHire'
                          >
                            Date Of Hire
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('dateOfHire')}
                            defaultValue={data.dateOfHire}
                          />
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
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.status}
                            >
                              {data.status}
                            </option>

                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value='active'
                            >
                              Active
                            </option>
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value='inactive'
                            >
                              Inactive
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className='mb-3 mt-2 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                        <div className='col-span-2 mb-2  flex items-center'>
                          <IconMap />
                          <Label htmlFor='terms' className='ml-3 text-lg'>
                            Address/Contact
                          </Label>
                        </div>
                        <div className='col-span-2 grid'>
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
                              onClick={() => setIsOpenAddress(false)}
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
                            htmlFor='phoneNumer'
                          >
                            Phone number
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('phoneNumber')}
                            defaultValue={data.phoneNumber}
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
                      </div>
                      <div className='mb-3 mt-2 grid grid-cols-2 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                        <div className='col-span-2 mb-2  flex items-center'>
                          <IconLogin />
                          <Label htmlFor='terms' className='ml-3 text-lg'>
                            User Account
                          </Label>
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='username'
                          >
                            Username
                          </Label>
                          <Input
                            className='text-[0.8rem]'
                            {...register('username')}
                            defaultValue={data.username}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='password'
                          >
                            Password
                          </Label>
                          <PasswordInput
                            placeholder='********'
                            {...register('password')}
                            defaultValue={data.password}
                          />
                          {/* <Input

                            className='text-[0.8rem]'
                            placeholder='********'
                            {...register('password')}
                            defaultValue={data.password}
                          /> */}
                        </div>
                      </div>
                      <div className='grid'>
                        <Button
                          className='float-end mt-5'
                          variant='button'
                          loading={onloading}
                          type='submit'
                        >
                          Save changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='materiallist'>
                <Card>
                  <CardContent className='h-[35rem] space-y-2'>
                    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                      <div className='grid gap-4'>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(addUserRoleBranch)}
                            className='w-2/3 space-y-6'
                          >
                            <div className='grid grid-cols-3 gap-2 '>
                              <FormField
                                control={form.control}
                                name='branch'
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
                                              'w-[200px] justify-between',
                                              !field.value &&
                                                'text-muted-foreground'
                                            )}
                                          >
                                            {field.value
                                              ? branches.find(
                                                  (item) =>
                                                    item.branchName ===
                                                    field.value
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
                                            <CommandEmpty>
                                              No branch found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {branches.map((item) => (
                                                <CommandItem
                                                  value={item.branchName}
                                                  key={item.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      'branch',
                                                      item.branchName
                                                    )
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      'mr-2 h-4 w-4',
                                                      item.branchName ===
                                                        field.value
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
                              {/* <FormField
                                control={form.control}
                                name='branch'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>New Branch</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder='Select branch' />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {branches.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={item.branchName}
                                          >
                                            {item.branchName}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              /> */}
                              <FormField
                                control={form.control}
                                name='roleBranches'
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
                                              'w-[200px] justify-between',
                                              !field.value &&
                                                'text-muted-foreground'
                                            )}
                                          >
                                            {field.value
                                              ? roles.find(
                                                  (item) =>
                                                    item.name === field.value
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
                                            <CommandEmpty>
                                              No role found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {roles.map((item) => (
                                                <CommandItem
                                                  value={item.name}
                                                  key={item.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      'roleBranches',
                                                      item.name
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
                              {/* <FormField
                                control={form.control}
                                name='roleBranches'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>New Role</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder='Select role' />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {roles.map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={item.name}
                                          >
                                            {item.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              /> */}
                              <div className='float-end mt-5'>
                                <Button
                                  type='submit'
                                  variant='button'
                                  loading={onloading}
                                >
                                  Submit
                                </Button>
                              </div>
                            </div>
                          </form>
                        </Form>
                      </div>
                    </div>
                    <Table>
                      <TableCaption>
                        A list of your branch and roles.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Branch Name</TableHead>
                          <TableHead>Role</TableHead>

                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rolebranch?.map((item) => (
                          <TableRow key={item.id}>
                            
                            <TableCell>
                              <select
                                id={item.id}
                                onChange={handleChangeBranch}
                                className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                              >
                                <option className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                                  {item.branch.branchName}
                                </option>
                                {branches.map((item) => (
                                  <option
                                    className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                    value={item.id}
                                    key={item.id}
                                  >
                                    {item.branchName}
                                  </option>
                                ))}
                              </select>
                            </TableCell>
                            <TableCell>
                              <select
                                id={item.id}
                                onChange={handleChangeRole}
                                className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                              >
                                <option className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                                  {item.roleBranches.name}
                                </option>
                                {roles.map((item) => (
                                  <option
                                    className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                    value={item.id}
                                    key={item.id}
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </TableCell>

                            <TableCell className='justify-content-center'>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => editItem(item.id)}
                              >
                                <IconDeviceFloppy size={20} />
                              </Button>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => deleteItem(item)}
                              >
                                <IconTrash size={20} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <br />
          </div>
        </DialogContent>
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onConfirm}
          loading={onloading}
          title={deleteTitle}
        />
      </Dialog>
    </>
  )
}
