import { Layout, LayoutBody } from '@/components/custom/layout'
// import { DataTable } from './components/data-table'
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { IconDeviceFloppy, IconReportAnalytics } from '@tabler/icons-react'

import { getWip, searchWip, updateWipValue } from '@/services/itemApi'
import { Wip } from '../components/wip-schema'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { ToolBar } from './toolbar'
import { Loading } from '@/components/custom/loading'
import { format } from 'date-fns'
import { PageHeader } from '@/components/layouts/header'
import { createInventory, createInventoryHistory } from '@/services/inventoryApi'

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T
}
// noted
// 1 -> ยอดยกมา: ยอดยกมาแต่ละวันจะเอามาจากยอดยกไปของวันก่อนหน้า (แก้ไขไม่ได้)
// 2 -> ผลิตเพิ่ม : ผลิตเพิ่มมาจากสูตร คือ ผลิตเพิ่ม = ยอดยกไป + ยอดตัดออก – ยอดยกมา (แก้ไขไม่ได้)
// 3 -> ยอดตัดออก : นำมาจากยอดการตัดใช้ WIP ในวันนั้นๆ (แก้ไขไม่ได้)
// 4 -> ยอดยกไป : ยอดยกไปทางผู้ใช้งานจะมา Key ตัวเลข Manual

//
const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear()

export default function WIP() {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [data, setData] = useState<Wip[]>([])
  const [dateOfMonth, setDateOfMonth] = useState([])
  const [monthLabel, setMonthLabel] = useState()
  const { refresh, setRefresh } = useContext(ApiContext) as ApiType

  const updateItem = async (item: any) => {
    console.log('updateItem:', item)
    const res: any = await updateWipValue(item)

    if (res.status == 200) {
      console.log('updateItem:', res.data)
      //add to stock onhand
      const stock = {
        itemMasterId : res.data.item.id,
        locationId : res.data.item.locationId,
        warehouseId : res.data.item.location.warehouseId,
        branchesId : localStorage.getItem('branchId'),
        receiveQuantity : res.data.newProductionValue,
        unit : 'pcs',
      }
      console.log('add stock:', [stock])

      await createInventory([stock])
      
      //save stock history
      const history = {
      
        StockType : 'WIP',
        Ref : res.data.item.code,
        StockBy : localStorage.getItem('user'),
        ReceiveQuantity : res.data.newProductionValue,
        Unit : 'pcs',
        Status : 'WIP',
        ItemMasterId : res.data.item.id,
        LocationId : res.data.item.locationId,
        warehouseId : res.data.item.location.warehouseId,
        branchesId : localStorage.getItem('branchId'),
      }

      await createInventoryHistory([history])
      setRefresh(true)
    }
  }

  const handleChangeMonth = (e:any) => {
    console.log("handleChangeMonth", e);
    setSelectedMonth(parseInt(e))
    getData(parseInt(e), selectedYear);
  }

  const handleChangeYear = (e:any) => {
    console.log("handleChangeYear", e);
    setSelectedYear(parseInt(e))
    getData(selectedMonth,parseInt(e));
  }

  function handleChangeItemValue(e: ChangeEvent<HTMLInputElement>) {
    const value: any = parseInt(e.target.value)
    data[parseInt(e.target.id)].wips[3].wipValues[
      parseInt(e.target.name)
    ].value = value
    console.log('handleChangeItemValue name', e.target.name)
  }

  const getData = (month: number, year: number) => {
    //setData([])
    console.log('get wip data', month, year)

    getWip(month, year).then((data) => {
      setMonthLabel(data.month)
      setData(data.data)
      setDateOfMonth(data.dateOfMonth)
    })

    setRefresh(false)
  }

  const queryData = (str: any) => {
    setData([])
    if (str == '') {
      getData(currentMonth, currentYear)
    } else {
      searchWip(str).then((data) => setData(data))
    }
  }

  const compareDate = (item: any, wipValue: any, level: any, index: any) => {
    let findValue = wipValue.find((x: any) => x.date == item)
    let indexValue = wipValue.findIndex((x: any) => x.date == item)
    if (findValue) {
      return (
        <TableCell className='item-center w-[6rem]' key={findValue.id}>
          {level != 4 ? (
            findValue.value
          ) : (
            <div className='item-center'>
              <Input
                disabled={parseInt(findValue.value) > 0}
                className='w-[65px]'
                type='number'
                id={index.toString()}
                name={indexValue.toString()}
                defaultValue={findValue.value}
                onChange={handleChangeItemValue}
              />
              <Button
                disabled={parseInt(findValue.value) > 0}
                size='icon'
                variant='ghost'
                className='rounded-full'
                onClick={() => updateItem(findValue)}
              >
                
                <IconDeviceFloppy size={20} className='text-cyan-400'/>
              </Button>
            </div>
          )}
        </TableCell>
      )
    } else {
      return <TableCell className='w-[13rem]'></TableCell>
    }
  }

  useEffect(() => {
    getData(currentMonth, currentYear)
    
  }, [refresh])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
       
        <PageHeader
          label='WIP'
          icon={<IconReportAnalytics size={45} className='mt-2 ' />}
        />
        <ToolBar 
          queryData={(e) => queryData(e)} 
          filterMonth={(e) => handleChangeMonth(e)} 
          filterYear={(e) => handleChangeYear(e)}
          link='' 
        />

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {/* <FullCalendarDemo /> */}
          {/* <FullCalendarDemo2 /> */}
          <Table className='w-[210rem]'>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className='w-[30rem]'>
                  สินค้า WIP{' '}
                </TableHead>
                <TableHead rowSpan={2} className='w-[15rem]'> รายการ </TableHead>
                
                <TableHead
                  colSpan={dateOfMonth.length - 2}
                  className='text-center'
                >
                  {' '}
                  {monthLabel}{' '}
                </TableHead>
              </TableRow>
              <TableRow>
                {/* {[...Array(7)].map((_, i) => (
                  <TableHead key={i}>{i + 1}</TableHead>
                ))} */}
                {dateOfMonth.map((value, index) => (
                  <TableHead key={index}>
                    {format(value, 'dd')}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data?.map((wip, index) => (
                  <React.Fragment key={index}>
                    {wip.wips.map((item, itemIndex) => (
                      <TableRow key={itemIndex} >
                        {itemIndex === 0 && (
                          <TableCell rowSpan={wip.wips.length}>
                            {wip.code}-{wip.name}
                          </TableCell>
                        )}
                        <TableCell>{item.name}</TableCell>
                        {dateOfMonth.map((value) =>
                          compareDate(value, item.wipValues, item.level, index)
                        )}
                        {/* {item.wipValues.map((value, valueIndex) => (
                          <TableCell key={value.id}>
                            { item.level != 4 ? (
                                 value.date
                            ) : (
                              <div className='item-center'>
                                <Input
                                 disabled={parseInt(value.value) > 0}
                                  className='w-[70px]'
                                  type='number'
                                  id={index.toString()}
                                  name={valueIndex.toString()}
                                  defaultValue={value.value}
                                  onChange={handleChangeItemValue}
                                />
                                <Button
                                  disabled={parseInt(value.value) > 0}
                                  size='icon'
                                  variant='ghost'
                                  className='rounded-full'
                                  onClick={() => updateItem(value)}
                                >
                                  <IconRefresh size={20} />
                                </Button>
                              </div>
                              )} 
                          </TableCell>
                        ))} */}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={14} className='h-24 text-center'>
                    <Loading timeout={500} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </LayoutBody>
    </Layout>
  )
}
