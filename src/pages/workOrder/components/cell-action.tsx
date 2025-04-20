import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import logo from '@/assets/logo.jpg'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkOrder } from './schema'
import { Edit, Trash } from 'lucide-react'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
import { deleteWorkOrder } from '@/services/workOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconEye, IconPrinter, IconSettingsDown } from '@tabler/icons-react'
import usePermission from '@/hooks/use-permission'
import 'jspdf-autotable'
import { jsPDF } from 'jspdf'

interface DataTableRowActionsProps {
  row: WorkOrder
}

const initialValue = {
  id: '',
  selectLocation: '',
  selectItem: '',
  unit: '',
  createBy: '',
  code: '',
  quantity: 0,
  received: 0,
  receiveRequest: 0,
  balance: 0,
  createAt: '',
  userId: '',
  locationId: 0,
  location: {
    id: 0,
    name: '',
    warehouseId: 0,
  },
  user: {
    firstName: '',
  },
  itemMasterId: 0,
  itemMaster: {
    code: '',
    name: '',
    stockingUom: '',
    specification: '',
  },
  remark: '',
  status: '',
  cause: '',
  workOrderUsages: [
    {
      id: '',
      itemMaster: {
        code: '',
        name: '',
        specification: '',
        standardCost: 0,
        stockingUom: '',
      },
      quantity: 0,
      pickingQuantity: 0,
      pickingRequest: 0,
      pickingDate: '',
      pickingBalance: 0,
      remark: '',
      status: '',
    },
  ],
  workOrderFileAttach: [
    {
      id: 0,
      fileName: '',
      path: '',
    },
  ],
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [printX, setPrintX] = useState(0)
  const [printY, setPrintY] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<WorkOrder>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('workOrder')

  function updateAction(row: any) {
    row.selectLocation = row.location?.name
    row.selectItem = row.itemMaster?.name
    row.createBy = row.user.firstName

    setEditValue(row)
    setIsEdit(true)
    console.log('update row', row)
  }

  const onConfirm = async () => {
    setLoading(true)
    const res: any = await deleteWorkOrder(deleteId)
    if (res.status == 200) {
      console.log('deleteWorkOrder -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  }

  async function deleteAction(row: any) {
    setOpen(true)
    setDeleteId(row.id)
    setdeleteTitle(row.code)
  }

  function closeEditModal() {
    setIsEdit(false)
    setRefresh(true)
  }

  async function print(data: WorkOrder) {
    console.log('Print value:', data)

    const doc = new jsPDF()
    setPrintX(0)
    setPrintY(10)
    printHeader(doc, data)
    doc.output('dataurlnewwindow')
  }

  function printHeader(doc: any, value: WorkOrder) {
    let bodyItems = []
    for (let index = 0; index < value.workOrderUsages.length; index++) {
      let item = [
        index + 1,
        value.workOrderUsages[index].itemMaster.code,
        value.workOrderUsages[index].itemMaster.name,
        value.workOrderUsages[index].quantity,
        value.workOrderUsages[index].itemMaster.stockingUom,
        value.workOrderUsages[index].itemMaster.standardCost,
        value.workOrderUsages[index].quantity *
          value.workOrderUsages[index].itemMaster.standardCost,
      ]
      bodyItems.push(item)
    }

    for (let index = 0; index < 5; index++) {
      bodyItems.push(['', '', '', '', '', '', '', ''])
    }

    //summary
    // bodyItems.push(['','','','','Total', editValue.total,editValue.sumVat, editValue.amount]);

    doc.addImage(logo, 'JPG', 15, 5, 30, 30)
    doc.setFont('Sarabun-Regular', 'normal')
    doc.rect(printX + 109, printY + 2, 87, 15)
    doc.line(printX + 165, printY + 2, printX + 165, printY + 17)
    doc.line(printX + 165, printY + 10, printX + 196, printY + 10)

    doc.setFontSize(25)
    doc.text('Job Order', printX + 115, printY + 10)
    doc.setFontSize(10)
    doc.text('ใบสั่งผลิต', printX + 128, printY + 15)
    doc.text('เลขที่เอกสาร', printX + 170, printY + 7)

    doc.rect(14, printY + 40, 182, 45)
    doc.line(printX + 107, printY + 40, printX + 107, printY + 85)

    //setPrintY(printY+20)
    doc.setFontSize(10)
    doc.text('ชื่อสินค้า', printX + 15, printY + 45)
    doc.text('Product Name', printX + 15, printY + 50)

    doc.text('วันที่เริ่มผลิต', printX + 109, printY + 45)
    doc.text('Start Date', printX + 109, printY + 50)

    doc.text('จำนวนที่สั่งผลิต', printX + 153, printY + 45)
    doc.text('Order Quantity', printX + 153, printY + 50)

    //Line 2
    doc.text('รหัสสินค้า', printX + 15, printY + 60)
    doc.text('Product No.', printX + 15, printY + 65)

    doc.text('วันที่ผลิตเสร็จ', printX + 109, printY + 60)
    doc.text('Completed Date', printX + 109, printY + 65)

    doc.text('จำนวนที่ผลิตได้', printX + 153, printY + 60)
    doc.text('Completed Quantity', printX + 153, printY + 65)

    //Line 3
    doc.text('หน่วยสินค้า', printX + 15, printY + 75)
    doc.text('Product Unit.', printX + 15, printY + 80)

    doc.text('ระยะเวลาที่ใช้', printX + 109, printY + 75)
    doc.text('Time of Production', printX + 109, printY + 80)

    doc.text('หมายเลขล็อต', printX + 153, printY + 75)
    doc.text('Lot/Batch No.', printX + 153, printY + 80)

    doc.autoTable({
      startY: printY + 95,
      theme: 'grid',
      bodyStyles: {
        font: 'Sarabun-Regular',
        lineColor: [0, 0, 0],
      },
      headStyles: {
        font: 'Sarabun-Regular',
        lineColor: [0, 0, 0],
        halign: 'center',
        valign: 'middle',
        // cellPadding: 1.5
      },
      columnStyles: {
        0: { halign: 'center', valign: 'middle', cellWidth: 23 },
        1: { halign: 'center', valign: 'middle', cellWidth: 75 },
        2: { halign: 'center', valign: 'middle', cellWidth: 20 },
        3: { halign: 'left', valign: 'middle', cellWidth: 20 },
        4: { halign: 'right', valign: 'middle', cellWidth: 26 },
        5: { halign: 'right', valign: 'middle', cellWidth: 20 },
      },
      head: [
        [
          'รหัสวัตถุดิบ',
          'รายการวัตถุดิบ',
          'จำนวน',
          'หน่วยนับ',
          'มูลค่าต่อหน่วย',
          'มูลค่ารวม',
        ],
      ],
      body: bodyItems,
    })

    let finalY = doc.lastAutoTable.finalY || 5
    finalY = finalY + 50
    doc.rect(14, printY + 195, 184, 53)
    doc.line(printX + 132, printY + 195, printX + 132, printY + 248)

    doc.text('หมายเหตุ : ', printX + 15, printY + 200)

    //line 1
    doc.setFontSize(9)
    doc.text('สินค้าที่ผลิตได้ทั้งหมด', printX + 134, printY + 200)
    doc.text('รายการ', printX + 185, printY + 200)

    doc.setFontSize(8)
    doc.text('Total Quantity', printX + 134, printY + 204)
    doc.text('Unit', printX + 185, printY + 204)

    //line 2
    doc.setFontSize(9)
    doc.text('วัตถุดิบรวม', printX + 134, printY + 210)
    doc.text('รายการ', printX + 185, printY + 210)

    doc.setFontSize(8)
    doc.text('Total Raw Material', printX + 134, printY + 214)
    doc.text('Unit', printX + 185, printY + 214)

    //line 3
    doc.setFontSize(9)
    doc.text('ค่าแรงทางตรง', printX + 134, printY + 220)
    doc.text('บาท/ชั่งโมง', printX + 180, printY + 220)

    doc.setFontSize(8)
    doc.text('Direc Labour Cost', printX + 134, printY + 224)
    doc.text('Baht per hour', printX + 180, printY + 224)

    //line 4
    doc.setFontSize(9)
    doc.text('ค่าใช้จ่ายในการผลิต', printX + 134, printY + 230)
    doc.text('บาท/หน่วย', printX + 180, printY + 230)

    doc.setFontSize(8)
    doc.text('Production Expenses', printX + 134, printY + 234)
    doc.text('Baht per unit', printX + 180, printY + 234)

    //line 5
    doc.setFontSize(9)
    doc.text('ต้นทุนสินค้าต่อหน่วย', printX + 134, printY + 240)
    doc.text('บาท/หน่วย', printX + 180, printY + 240)

    doc.setFontSize(8)
    doc.text('Production Cost Per Unit', printX + 134, printY + 244)
    doc.text('Baht per unit', printX + 180, printY + 244)

    //footer
    // doc.rect(14,finalY+58,184,53)

    doc.rect(14, printY + 250, 184, 30)
    doc.line(printX + 72, printY + 250, printX + 72, printY + 280)
    doc.line(printX + 135, printY + 250, printX + 135, printY + 280)

    doc.setFontSize(10)
    doc.line(printX + 19, printY + 265, printX + 68, printY + 265)
    doc.text('ผู้อนุมัติ/Authorzed Signature ', printX + 22, printY + 270)
    doc.text('วันที่/Date ', printX + 17, printY + 278)
    doc.line(printX + 32, printY + 278, printX + 68, printY + 278)

    doc.line(printX + 75, printY + 265, printX + 130, printY + 265)
    doc.text('ผู้ตรวจสอบ/Inspector Signature ', printX + 77, printY + 270)
    doc.text('วันที่/Date ', printX + 75, printY + 278)
    doc.line(printX + 90, printY + 278, printX + 130, printY + 278)

    doc.line(printX + 140, printY + 265, printX + 192, printY + 265)
    doc.text('ผู้ดำเนินการผลิต/Production Signature ', printX + 137, printY + 270)
    doc.text('วันที่/Date ', printX + 137, printY + 278)
    doc.line(printX + 152, printY + 278, printX + 192, printY + 278)

    // doc.text('ผู้ส่งสินค้า ', printX + 75, printY + 260)
    // doc.line(printX + 90, printY + 260, printX + 130, printY + 260)
    // doc.text('ลงวันที่ ', printX + 75, printY + 270)
    // doc.line(printX + 90, printY + 270, printX + 130, printY + 270)

    // doc.text('ลงวันที่', printX + 137, printY + 257)
    // doc.line(printX + 140, printY + 270, printX + 190, printY + 270)
    // doc.text('ผู้มีอำนาจลงนาม', printX + 155, printY + 275)
  }

  return (
    <>
      <EditModal isOpen={isEdit} onClose={closeEditModal} data={editValue} />
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconSettingsDown className='h-4 w-4 text-button' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={
              row.status == 'Cancle' ||
              row.status == 'Completed' ||
              !rule[0]?.canView
            }
            onClick={() => print(row)}
          >
            <IconPrinter className='mr-2 h-4 w-4' /> Print
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Cancle' ||
              row.status == 'Completed' ||
              !rule[0]?.canView
            }
            onClick={() => updateAction(row)}
          >
            <IconEye className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Cancle' ||
              row.status == 'Completed' ||
              !rule[0]?.canUpdate
            }
            onClick={() => updateAction(row)}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Cancle' ||
              row.status == 'Completed' ||
              !rule[0]?.canDelete
            }
            onClick={() => deleteAction(row)}
          >
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
