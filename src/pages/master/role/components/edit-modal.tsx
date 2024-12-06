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
import { AccessPermission, Permission } from 'types/permission'
import { updateAccessPermission, updateRole, updateRoleWithPermissions } from '@/services/roleApi'
import { Checkbox } from '@/components/ui/checkbox'
import { Role } from './schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Role
  role: AccessPermission[]
  editble: boolean
  permissions : Permission[]
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  role,
  editble,
  permissions
}) => {
 // const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  
  const { setRefresh } = useContext(ApiContext) as ApiType

  
  async function updateData(data: any) {
    const nwPermissions = role
    const updatePermissions = nwPermissions.filter((i) => i.canCreate != false || i.canView != false || i.canUpdate != false || i.canDelete != false)
    const newPermission = updatePermissions.map((item) => {
      return permissions.find(a => a.id == item.id.toString())
    }) 
    data.permission = newPermission
    data.accessPermission = updatePermissions
    console.log('updateData', data)


    const res: any = await updateRole(data)
    

    setOnloading(true)
    if (res.status == 200) {
      console.log('update Role-success', res)
      //console.log('updateRoleWithPermissions', data)
      const respone: any = await updateRoleWithPermissions(data)
      await updateAccessPermission(data)
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

 
  function onChangePermisstionRole(e: any, action: string) {
    const selectChangeIndex = role.findIndex(item => item.id == e.id)
    console.log('check:', role[selectChangeIndex])
    if (selectChangeIndex != -1) {
        
        if( action === 'view') {role[selectChangeIndex].canView = !role[selectChangeIndex].canView}
         if( action === 'create') { role[selectChangeIndex].canCreate = !role[selectChangeIndex].canCreate}
         if( action === 'update') { role[selectChangeIndex].canUpdate = !role[selectChangeIndex].canUpdate}
         if( action === 'delete') { role[selectChangeIndex].canDelete = !role[selectChangeIndex].canDelete}
     
      }

   
  }

  useEffect(() => {
   // setNewPermissionsRole(role)
    //setIsMounted(true)
  }, [])

  // if (!isMounted) {
  //   return null
  // }

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
                    readOnly={editble}
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
                      readOnly={editble}
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
                      readOnly={editble}
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

                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead colSpan={3}>Permissions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {role.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.permission}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <div
                              key={item.id}
                              className='flex flex-row items-start space-x-3 space-y-1'
                            >
                              <Checkbox
                                disabled={editble}
                                className='mt-1'
                                defaultChecked={item.canView}
                                onCheckedChange={() =>
                                  onChangePermisstionRole(item, 'view')
                                }
                              />
                              <Label className='mb-5 font-normal'>View</Label>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              key={item.id}
                              className='flex flex-row items-start space-x-3 space-y-1'
                            >
                              <Checkbox
                                disabled={editble}
                                className='mt-1'
                                defaultChecked={item.canCreate}
                                onCheckedChange={() =>
                                  onChangePermisstionRole(item, 'create')
                                  
                                }
                              />
                              <Label className='mb-5 font-normal'>Create</Label>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              key={item.id}
                              className='flex flex-row items-start space-x-3 space-y-1'
                            >
                              <Checkbox
                                disabled={editble}
                                className='mt-1'
                                defaultChecked={item.canUpdate}
                                onCheckedChange={() =>
                                  onChangePermisstionRole(item, 'update')
                                }
                              />
                              <Label className='mb-5 font-normal'>Update</Label>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              key={item.id}
                              className='flex flex-row items-start space-x-3 space-y-1'
                            >
                              <Checkbox
                                disabled={editble}
                                className='mt-1'
                                defaultChecked={item.canDelete}
                                onCheckedChange={() =>
                                  onChangePermisstionRole(item, 'delete')
                                }
                              />
                              <Label className='mb-5 font-normal'>Delete</Label>
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full'
                              // onClick={() =>
                              //   console.log('permission seletc:', newPermissionsRole)
                              // }
                            >
                              <IconEye size={20} />
                            </Button>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* <div className='grid grid-cols-3 gap-2 '>
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
                </div> */}
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
