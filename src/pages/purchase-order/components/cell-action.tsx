import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PurchaseOrder } from './schema'
import { Edit, Trash } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { EditModal } from './edit-modal'
import { ApproveModal } from '@/components/custom/approve-modal'

import {
  deletePurchaseOrder,
  sendPurchaseOrderApprove,
} from '@/services/purchaseOrderApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { IconPrinter, IconSettingsDown } from '@tabler/icons-react'
import 'jspdf-autotable'
import { jsPDF } from 'jspdf'
import logo from '@/assets/logo.jpg'
import '@/assets/fonts/Sarabun-Regular-normal'
import { findCompany } from '@/services/companyApi'
import { CompanyType } from '@/pages/master/company/components/type'
import usePermission from '@/hooks/use-permission'

interface DataTableRowActionsProps {
  row: PurchaseOrder
}

const initialValue = {
  id: '',
  code: '',
  description: '',
  refPr: '',
  createAt: '',
  userId: '',
  approveBy: '',
  venderId: '',
  received: 0,
  balance: 0,
  cause: '',
  currency: '',
  paymentTerm: '',
  paymentType: '',
  deliveryDate: '',
  branchId: 0,
  amount: 0,
  discount: 0,
  vat: 0,
  vender: {
    code: '',
    companyName: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    zipcode: '',
    country: '',
    paymentType: '',
    phone: '',
    phoneExt: '',
    fax: '',
    faxExt: '',
    tax: '',
    email: '',
    contactName: '',
    venderBillings: {
      id: 0,
      code: '',
      name: '',
      address: '',
      district: '',
      subDistrict: '',
      province: '',
      zipcode: '',
      country: '',
      phone: '',
    },
  },
  user: {
    firstName: '',
  },
  locationId: 0,
  location: {
    id: 0,
    name: '',
  },
  remark: '',
  status: '',
  purchaseOrderItems: [],
  purchaseOrderFileAttach: [
    {
      id: 0,
      fileName: '',
      path: '',
    },
  ],
}

// const initialApprove = {
//   id: 0,
//   code: '',
//   name: '',
// }

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openApprove, setOpenApprove] = useState(false)
  const [approveId, setApproveId] = useState(null)
  const [printX, setPrintX] = useState(0)
  const [printY, setPrintY] = useState(0)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [approveTitle, setApproveTitle] = useState(null)
  const [company, setCompany] = useState<CompanyType>()
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<PurchaseOrder>(initialValue)

  const { setRefresh } = useContext(ApiContext) as ApiType

  const rule: any = usePermission('purchaseOrder')

  function closeEditModal() {
    setIsEdit(false)
    setRefresh(true)
  }

  function updateAction(row: any) {
    setIsEdit(true)
    setEditValue(row)
    console.log('update row', row)
  }

  function approveAction(row: any) {
    setOpenApprove(true)
    //setApproveMatId(row)
    setApproveId(row.id)
    setApproveTitle(row.code)
    console.log('Approve data', row)
  }

  const onConfirm = async () => {
    setLoading(true)
    const res: any = await deletePurchaseOrder(approveId)
    if (res.status == 200) {
      console.log('deletePurchaseOrder -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  }

  const sendApprove = async () => {
    setLoading(true)

    console.log('sendApprove', approveId)
    const res: any = await sendPurchaseOrderApprove(approveId)
    if (res.status == 200) {
      console.log('sendPurchaseOrderApprove -success', res.status)
      setTimeout(() => {
        setLoading(false)
        setOpen(false)
        setOpenApprove(false)
        setRefresh(true)
      }, 1000)
    }
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      setOpenApprove(false)
    }, 1000)
  }

  async function deleteAction(row: any) {
    setOpen(true)
    setApproveId(row.id)
    setdeleteTitle(row.code)
  }

  async function print(data: PurchaseOrder) {
    console.log('Print value:', data)
    findCompany(1).then((data) => {
      setCompany(data)
    })
    setEditValue(data)
    const doc = new jsPDF()
    setPrintX(0)
    setPrintY(10)
    printHeader(doc)
    doc.output('dataurlnewwindow')
  }

  function printHeader(doc: any) {
    let bodyItems = []
    for (let index = 0; index < editValue.purchaseOrderItems.length; index++) {
      let item = [
        index + 1,
        editValue.purchaseOrderItems[index].itemMaster.code,
        editValue.purchaseOrderItems[index].itemMaster.name,
        editValue.purchaseOrderItems[index].quantity,
        editValue.purchaseOrderItems[index].price,
        editValue.purchaseOrderItems[index].amount,
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

    doc.setFontSize(15)
    doc.text("บริษัท ตาดทอง 88 จำกัด (สํานักงานใหญ่)", printX + 50, printY + 10)
    doc.setFontSize(10)
    doc.text(
      `${company?.address} ตำบล${company?.subDistrict} ${company?.district}  จังหวัด${company?.province}  ${company?.zipcode}`,
      printX + 50,
      printY + 15
    )
    doc.text(
      `โทร.${company?.phone} เลขประจำตัวผู้เสียภาษีอากร ${company?.tax}`,
      printX + 50,
      printY + 20
    )

    doc.setFontSize(15)
    doc.text('ใบสั่งซื้อ/Purchase Order', printX + 75, printY + 40)

    // setPrintY(printY+20)
    doc.setFontSize(10)
    doc.text('ชื่อผู้จำหน่าย', printX + 15, printY + 50)
    doc.text(`:${editValue.vender.companyName}`, printX + 50, printY + 50)

    doc.rect(printX + 71,printY + 33,63,10)
    doc.setFontSize(10)
    doc.text('เลขที่ใบสั่งซื้อ', printX + 120, printY + 50)
    doc.text(`: ${editValue.code}`, printX + 160, printY + 50)

    doc.setFontSize(10)
    doc.text('ที่อยู่', printX + 15, printY + 60)
    doc.text(`${editValue.vender.address} `, printX + 50, printY + 60)
    doc.text(
      `ตำบล${editValue.vender.subDistrict} ${editValue.vender.district} จังหวัด${editValue.vender.province}  ${editValue.vender?.zipcode}`,
      printX + 20,
      printY + 70
    )

    doc.setFontSize(10)
    doc.text('วันที่', printX + 120, printY + 60)
    doc.text(`: ${editValue.createAt}`, printX + 160, printY + 60)

    doc.setFontSize(10)
    doc.text('อ้างอิงเลขที่ในใบเสนอราคา', printX + 120, printY + 70)
    doc.text(`: ${editValue.user.firstName}`, printX + 160, printY + 70)

    doc.setFontSize(10)
    doc.text('เลขประจำตัวผู้เสียภาษี', printX + 15, printY + 80)
    doc.text(`:${editValue.code}`, printX + 50, printY + 80)

    doc.setFontSize(10)
    doc.text('กำหนดวันส่งสินค้า', printX + 120, printY + 80)
    doc.text(`: ${editValue.deliveryDate}`, printX + 160, printY + 80)

    doc.setFontSize(10)
    doc.text('ชื่อผู้ติดต่อ', printX + 15, printY + 90)
    doc.text(`:${editValue.vender.contactName}`, printX + 50, printY + 90)

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
        0: { halign: 'center', valign: 'middle', cellWidth: 15, rowSpan: 2 },
        1: { halign: 'center', valign: 'middle', cellWidth: 20 },
        2: { halign: 'center', valign: 'middle', cellWidth: 80 },
        3: { halign: 'left', valign: 'middle', cellWidth: 20 },
        4: { halign: 'right', valign: 'middle', cellWidth: 25 },
        //  5: { halign: 'right', valign: 'middle', cellWidth: 25,  },
      },
      head: [
        ['ลำดับ', 'รหัสสินค้า', 'รายการ', 'จำนวน', 'ราคาต่อหน่วย', 'จำนวนเงิน'],
      ],
      body: bodyItems,
    })

     let finalY = doc.lastAutoTable.finalY || 5
     doc.rect(14,finalY+3,182,37)

     doc.text('หมายเหตุ : ', printX + 15, finalY + 8)
     doc.text('รวมเป็นเงิน', printX + 132, finalY + 8)  
     doc.text(editValue.amount?.toString(), printX + 180, finalY + 8)

     doc.text('ส่วนลด', printX + 132, finalY + 15) 
     doc.text(editValue.discount > 0 ? editValue.discount.toString() : '0', printX + 180, finalY + 15)

     doc.text('รวมเป็นเงิน', printX + 132, finalY + 22)
     doc.text((editValue.amount - editValue.discount).toString(), printX + 180, finalY + 22)

     doc.text('ภาษีมูลค่าเพิ่ม(7%)', printX + 132, finalY + 29)
     doc.text('55', printX + 180, finalY + 29)
     doc.line(printX + 14, finalY + 32, printX + 196, finalY + 32)

     doc.line(printX + 129, finalY + 3, printX + 129, finalY + 40)
     doc.line(printX + 174, finalY + 3, printX + 174, finalY + 40)

     doc.text('รวมเป็นเงินทั้งสิน', printX + 132, finalY + 36)
     doc.text(editValue.vat > 0 ? editValue.vat.toString() : '0', printX + 180, finalY + 36)
    
    //footer   

    doc.text('ลงชื่อ ', printX + 35, printY + 225)
    doc.line(printX + 45, printY + 225, printX + 90, printY + 225)
    doc.text('(                                                   )', printX + 43, printY + 232)

    doc.text('ลงชื่อ ', printX + 115, printY + 225)
    doc.line(printX + 125, printY + 225, printX + 170, printY + 225)
    doc.text('(                                                    )', printX + 123, printY + 232)

    doc.text('ผู้จัดทำ', printX + 57, printY + 240)
    doc.text('ผู้มีอำนาจลงนาม', printX + 135, printY + 240)
    
  }

  useEffect(() => {
  
  }, [])

  return (
    <>
      <ApproveModal
        isOpen={openApprove}
        onClose={() => setOpenApprove(false)}
        onConfirm={sendApprove}
        loading={loading}
        title={approveTitle}
      />

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
            disabled={row.status == 'Wait Approve' || !rule[0]?.canUpdate}
            //onClick={() => navigate(`/purchase-request/print/${row.id}`)}
            onClick={() => print(row)}
          >
            <IconPrinter className='mr-2 h-4 w-4' /> Print
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' ||
              row.status == 'Completed' ||
              !rule[0]?.canUpdate
            }
            onClick={() => approveAction(row)}
          >
            <Edit className='mr-2 h-4 w-4' /> Send Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' ||
              row.status == 'Completed' || 
              !rule[0]?.canUpdate
            }
            onClick={() => updateAction(row)}
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              row.status == 'Wait Approve' ||
              row.status == 'Approved' ||
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
