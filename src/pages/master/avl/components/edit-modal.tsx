import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

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
import { VenderType } from '../../vender/components/type'
import { getVenders } from '@/services/vendersApi'
import { ExclamationTriangleIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { createVenderItem } from '@/services/itemApi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avl } from './schema'
import { PriceDataTable } from '../priceTable/priceDataTable'
import { columns } from '../priceTable/columns'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  data: Avl
}

// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const editdata: Avl = data
  const [isMounted, setIsMounted] = useState(false)
  const [onLoading, setOnLoading] = useState(false)

  const [alert, setAlert] = useState('')
  const { handleSubmit, register } = useForm()
  const [venders, setVender] = useState<VenderType[]>([])

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     selectVender: '',
  //   },
  // })

  async function updateData(data: any) {
    data.itemMasterId = editdata.id
    setOnLoading(true)
    console.log('createVenderItem', data)
    setAlert("")
    const respone: any = await createVenderItem(data)
    if (respone.status == 400) {
      setOnLoading(false)
      setAlert(respone.data)
      console.log('Create error:', respone.data)
    }
    else if (respone.id) {
      console.log('createVenderItem success')
      editdata.itemVenderLists.push(respone)
    }

    setTimeout(() => {
      setOnLoading(false)     
    }, 1000)
  }

  // function handleChangeCost(e: ChangeEvent<HTMLInputElement>) {
  //   const changeItem: any = data.itemVenderLists.findIndex(
  //     (item) => item.id == e.target.id
  //   )
  //   data.itemVenderLists[changeItem].cost = parseFloat(e.target.value)
  //   console.log('handleChangeCost value', data.itemVenderLists[changeItem])
  // }

  // async function updateVenderItem(id: any) {
  //   setIsLoading(true)
  //   const updateItem = data.itemVenderLists.findIndex((item) => item.id == id)
  //   console.log('updateVenderItem:', data.itemVenderLists[updateItem])

  //   if (updateItem != -1) {
  //     const res: any = await updateItemVender(data.itemVenderLists[updateItem])

  //     if (res.status == 200) {
  //       console.log('updateVenderItem success')
  //     }
  //   }
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 1000)
  // }


  

  useEffect(() => {
    setIsMounted(true)
    getVenders().then((data) => setVender(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen h-full overflow-scroll'>
          <DialogHeader>
            <DialogTitle>Edit AVL</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Tabs defaultValue='general' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='general'>Item Information</TabsTrigger>
                <TabsTrigger value='materiallist'>Venders List</TabsTrigger>
              </TabsList>
              <TabsContent value='general'>
                <Card>
                  <CardContent className='h-[30rem] space-y-2'>
                    <div className='grid grid-cols-2 gap-2 '>
                      <div className='grid'>
                        <Label
                          className='py-1 text-[0.8rem] text-muted-foreground'
                          htmlFor='code'
                        >
                          Item Code
                        </Label>
                        <Input
                          readOnly
                          className='text-[0.8rem]'
                          defaultValue={editdata.code}
                        />
                      </div>
                      <div className='grid'>
                        <Label
                          className='py-1 text-[0.8rem] text-muted-foreground'
                          htmlFor='name'
                        >
                          Item Name
                        </Label>
                        <Input
                          readOnly
                          className='text-[0.8rem]'
                          defaultValue={editdata.name}
                        />
                      </div>
                      <div className='col-span-2 grid'>
                        <Label
                          className='py-1 text-[0.8rem] text-muted-foreground'
                          htmlFor='description'
                        >
                          Description
                        </Label>
                        <Input
                          readOnly
                          className='text-[0.8rem]'
                          defaultValue={editdata.description}
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
                      <form onSubmit={handleSubmit(updateData)}>
                        <div hidden={!alert}>
                          <Alert variant='destructive'>
                            <ExclamationTriangleIcon className='h-4 w-4' />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{alert}</AlertDescription>
                          </Alert>
                        </div>
                        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                          <div className='grid'>
                            <Label
                              className='py-1 text-[0.8rem] text-muted-foreground'
                              htmlFor='type'
                            >
                              Venders List
                            </Label>
                            <select
                              {...register('venderId')}
                              // id={item.id}
                              // onChange={handleChangeBranch}
                              className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                            >
                              {venders.map((item) => (
                                <option
                                  className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                  key={item.id}
                                  value={item.id}
                                >
                                  {item.code} {item.companyName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className='grid'>
                            <Label
                              className='py-1 text-[0.8rem] text-muted-foreground'
                              htmlFor='address'
                            >
                              Cost
                            </Label>
                            <Input
                              className='w-[100px]'
                              type='float'
                              {...register('cost')}
                              // onChange={handleChangePrice}
                            />
                          </div>
                          <div className='grid'>
                            <Label
                              className='py-1 text-[0.8rem] text-muted-foreground'
                              htmlFor='address'
                            >
                              Remark
                            </Label>
                            <Input
                              className='w-[300px]'
                              type='float'
                              {...register('remark')}
                              // onChange={handleChangePrice}
                            />
                          </div>

                          <Button
                            loading={onLoading}
                            variant='button'
                            size='sm'
                            type='submit'
                            className='float-end mt-8 h-8'
                          >
                            <PlusCircledIcon className='mr-2 h-4 w-4' />
                            New
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* <Table>
                      <TableCaption>
                        A list of your recent venders.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-[200px]'>
                            Vender code
                          </TableHead>
                          <TableHead className='w-[300px]'>
                            Company Name
                          </TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Remark</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editdata.itemVenderLists?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className='w-[10rem] text-left'>
                              {item.vender?.code}
                            </TableCell>
                            <TableCell className='w-[20rem] text-left'>
                              {item.vender?.companyName}
                            </TableCell>
                            <TableCell>
                              <Input
                                className='w-[10rem]'
                                type='float'
                                id={item.id}
                                defaultValue={item.cost?.toFixed(2)}
                                onChange={handleChangeCost}
                              />
                            </TableCell>
                            <TableCell>{item.remark}</TableCell>
                            <TableCell>
                              <Button
                                loading={isLoading}
                                size='icon'
                                variant='ghost'
                                className='rounded-full'
                                onClick={() => updateVenderItem(item.id)}
                              >
                                <IconDeviceFloppy size={20} />
                              </Button>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='rounded-primary rounded-full'
                                onClick={() =>
                                  deleteItemVender(item)
                                }
                              >
                                <IconTrash size={20} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> */}

                    <PriceDataTable data={editdata.itemVenderLists} columns={columns} />

                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              {/* <Button loading={loading} type='submit'>
                Save changes
              </Button> */}
            </DialogFooter>
          </div>
        </DialogContent>
      
      </Dialog>
    </>
  )
}
