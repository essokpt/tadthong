import { HTMLAttributes, SyntheticEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as xlsx from 'xlsx'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
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
import { Layout, LayoutBody } from '@/components/custom/layout'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { MaterilalType } from './type'
import { Separator } from '@/components/ui/separator'
import { createMaterial, createMaterialItem } from '@/services/materialApi'
import { format } from 'date-fns'

import { getLocation } from '@/services/locationApi'
import { LocationType } from '@/pages/location/components/type'
import { IconTrash } from '@tabler/icons-react'
import { PageHeader } from '@/components/layouts/header'
import { IconPencilPlus } from '@tabler/icons-react'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}

export function MaterialForm({ className, ...props }: SignUpFormProps) {
  const [material, setMaterial] = useState<MaterilalType[]>([])
  const [locations, setLocation] = useState<LocationType[]>([])
  const [selectLocation, setSelectLocation] = useState('')
  const [fileName, setFilename] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { handleSubmit, register } = useForm()

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files
    if (files.length) {
      const file = files[0]
      console.log('file:', file)
      setFilename(file.name)
      const reader = new FileReader()
      reader.onload = (event: any) => {
        const wb = xlsx.read(event.target.result)
        const sheets = wb.SheetNames
        if (sheets.length) {
          const rows: any = xlsx.utils.sheet_to_json(wb.Sheets[sheets[0]], {
            header: 1,
          })
          const newArray = []

          for (let index = 0; index < rows.length; index++) {
            let renamedObject: any = Object.assign(
              {},
              {
                importId: rows[index][0],
                queueNo: rows[index][1],
                cardNo: rows[index][2],
                carNo: rows[index][3],
                dateIn: rows[index][4],
                timeIn: rows[index][5],
                weightIn: rows[index][6],
                dateOut: rows[index][7],
                timeOut: rows[index][8],
                weightOut: rows[index][9],
                typeCode: rows[index][10],
                customerCode: rows[index][11],
                productCode: rows[index][12],
                col1: rows[index][13],
                col2: rows[index][14],
                col3: rows[index][15],
                remark: rows[index][16],
                priceReceipt: rows[index][17],
                col4: rows[index][18],
                col5: rows[index][19],
                col6: rows[index][20],
                col7: rows[index][21],
                col8: rows[index][22],
                col9: rows[index][23],
                col10: rows[index][24],
                col11: rows[index][25],
                col12: rows[index][26],
                col13: rows[index][27],
              }
            )

            newArray.push(renamedObject)
            console.log('newArray:', newArray)
          }
          setMaterial(newArray)
          //  console.log('s:', newArray)
        }
      }
      console.log('material:', material)

      reader.readAsArrayBuffer(file)
    }
    console.log('no read file')
  }

 
  function handleChangeRole(e: ChangeEvent<HTMLSelectElement>) {
    setSelectLocation(e.target.value)
  }

  async function onSubmit(data: any) {
    setIsLoading(true)
    const userid: any = localStorage.getItem('userId')
    const branchid: any = localStorage.getItem('branchId')
    let today = new Date()
    let importCode = format(today, 'yyyy-MM-dd')
    let genCode = importCode.split("-")
    const locationID:any = locations.find(item => item.name == selectLocation)

    data.code = `IMPORT-${genCode[0]}${genCode[1]}${genCode[2]}-`
    data.importDate = format(today, 'yyyy-MM-dd')
    data.userId = parseInt(userid)
    data.branchId = parseInt(branchid)
   // data.materials = material
    data.approveDate = ''
    data.locationId = locationID.id

    data.stockIn = selectLocation
    data.fileName = fileName
  

    const res:any = await createMaterial(data)
    if (res.data.id) {
      data.id = res.data.id
      console.log('res data', res)
      console.log('material data', material)
      const response: any = await createMaterialItem(res.data.id, material)
      if (response.status == 200) {
        console.log("createMaterialItem",response.data)
      }
        setTimeout(() => {
          setIsLoading(false)
          navigate('/material', { replace: true })
        }, 1000)
    //}
  }
   
  }

  useEffect(() => {
    getLocation().then((data) => setLocation(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
       
        <PageHeader
          label='Import Weight Scale Data'
          icon={<IconPencilPlus size={45} className='mt-2 ' />}
        />

        <div className={cn('grid gap-4', className)} {...props}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-3 gap-2 '>
              <div className='grid'>
                <Label
                  className='py-1 text-[0.8rem] text-muted-foreground'
                  htmlFor='Import Excel file'
                >
                  Import Excel file
                </Label>

                <Input
                  id='material'
                  type='file'
                  name='file'
                  onChange={handleImport}
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
                  readOnly
                  className='text-[0.8rem]'
                  {...register('code')}
                  defaultValue='IMPORT-XXX'
                />
              </div>

              <div className='grid'>
                <Label
                  className='py-1 text-[0.8rem] text-muted-foreground'
                  htmlFor='remark'
                >
                  Status
                </Label>
                <Input
                  readOnly
                  className='text-[0.8rem]'
                  {...register('status')}
                  defaultValue='New'
                />
              </div>
              <div>
                <Label
                  className='py-1 text-[0.8rem] text-muted-foreground'
                  htmlFor='location'
                >
                  Location
                </Label>
                <select
                  //id={item.id}
                  onChange={handleChangeRole}
                  className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                >
                  <option
                    className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    //value={item.id}
                  >
                    {/* {item.roleBranches.name} */}
                  </option>
                  {locations.map((item) => (
                    <option
                      className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                      value={item.name}
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
                  Remark
                </Label>
                <Input
                  className='text-[0.8rem]'
                  {...register('remark')}
                  
                />
              </div>

              <br />
              {/* ) : ( */}
              <Separator />
              <br />
            </div>
            <div className='grid grid-cols-1 gap-2 '>
              <div className='grid'>
                <Label>Material Import Information.</Label>
                <Table className='w-[160rem] mt-2'>
                  <TableCaption>A list of your recent items.</TableCaption>
                  <TableHeader>
                  <TableRow>
                      <TableHead>Import ID (Ident)</TableHead>
                      <TableHead className='w-[6rem]'>เลขที่ชั่งเข้า (ticket1)</TableHead>
                      <TableHead className='w-[6rem]'>เลขที่ชั่งออก (ticket2)</TableHead>
                      <TableHead className='w-[6rem]'>ทะเบียนรถ (truck)</TableHead>
                      <TableHead>วันชั่งเข้า (datein)</TableHead>
                      <TableHead>เวลาชั่งเข้า (timein)</TableHead>
                      <TableHead className='w-[6rem]'>น้ำหนักชั่งเข้า (w1)</TableHead>
                      <TableHead>วันชั่งออก (dateout)</TableHead>
                      <TableHead>เวลาชั่งออก (timeout)</TableHead>
                      <TableHead className='w-[6rem]'>น้ำหนักชั่งออก (w2)</TableHead>
                      <TableHead>ประเภท (code1)</TableHead>
                      <TableHead>บริษัท (code2)</TableHead>
                      <TableHead>สินค้า (code3)</TableHead>
                      <TableHead>การขนส่ง (code4)</TableHead>
                      <TableHead>ความชื้น% (remark1)</TableHead>
                      <TableHead>สิ่งเจือปน% (remark2)</TableHead>
                      <TableHead>หมายเหตุ (remark3)</TableHead>
                      <TableHead>ราคา (price)</TableHead>
                      <TableHead className='w-[6rem]'>หักความชื้น (adj_w1)</TableHead>
                      <TableHead className='w-[6rem]'>หักสิ่งเจือปน (adj_w2)</TableHead>
                      <TableHead>หักอื่นๆ (adj_w3)</TableHead>
                      <TableHead className='w-[6rem]'>หักเงินค่าชั่ง (adj_m1)</TableHead>
                      <TableHead>หักค่าลง  (adj_m2)</TableHead>
                      <TableHead className='w-[6rem]'>หักเงินอื่นๆ  (adj_m3)</TableHead>
                      <TableHead>Print 1 (print1)</TableHead>
                      <TableHead>Print 2 (print2)</TableHead>
                      <TableHead>CheckSum (chksum)</TableHead>
                      <TableHead>Status (status)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {material?.map((item) => (
                      <TableRow key={item.queueNo}>
                        <TableCell>{item.importId}</TableCell>
                        <TableCell>{item.queueNo}</TableCell>
                        <TableCell>{item.cardNo}</TableCell>
                        <TableCell > {item.carNo}
                        </TableCell>
                        <TableCell>{item.dateIn}</TableCell>
                        <TableCell>{item.timeIn}</TableCell>

                        <TableCell>{item.weightIn}</TableCell>
                        <TableCell>{item.dateOut}</TableCell>
                        <TableCell>{item.timeOut}</TableCell>
                        <TableCell>{item.weightOut}</TableCell>
                        <TableCell>{item.typeCode}</TableCell>

                        <TableCell>{item.customerCode}</TableCell>
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
                        <TableCell>
                          <IconTrash
                            size={20}
                            onClick={() =>  setMaterial(
                              material.filter(a => 
                                a.queueNo !== item.queueNo
                                )
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter></TableFooter>
                </Table>
              </div>
              <div className='mt-5 grid'>
                <Button className='float-end mt-2 w-full' loading={isLoading} variant='button'>
                  Create
                </Button>
              </div>
            </div>
          </form>
        </div>
      </LayoutBody>
    </Layout>
  )
}
