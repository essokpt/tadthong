/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ImportMaterial } from './schema'

import { updateMaterial, updateMaterialItem } from '@/services/materialApi'
import { LocationType } from '@/pages/location/components/type'
import { getLocation } from '@/services/locationApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconChecklist, IconInfoCircle } from '@tabler/icons-react'
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: ImportMaterial
  isEdit: boolean
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  isEdit,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [locations, setLocation] = useState<LocationType[]>([])

  const { setRefresh } = useContext(ApiContext) as ApiType

  async function updateData(payload: any) {
    setOnloading(true)

    const sumAmount = data.materials?.reduce(
      (sum, item) =>
        sum +
        Number(item.priceReceipt) *
          (Number(item.weightIn) - Number(item.weightOut)),
      0
    )

    payload.amount = Math.abs(sumAmount)
    console.log('updateData:', data)
    //payload.materials = data.materials
    const res: any = await updateMaterial(payload)

    if (res.status == 200) {
      console.log('updateMaterial items', data.materials)

      const respone =  await updateMaterialItem(data.materials)
       console.log('updateMaterial items', respone)

    }

    setTimeout(() => {
      setOnloading(false)
      setRefresh(true)
      onClose()
    }, 1000)
  }

  function handleChangeValue(e: ChangeEvent<HTMLInputElement>) {
    const itemIndex: any = data.materials.findIndex(
      (item) => item.id == Number(e.target.id)
    )
    console.log('handleSelectOriginal', e.target.id)

    if (itemIndex != -1) {
      data.materials[itemIndex].weightIn = e.target.value
      console.log('handleSelectOriginal', itemIndex, e.target.value)
    }
  }

  function handleChangeValueWeightOut(e: ChangeEvent<HTMLInputElement>) {
    const itemIndex: any = data.materials.findIndex(
      (item) => item.id == Number(e.target.id)
    )
    console.log('handleChangeValueWeightOut', e.target.id)

    if (itemIndex != -1) {
      data.materials[itemIndex].weightOut = e.target.value
      console.log('handleChangeValueWeightOut', itemIndex, e.target.value)
    }
  }

  const handleChangeType = (e: ChangeEvent<HTMLSelectElement>) => {
    const itemIndex: any = data.materials.findIndex(
      (item) => item.id == Number(e.target.id)
    )
    if (itemIndex != -1) {
      data.materials[itemIndex].paymentType = e.target.value
            console.log('handleChangeType',  data.materials[itemIndex])

    }
  }

  useEffect(() => {
    setIsMounted(true)
    getLocation().then((data) => setLocation(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='h-screen max-w-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Import Weight Scale Data.</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />

          <div className='grid h-auto gap-4'>
            <form onSubmit={handleSubmit(updateData)} className='mr-3 '>
              {/* <div className='grid grid-cols-3 gap-2 '> */}
              <div className='mb-3 mt-2 grid grid-cols-3 items-start gap-2 space-x-3 space-y-0 rounded-md border p-3 shadow'>
                <div className='col-span-3 flex items-center'>
                  <IconInfoCircle />
                  <Label htmlFor='terms' className='ml-3 text-lg'>
                    Information.
                  </Label>
                </div>
                <Input
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
                    readOnly
                    className='text-[0.8rem]'
                    {...register('code')}
                    defaultValue={data.code}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='importDate'
                  >
                    Import Date
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    {...register('importDate')}
                    defaultValue={data.importDate}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='Importby'
                  >
                    Import by
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    {...register('description')}
                    defaultValue={data.user?.firstName}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='status'
                  >
                    Status
                  </Label>
                  <Input
                    readOnly
                    className='text-[0.8rem]'
                    {...register('status')}
                    defaultValue={data.status}
                  />
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='itemCategoryId'
                  >
                    Location
                  </Label>
                  <select
                    disabled={!isEdit}
                    {...register('locationId')}
                    defaultValue={data.locationId}
                    className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={data.location?.id}
                    >
                      {data.location?.name}
                    </option>
                    {locations?.map((item) => (
                      <option
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        value={item.id}
                        key={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='remark'
                  >
                    Approved/Reject By
                  </Label>
                  <Input
                    readOnly={!isEdit}
                    className='text-[0.8rem]'
                    {...register('approvedBy')}
                    defaultValue={data.approvedBy}
                  />
                </div>

                <div className='col-span-3 grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='remark'
                  >
                    Comment
                  </Label>
                  <Input
                    readOnly={!isEdit}
                    className='text-[0.8rem]'
                    {...register('remark')}
                    defaultValue={data.remark}
                  />
                </div>
              </div>

              {/* <div className='grid'> */}
              <div className='mb-3 mt-2 grid grid-cols-1 items-start gap-2 space-x-3 space-y-0 rounded-md border p-4 shadow'>
                <div className='mb-2  flex items-center'>
                  <IconChecklist />
                  <Label htmlFor='terms' className='ml-3 text-lg'>
                    Material Import Information.
                  </Label>
                </div>
                <Table className='w-[160rem]'>
                  <TableCaption>A list of your recent items.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Import ID (Ident)</TableHead>
                      <TableHead className='w-[6rem]'>
                        เลขที่ชั่งเข้า (ticket1)
                      </TableHead>
                      <TableHead className='w-[6rem]'>
                        เลขที่ชั่งออก (ticket2)
                      </TableHead>
                      <TableHead className='w-[6rem]'>
                        ทะเบียนรถ (truck)
                      </TableHead>
                      <TableHead>วันชั่งเข้า (datein)</TableHead>
                      <TableHead>เวลาชั่งเข้า (timein)</TableHead>
                      <TableHead className='w-[6rem]'>
                        น้ำหนักชั่งเข้า (w1)
                      </TableHead>
                      <TableHead>วันชั่งออก (dateout)</TableHead>
                      <TableHead>เวลาชั่งออก (timeout)</TableHead>
                      <TableHead className='w-[6rem]'>
                        น้ำหนักชั่งออก (w2)
                      </TableHead>
                      <TableHead>ประเภท (code1)</TableHead>
                      <TableHead>บริษัท (code2)</TableHead>
                      <TableHead className='w-[8rem]'>Payment Type</TableHead>
                      <TableHead>สินค้า (code3)</TableHead>
                      <TableHead>การขนส่ง (code4)</TableHead>
                      <TableHead>ความชื้น% (Work Order)</TableHead>
                      <TableHead>สิ่งเจือปน% (Quota)</TableHead>
                      <TableHead>หมายเหตุ (remark3)</TableHead>
                      <TableHead>ราคา (price)</TableHead>
                      <TableHead className='w-[6rem]'>
                        หักความชื้น (adj_w1)
                      </TableHead>
                      <TableHead className='w-[6rem]'>
                        หักสิ่งเจือปน (adj_w2)
                      </TableHead>
                      <TableHead>หักอื่นๆ (adj_w3)</TableHead>
                      <TableHead className='w-[6rem]'>
                        หักเงินค่าชั่ง (adj_m1)
                      </TableHead>
                      <TableHead>หักค่าลง (adj_m2)</TableHead>
                      <TableHead className='w-[6rem]'>
                        หักเงินอื่นๆ (adj_m3)
                      </TableHead>
                      <TableHead>Print 1 (print1)</TableHead>
                      <TableHead>Print 2 (print2)</TableHead>
                      <TableHead>CheckSum (chksum)</TableHead>
                      <TableHead>Status (status)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.materials?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.importId}</TableCell>
                        <TableCell>{item.queueNo}</TableCell>
                        <TableCell>{item.cardNo}</TableCell>
                        <TableCell>{item.carNo}</TableCell>
                        <TableCell>{item.dateIn}</TableCell>
                        <TableCell>{item.timeIn}</TableCell>

                        <TableCell>
                          {/* {item.weightIn} */}

                          <Input
                            id={item.id.toString()}
                            className='text-[0.8rem]'
                            min={0}
                            // type='number'
                            onChange={handleChangeValue}
                            defaultValue={item.weightIn}
                          />
                        </TableCell>
                        <TableCell>{item.dateOut}</TableCell>
                        <TableCell>{item.timeOut}</TableCell>
                        <TableCell>
                          {/* {item.weightOut} */}
                          <Input
                            id={item.id.toString()}
                            className='text-[0.8rem]'
                            min={0}
                            // type='number'
                            onChange={handleChangeValueWeightOut}
                            defaultValue={item.weightOut}
                          />
                        </TableCell>
                        <TableCell>{item.typeCode}</TableCell>

                        <TableCell>{item.customerCode}</TableCell>

                        <TableCell>
                          <select
                            defaultValue={item.paymentType}
                            id={item.id.toString()}
                            onChange={handleChangeType}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value='Cash'
                            >
                              Cash
                            </option>
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value='Cradit'
                            >
                              Cradit
                            </option>
                          </select>
                        </TableCell>
                        {/* <TableCell>
                          <Select id={item.id} onValueChange={handleChangeType}>
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Select a type' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value='Cash'>Cash</SelectItem>
                                <SelectItem value='Cradit'>Cradit</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell> */}

                        <TableCell>{item.productCode}</TableCell>
                        <TableCell>{item.col1}</TableCell>
                        <TableCell>{item.col2}</TableCell>
                        <TableCell>{item.col3}</TableCell>

                        <TableCell>{item.remark}</TableCell>
                        <TableCell>{item.priceReceipt}</TableCell>
                        <TableCell>{item.col4}</TableCell>
                        <TableCell>{item.col5}</TableCell>
                        <TableCell>{item.col6}</TableCell>

                        <TableCell>{item.col7}</TableCell>
                        <TableCell>{item.col8}</TableCell>
                        <TableCell>{item.col9}</TableCell>
                        <TableCell>{item.col10}</TableCell>
                        <TableCell>{item.col11}</TableCell>
                        <TableCell>{item.col12}</TableCell>
                        <TableCell>{item.col13}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <br />
              <DialogFooter className={`${isEdit ? 'text-left' : 'hidden'}`}>
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
