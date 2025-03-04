'use client'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import {
  createWip,
  getItemCategory,
  getItemGroup,
  getItemType,
  itemMasterDeleteFileAttach,
  itemMasterDownloadFileAttach,
  itemMasterUploadFiles,
  updateItem,
} from '@/services/itemApi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { getUom } from '@/services/uomApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { LocationType } from '@/pages/location/components/type'
import { getLocation } from '@/services/locationApi'
import FileDrag from '@/components/custom/fileDrag'
import {
  IconDownload,
  IconEye,
  IconInfoCircle,
  IconTrash,
} from '@tabler/icons-react'
import { downloadFileData } from '@/lib/utils'
import { AlertModal } from '@/components/custom/alert-modal'
import { Item } from './schema'
import { Checkbox } from '@/components/ui/checkbox'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Item
  editble: boolean
}

interface ItemsType {
  id: number
  name: string
}

interface ItemGroup {
  id: number
  name: string
}

interface ItemCategory {
  id: number
  name: string
}

interface Uom {
  id: string
  code: string
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  editble,
}) => {
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  const [uom, setUom] = useState<Uom[]>([])
  const [itemType, setType] = useState<ItemsType[]>([])
  const [itemGroup, setGroup] = useState<ItemGroup[]>([])
  const [itemCategory, setCategory] = useState<ItemCategory[]>([])
  const [locations, setLocation] = useState<LocationType[]>([])
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [deleteId, setdeleteId] = useState(null)

  const { setRefresh } = useContext(ApiContext) as ApiType

  function onCheckCombindFlag(e: any) {
    if (e) {
      data.combineMtFlag = false
    } else {
      data.combineMtFlag = true
    }

    console.log('onCheck:', e)
  }

  function onCheckLotControlFlag(e: any) {
    if (e) {
      data.lotControlFlag = false
    } else {
      data.lotControlFlag = true
    }
    console.log('onCheck:', e)
  }

  async function updateData(payload: any) {
    setOnloading(true)
    if (!payload.locationId) {
      //console.log('not found location id:', payload)
      payload.locationId = data.locationId
    }

    const typeName = itemType.find((x) => x.id == payload.itemTypeId)
    if (typeName) {
      payload.type = typeName.name
    }
    payload.lotControlFlag = data.lotControlFlag
    payload.combineMtFlag = data.combineMtFlag

    console.log('updateData:', payload)
    const res: any = await updateItem(payload)

    if (res.status == 200) {
      console.log('existingType:', data.type)

      if (data.type != 'Work in Process' && payload.type == 'Work in Process') {
        console.log('create wip')

        const res: any = await createWip(payload.id)
        console.log(res.data)
      }
    }
    setTimeout(() => {
      setOnloading(false)
      onClose()
      setRefresh(true)
    }, 1000)
  }

  
  async function uploadFile(file:any) {
    if (file.length>0) {
      setOnloading(true)
      const formData = new FormData()
      for (let i = 0; i < file?.length; i++) {
        formData.append('files', file[i])
        formData.append('itemMasterId', data.id.toString())
      }

      const res: any = await itemMasterUploadFiles(formData)
      if (res) {
        data.itemMasterFileAttach.length = 0
        for (let index = 0; index < res.length; index++) {
          data.itemMasterFileAttach?.push(res[index])
        }
        console.log('uploadFiles -success', res.status)
        
      }
      setTimeout(() => {
        setOnloading(false)
        
      }, 3000)
    }
  }

  async function downloadFile(filename: any) {
    const response: any = await itemMasterDownloadFileAttach(filename)
    downloadFileData(filename, response.data)
  }

  const openFile = (file: any) => {
    window.open(
      `http://tadthongback.c-space.store/files/ItemMaster/${file}`,
      '_blank',
      'noreferrer'
    )
  }

  function deleteAction(row: any) {
    setOpen(true)
    setdeleteId(row.id)
    setdeleteTitle(row.fileName)
    //console.log('deleteFile:', row.id)
  }

  async function deleteFile() {
    setOnloading(true)
    console.log('deleteFile:', deleteId)

    const res: any = await itemMasterDeleteFileAttach(deleteId)

    if (res.status == 200) {
      console.log('itemMasterDeleteFileAttach:', res)
      const deleteIndex = data.itemMasterFileAttach.findIndex(
        (x) => x.id == deleteId
      )
      if (deleteId != -1) {
        data.itemMasterFileAttach.splice(deleteIndex, 1)
      }
    }
    setTimeout(() => {
      setOnloading(false)
      setOpen(false)
    }, 1000)
  }

  useEffect(() => {
    setIsMounted(true)
    getUom().then((data) => setUom(data))
    getItemCategory().then((data) => setCategory(data))
    getItemGroup().then((data) => setGroup(data))
    getItemType().then((data) => setType(data))
    getLocation().then((data) => setLocation(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen  max-h-full overflow-scroll '>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Tabs defaultValue='general' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='general'>General Information</TabsTrigger>
                {/* <TabsTrigger value='planing'>Planing Information</TabsTrigger> */}
                <TabsTrigger value='file'>File Attached</TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit(updateData)}>
                <TabsContent value='general'>
                  <Card>
                    <CardContent className='h-full space-y-2'>
                      <div className='m-2 grid grid-cols-3 gap-2 rounded-md border p-4 shadow'>
                        <div className='col-span-3 mb-3 mt-3 flex items-center '>
                          <IconInfoCircle />
                          <Label htmlFor='terms' className='ml-3 text-lg'>
                            Information.
                          </Label>
                        </div>
                        <div className='col-span-3'>
                          <hr />
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
                        <div className='col-span-2 grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='Item Name'
                          >
                            Item Name
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('name')}
                            defaultValue={data.name}
                          />
                        </div>
                        <div className='col-span-3 grid'>
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
                            htmlFor='itemCategoryId'
                          >
                            Category
                          </Label>
                          <select
                            {...register('itemCategoryId')}
                            defaultValue={data.itemCategoryId}
                            // id={item.id}
                            // onChange={handleChangeBranch}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.itemCategory?.name}
                            >
                              {data.itemCategory?.name}
                            </option>
                            {itemCategory?.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='brand'
                          >
                            Brand
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('brand')}
                            defaultValue={data.brand}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='size'
                          >
                            Size
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('size')}
                            defaultValue={data.size}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='stockingUom'
                          >
                            Stocking-Uom
                          </Label>
                          <select
                            {...register('stockingUom')}
                            defaultValue={data.stockingUom}
                            // id={item.id}
                            // onChange={handleChangeBranch}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.stockingUom}
                            >
                              {data.stockingUom}
                            </option>
                            {uom.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.code}
                              >
                                {item.code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='alternateUom'
                          >
                            Alternate Uom
                          </Label>
                          <select
                            {...register('alternateUom')}
                            defaultValue={data.stockingUom}
                            // id={item.id}
                            // onChange={handleChangeBranch}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.alternateUom}
                            >
                              {data.alternateUom}
                            </option>
                            {uom.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.code}
                              >
                                {item.code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='convertFactor'
                          >
                            Convert Factor
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('convertFactor')}
                            defaultValue={data.convertFactor}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='model'
                          >
                            Model
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('model')}
                            defaultValue={data.model}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='feature'
                          >
                            Feature
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('feature')}
                            defaultValue={data.feature}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='material'
                          >
                            Material
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('material')}
                            defaultValue={data.material}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='specification'
                          >
                            Specification
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('specification')}
                            defaultValue={data.specification}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='itemTypeId'
                          >
                            Type
                          </Label>
                          <select
                            {...register('itemTypeId')}
                            defaultValue={data.itemTypeId}
                            // id={item.id}
                            // onChange={handleChangeBranch}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.itemType?.name}
                            >
                              {data.itemType?.name}
                            </option>
                            {itemType?.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='itemGroupId'
                          >
                            Group
                          </Label>
                          <select
                            {...register('itemGroupId')}
                            defaultValue={data.itemGroupId}
                            // id={item.id}
                            // onChange={handleChangeBranch}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.itemGroup?.name}
                            >
                              {data.itemGroup?.name}
                            </option>
                            {itemGroup?.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
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

                      <div className='m-2 grid grid-cols-3 gap-2 rounded-md border p-4 shadow'>
                        <div className='col-span-3 mb-3 mt-3 flex items-center '>
                          <IconInfoCircle />
                          <Label htmlFor='terms' className='ml-3 text-lg'>
                            Planing.
                          </Label>
                        </div>
                        <div className='col-span-3'>
                          <hr />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='purchaseLeadTime'
                          >
                            Purchase LeadTime
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('purchaseLeadTime')}
                            defaultValue={data.purchaseLeadTime}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='manufacturingLeadTime'
                          >
                            Manufacturing LeadTime
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('manufacturingLeadTime')}
                            defaultValue={data.manufacturingLeadTime}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='weight'
                          >
                            Weight
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('weight')}
                            defaultValue={data.weight}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='e'
                          >
                            Safety Stock
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('safetyStock')}
                            defaultValue={data.safetyStock}
                          />
                        </div>

                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='cubicVolumn'
                          >
                            Cubic Volumn
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('cubicVolumn')}
                            defaultValue={data.cubicVolumn}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='lenght'
                          >
                            Lenght
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('lenght')}
                            defaultValue={data.lenght}
                          />
                        </div>

                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='width'
                          >
                            Width
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('width')}
                            defaultValue={data.width}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='height'
                          >
                            Height
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('height')}
                            defaultValue={data.height}
                          />
                        </div>
                        <div className='grid'>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='itemCategoryId'
                          >
                            Defualt Location
                          </Label>
                          <select
                            {...register('locationId')}
                            defaultValue={data.locationId}
                            className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                          >
                            {/* <option
                              className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                              value={data.location?.id}
                            >
                              {data.location?.name}
                            </option> */}
                            {locations?.map((item) => (
                              <option
                                className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='shefLifeDay'
                          >
                            ShefLife Day
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('shefLifeDay')}
                            defaultValue={data.shefLifeDay}
                          />
                        </div>
                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='specialInstruction'
                          >
                            Special Instruction
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('specialInstruction')}
                            defaultValue={data.specialInstruction}
                          />
                        </div>

                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='standardCost'
                          >
                            Standard Cost
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('standardCost')}
                            defaultValue={data.standardCost}
                          />
                        </div>

                        <div className='grid '>
                          <Label
                            className='py-1 text-[0.8rem] text-muted-foreground'
                            htmlFor='averageCost'
                          >
                            Average Cost
                          </Label>
                          <Input
                            readOnly={editble}
                            className='text-[0.8rem]'
                            {...register('averageCost')}
                            defaultValue={data.averageCost}
                          />
                        </div>
                       
                        {/* <div className='grid grid-cols-3 gap-2 py-2'> */}
                        <div className='mt-6 flex items-start space-x-2 space-y-0 rounded-md border p-2 shadow'>
                          <Checkbox
                            id='combineMtFlag'
                            {...register('combineMtFlag')}
                            //id={data.id}
                            onCheckedChange={() =>
                              onCheckCombindFlag(data.combineMtFlag)
                            }
                            defaultChecked={data.combineMtFlag}
                          />
                          {/* <input
                              id='combineMtFlag'
                              type='checkbox' 
                              onChange={onCheckLotControlFlag} 
                             defaultChecked={data.combineMtFlag}
                             /> */}
                          <label
                            htmlFor='combineMtFlag'
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Combine Mt-Flag
                          </label>
                        </div>
                        <div className='mt-4 flex items-start space-x-2 space-y-0 rounded-md border p-2 shadow'>
                          <Checkbox
                            id='lotControlFlag'
                            {...register('lotControlFlag')}
                            defaultChecked={data.lotControlFlag}
                            onCheckedChange={() =>
                              onCheckLotControlFlag(data.lotControlFlag)
                            }
                          />
                          <label
                            htmlFor='lotControlFlag'
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Lot Control Flag
                          </label>
                        </div>

                        <br />
                       

                        <div className='col-span-3 float-end mt-6 grid'>
                          <Button
                            disabled={editble}
                            variant='button'
                            className='float-end '
                            loading={onloading}
                            type='submit'
                          >
                            Save changes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <br></br>
                  {/* <Button
                    variant='button'
                    className='float-end'
                    loading={onloading}
                    type='submit'
                  >
                    Save changes
                  </Button> */}
                </TabsContent>
              </form>
              <TabsContent value='file'>
                <Card className='min-h-full overflow-scroll '>
                  <CardContent className='h-[35rem] space-y-2'>
                    <div className='grid gap-4'>
                      <FileDrag uploadData={(e) => uploadFile(e)} />
                      {/* <div className='float-end'>
                        <Button
                          loading={onloading}
                          variant='button'
                          size='sm'
                          className='float-end h-8 w-36'
                          onClick={uploadFile}
                        >
                          <PlusCircleIcon className='mr-2 h-4 w-4' />
                          Confirm Upload
                        </Button>
                      </div> */}

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
                          {data.itemMasterFileAttach?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                {item.fileName}
                              </TableCell>

                              <TableCell className='w-[8rem]'>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() => downloadFile(item.path)}
                                >
                                  <IconDownload size={20} />
                                </Button>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() => openFile(item.path)}
                                >
                                  <IconEye size={20} />
                                </Button>

                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() => deleteAction(item)}
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
          onConfirm={deleteFile}
          loading={onloading}
          title={deleteTitle}
        />
      </Dialog>
    </>
  )
}
