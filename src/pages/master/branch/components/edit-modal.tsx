'use client'
import { useContext, useEffect, useState } from 'react'
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
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { BranchType } from './type'
import { updateBranch } from '@/services/branchApi'
import { IconMap, IconPhone } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import useThaiAddress from '@/hooks/use-thaiAddress'
import useDebounce from '@/hooks/use-debounce'
import { ThaiAddress } from 'types/thaiaddress'
import { cn } from '@/lib/utils'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: BranchType
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register, setValue } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [open, setOpen] = useState(false)
  const {setRefresh} = useContext(ApiContext) as ApiType
  const { userInputCallback, dataValue } = useThaiAddress()
  const debounceValue = useDebounce(userInputCallback, 800)
  const [addressThai, setAddressThai] = useState<ThaiAddress[]>()


  async function updateData(data: any) {
    console.log('update branch', data)
    setRefresh(true)
    setOnloading(true)
    const res: any = await updateBranch(data)
    if (res.status == 200) {
      console.log('update branch -success', res.status)
      setTimeout(() => {
        setOnloading(false)
        onClose()
      }, 1000)
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
      <DialogContent className='max-h-full max-w-screen overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
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
                     <div className='col-span-2 grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='Company Name'
                  >
                    Branch Name
                  </Label>
                  <Input
                    className='text-[0.8rem]'
                    {...register('branchName')}
                    defaultValue={data.branchName}
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
              
                <div className='grid col-span-2'>
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
                <div className='grid w-full'>
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
                    className='flex h-9 w-52 items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    {/* <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={data.status}
                    >
                      {data.status}
                    </option> */}

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
              <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <div className='col-span-3 mb-2  flex items-center'>
                  <IconMap />
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
                    <Label  className='py-1 text-[0.8rem] text-muted-foreground' htmlFor='district'>
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
              
                </div>
                <div className='mb-3 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <div className='col-span-3 mb-2  flex items-center'>
                  <IconPhone />
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
                    htmlFor='ext'
                  >
                    Fax-Ext
                  </Label>
                  <Input
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
                    className='text-[0.8rem]'
                    {...register('email')}
                    defaultValue={data.email}
                  />
                </div>
                <div className='grid col-span-3'>
                  <div>
                    <Label
                      className='py-1 text-[0.8rem] text-muted-foreground'
                      htmlFor='remark'
                    >
                      Note
                    </Label>
                    <Input
                      className='text-[0.8rem]'
                      {...register('remark')}
                      defaultValue={data.remark}
                    />
                  </div>
                </div>
              </div>

              <br />
              <DialogFooter>
                <Button loading={onloading} type='submit' variant='button' >
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
