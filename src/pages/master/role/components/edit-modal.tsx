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
import { Separator } from '@/components/ui/separator'
//import { Role } from './schema'
import { Permission } from 'types/permission'
import { updateRole, updateRoleWithPermissions } from '@/services/roleApi'
import { Checkbox } from '@/components/ui/checkbox'
import { Role } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Role
  role: Permission[]
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  role,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)

  const { setRefresh } = useContext(ApiContext) as ApiType

  async function updateData(data: any) {
    // data.permission = selectPermisstion
    const updatePermissions = role.filter((i) => i.checked == true)
    data.permission = updatePermissions
    console.log('updateData', data)
    // console.log('updatePermissions', updatePermissions)
    const res: any = await updateRole(data)

    setOnloading(true)
    if (res.status == 200) {
      console.log('update Role-success', res.status)
      console.log('updateRoleWithPermissions', data)
      const respone: any = await updateRoleWithPermissions(data)
      if (respone.status == 200) {
        console.log('update Role With Permissions -success', res.status)
      }
    }

    setTimeout(() => {
      setOnloading(true)
      onClose()
      setRefresh(true)
    }, 1000)
  }

  function onCheck(e: any) {
    const selected = role.findIndex((item) => item.id == e.id)
    if (selected != -1) {
      role[selected].checked = !role[selected].checked
    }
    console.log('onCheck:', role)
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
        <DialogContent className='max-w-screen max-h-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <form onSubmit={handleSubmit(updateData)}>
              <div className='mb-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <div className='grid grid-cols-3 gap-2'>
                  <Input
                    className='hidden'
                    {...register('id')}
                    defaultValue={data.id}
                  />

                  <div className='grid'>
                    <Label
                      className='py-1 text-[0.8rem] text-muted-foreground'
                      htmlFor='name'
                    >
                      Role Name
                    </Label>
                    <Input
                      className='text-[0.8rem]'
                      {...register('name')}
                      defaultValue={data.name}
                    />
                  </div>
                  <div className='grid'>
                    <Label
                      className='py-1 text-[0.8rem] text-muted-foreground'
                      htmlFor='description'
                    >
                      Description
                    </Label>
                    <Input
                      className='text-[0.8rem]'
                      {...register('description')}
                      defaultValue={data.description}
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
              </div>
              <Separator />
              <div className='mb-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
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
                  {role?.map((item) => (
                    <div
                      key={item.id}
                      className='flex flex-row items-start space-x-3 space-y-1'
                    >
                      <Checkbox
                        id={item.id}
                        onCheckedChange={() => onCheck(item)}
                        defaultChecked={item.checked}
                        className='mt-2'
                      />
                      <Label className='mb-5 font-normal'>
                        {item.description}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <DialogFooter>
                <Button loading={onloading} type='submit' variant='button'>
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
