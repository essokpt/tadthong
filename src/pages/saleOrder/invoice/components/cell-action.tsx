import { AlertModal } from '@/components/custom/alert-modal'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Invoice } from './schema'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deleteInvoice } from '@/services/saleOrderApi'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconPrinter, IconSettingsDown } from '@tabler/icons-react'
import { EditModal } from './edit-modal'
import { findCompany } from '@/services/companyApi'
import { CompanyType } from '@/pages/master/company/components/type'
import 'jspdf-autotable'
import { jsPDF } from 'jspdf'
import logo from '@/assets/logo.jpg'
import '@/assets/fonts/Sarabun-Regular-normal'
import usePermission from '@/hooks/use-permission'

interface DataTableRowActionsProps {
  row: Invoice
}

const initialValue = {
  id: 0,
  code: '',
  cause: '',
  currency: '',
  paymentTerm: '',
  total: 0,
  vat: 0,
  amount: 0,
  createAt: '',
  status: '',
  customerId: 0,
  customer: {
    paymentTerm: '',
    code: '',
    companyName: '',
    attn: '',
    address: '',
    district: '',
    subDistrict: '',
    province: '',
    zipcode: '',
    country: '',
    tax: '',
    customerBillings: {
      address: '',
      district: '',
      subDistrict: '',
      province: '',
      zipcode: '',
      country: '',
      contactName: '',
    },
  },
  invoiceItems: [
    {
      id: '',
      saleOrderItems: {
        id: 0,
        itemMasterId: 0,
        itemMaster: {
          id: 0,
          code: '',
          name: '',
          stockingUom: '',
          convertFactor: 0,
        },
        quantity: 0,
        unitPrice: 0,
        amount: 0,
        underCutPrice: 0,
        cuttingWeight: 0,
        afterCutPrice: 0,
        afterCutQuantity: 0,
        afterAmount: 0,
        sourceHumidity: 0,
        destinationHumidity: 0,
        destinationWeighingScale: '',
        remark: '',
        uomType: '',
        saleOrder: {
          id: 0,
          code: '',
        },
      },
    },
  ],
}

const initCompany = {
  id: "",
  code: "",
  companyName: "",
  address: "",
  subDistrict: "",
  district: "",
  province: "",
  zipcode: "",
  country: "",
  phone: "",
  fax: "",
  tax: "", 
  email: "", 
  remark: "",
  ext : "",
  attn : "",
  foundedDate: "",
  billAddress: "",
  billProvince: "",
  billZipcode: "",
  billCountry: "",  
  billSubDistrict: "",  
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [editValue, setEditValue] = useState<Invoice>(initialValue)
  const [company, setCompany] = useState<CompanyType>(initCompany)
  const [printX, setPrintX] = useState(0)
  const [printY, setPrintY] = useState(0)

  const navigate = useNavigate()
  const rule: any = usePermission('invoice')

  const onConfirm = async () => {
    const res: any = await deleteInvoice(deleteId)
    if (res.status == 200) {
      console.log('deleteSaleOrder -success', res.status)
      setOpen(false)
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  async function deleteAction(row: any) {
    console.log('Invoice Detail: ', row)
    setOpen(true)
    setDeleteId(row.id)
    setdeleteTitle(row.code)
  }

  async function print(data: Invoice) {
    console.log('Print value:', data)
    findCompany(1).then((data) =>  setCompany(data))
      
    setEditValue(data)
    const doc = new jsPDF()
    setPrintX(0)
    setPrintY(10)
    printHeader(doc,data)
    doc.output('dataurlnewwindow')
  }

  function printHeader(doc: any, value: Invoice) {
    let bodyItems = []
    for (let index = 0; index < value.invoiceItems.length; index++) {
      let isAltenateUom = value.invoiceItems[index].saleOrderItems.uomType?.includes('(alternate-uom)')
      console.log('find uom:', isAltenateUom);
      let quantity = 0
      let unitprice = 0
      if(isAltenateUom)  {
        quantity = value.invoiceItems[index].saleOrderItems.quantity *  value.invoiceItems[index].saleOrderItems.itemMaster.convertFactor
        unitprice = value.invoiceItems[index].saleOrderItems.unitPrice / value.invoiceItems[index].saleOrderItems.itemMaster.convertFactor
      }else{
        quantity = value.invoiceItems[index].saleOrderItems.quantity
        unitprice = value.invoiceItems[index].saleOrderItems.unitPrice
      }
      let item = [
        index + 1,
        value.invoiceItems[index].saleOrderItems.itemMaster.code,
        value.invoiceItems[index].saleOrderItems.itemMaster.name,
        quantity,         
        value.invoiceItems[index].saleOrderItems.uomType,
        unitprice,
        value.invoiceItems[index].saleOrderItems.amount,

      ]
      bodyItems.push(item)
    }

    for (let index = 0; index < 8; index++) {
      bodyItems.push(['', '', '', '', '', '', '', ''])
    }

    //summary
    // bodyItems.push(['','','','','Total', value.total,value.sumVat, value.amount]);

    doc.addImage(logo, 'JPG', 15, 5, 30, 30)
    doc.setFont('Sarabun-Regular', 'normal')

    doc.setFontSize(15)
    doc.text("บริษัท ตาดทอง 88 จำกัด (สํานักงานใหญ่)", printX + 50, printY + 10)
    doc.setFontSize(10)
    doc.text(
      `เลขที่ 222 หมู่ 4 ตำบลตาดทอง อำเภอศรีธาตุ จงหวัดอุดรธานี 41230`,
      //`${company?.address} ตำบล${company?.subDistrict} ${company?.district}  จังหวัด${company?.province}  ${company?.zipcode}`,
      printX + 50,
      printY + 15
    )
    doc.text(
      "โทร. 092-9242266 เลขประจำตัวผู้เสียภาษีอากร 0105563144363",
      //`โทร.${company?.phone} เลขประจำตัวผู้เสียภาษีอากร ${company?.tax}`,
      printX + 50,
      printY + 20
    )

    doc.rect(printX + 45, printY + 30, 117, 15)
    doc.setFontSize(15) 
    doc.text('ต้นฉบับใบกำกับภาษี / ใบเสร็จรับเงิน / ใบส่งสินค้า', printX + 50, printY + 37) 
    doc.setFontSize(12) 
    doc.text('ORIGINAL TAX INVOICE / RECEIPT / DELIVERY ORDER', printX + 52, printY + 42) 

    doc.setFontSize(10)
    doc.text('ลูกค้า', printX + 15, printY + 50)
    doc.text(`: ${value.customer?.companyName}`, printX + 50, printY + 50)
    
    doc.setFontSize(10)
    doc.text('เลขที่ No.', printX + 120, printY + 50)
    doc.text(`: ${value.code}`, printX + 160, printY + 50)

    doc.setFontSize(10)
    doc.text('ที่อยู่', printX + 15, printY + 60)
    doc.text(`${value.customer.address} `, printX + 50, printY + 60)
    doc.text(
      `ตำบล${value.customer.subDistrict} ${value.customer.district} จังหวัด${value.customer.province}  ${value.customer?.zipcode}`,
      printX + 20,
      printY + 70
    )

    doc.setFontSize(10)
    doc.text('วันที่', printX + 120, printY + 60)
    doc.text(`: ${value.createAt}`, printX + 160, printY + 60)

    doc.setFontSize(10)
    doc.text('หน้า', printX + 120, printY + 70)

    doc.setFontSize(10)
    doc.text('เลขประจำตัวผู้เสียภาษี', printX + 15, printY + 80)
    doc.text(`: ${value.customer?.tax}`, printX + 50, printY + 80)

    doc.setFontSize(10)
    doc.text('PO No.', printX + 120, printY + 80)

    doc.setFontSize(10)
    doc.text('สำนักงาน/สาขา', printX + 15, printY + 90)
    doc.text(`: ${value.customer?.code}`, printX + 50, printY + 90)
    doc.text('Payment Term', printX + 120, printY + 90)
    doc.text(`: ${value.paymentTerm}`, printX + 160, printY + 70)


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
        0: { halign: 'center', valign: 'middle', cellWidth: 15, },
        1: { halign: 'center', valign: 'middle', cellWidth: 20 },
        2: { halign: 'center', valign: 'middle', cellWidth: 60 },
        3: { halign: 'left', valign: 'middle', cellWidth: 20 },
        4: { halign: 'right', valign: 'middle', cellWidth: 20 },
        5: { halign: 'right', valign: 'middle', cellWidth: 25,  },
      },
      head: [
        ['ลำดับ', 'รหัสสินค้า', 'รายละเอียด', 'จำนวน', 'หน่วย', 'ราคาต่อหน่วย', 'จำนวนเงิน'],
      ],
      body: bodyItems,
    })

    let finalY = doc.lastAutoTable.finalY || 5
   
    doc.rect(14,finalY+3,87,16)
    doc.text('ตัวอักษร', printX + 16, finalY + 8)
    doc.line(printX + 14, finalY + 11, printX + 101, finalY + 11)
    doc.text('ผิดตก ยกเว้น E. & O.E', printX + 16, finalY + 16)

    doc.text('หมายเหตุ : ', printX + 16, finalY + 32)

    doc.rect(109,finalY+3,87,48)
    doc.line(printX + 32, printY + 260, printX + 68, printY + 260)

    doc.text('รวมเงิน', printX + 111, finalY + 7)
    doc.text('TOTAL', printX + 111, finalY + 11)
    doc.text(value.total>0 ? value.total.toString() : '0', printX + 180, finalY + 9)
    doc.line(109, finalY + 13, printX + 196, finalY + 13)

    doc.text('ส่วนลด', printX + 111, finalY + 17)
    doc.text('DISCOUNT', printX + 111, finalY + 21)
    doc.text('0', printX + 180, finalY + 19)
    doc.line(109, finalY + 23, printX + 196, finalY + 23)

    doc.text('มูลค่าสินค้าหลังหักส่วนลด', printX + 111, finalY + 28)
    doc.text('TOTAL AMOUNT AFTER DISCOUNT', printX + 111, finalY + 32)
    doc.text(value.total>0 ? value.total.toString() : '0', printX + 180, finalY + 30)
    doc.line(109, finalY + 33, printX + 196, finalY + 33)

    doc.text('ภาษีมูลค่าเพิ่ม', printX + 111, finalY + 37)
    doc.text('VAT 7%', printX + 111, finalY + 41)
    doc.text((value.total>0 ? (value.total * 0.07).toString() : '0'), printX + 180, finalY + 39)
    doc.line(109, finalY + 43, printX + 196, finalY + 43)
    
    doc.text('ยอดรวมสุทธิ', printX + 111, finalY + 46)
    doc.text('GRAND TOTAL', printX + 111, finalY + 50)

    doc.line(printX + 174, finalY + 3, printX + 174, finalY + 51)
   
  //   //footer
    doc.setFontSize(9)
    doc.text(`*กรณีชำระด้วยเช็คโปรดสั่งจ่ายเช็คขีดคร่อมในนามของ บริษท ตาดทอง 88 จำกัด เท่านั้น และขีดฆ่า "หรือผู้ถือ"`, printX + 34, printY + 238)
    doc.text(`กรรมสิทธิ์ในสินค้ายังเป็นของบริษทฯ จนกว่าจะมีการชำระเงินเรียบร้อยแล้ว กรณีชำระเงินล่าช้าจะต้องชำระดอกเบี้ย 1.25% ต่อเดือน`, printX + 22, printY + 243)
    doc.setFontSize(10)
    doc.text(`ใบเสร็จรับเงินจะสมบูรณ์ต่อเมื่อบริษัท ตาดทอง 88 จำกัด ได้ร้บเงินตามเช็คหรือ เงินโอนเข้าบัญชีเรียบร้อยแล้วเท่านั้น`, printX + 22, printY + 248)


    doc.rect(14, printY + 250, 182, 30)
    doc.line(printX + 72, printY + 250, printX + 72, printY + 280)
    doc.line(printX + 135, printY + 250, printX + 135, printY + 280)

    doc.setFontSize(10)
    doc.text('ผู้รับสินค้า ', printX + 17, printY + 260)
    doc.line(printX + 32, printY + 260, printX + 68, printY + 260)
     doc.text('ลงวันที่ ', printX + 17, printY + 270)
     doc.line(printX + 32, printY + 270, printX + 68, printY + 270)

     doc.text('ผู้ส่งสินค้า ', printX + 75, printY + 260)
     doc.line(printX + 90, printY + 260, printX + 130, printY + 260)
     doc.text('ลงวันที่ ', printX + 75, printY + 270)
     doc.line(printX + 90, printY + 270, printX + 130, printY + 270)

     doc.text(company?.companyName, printX + 137, printY + 257)
     doc.line(printX + 140, printY + 270, printX + 190, printY + 270)
     doc.text('ผู้มีอำนาจลงนาม', printX + 155, printY + 275)
  }

  useEffect(() => {
   
  }, [])

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      />

      <EditModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        data={editValue}
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
            disabled={row.status == 'Wait Approve' || !rule[0]?.canView}
            onClick={() => print(row)}
          >
            <IconPrinter className='mr-2 h-4 w-4' /> Print
          </DropdownMenuItem>
         
          <DropdownMenuItem
            onClick={() => navigate(`/invoice/detail/${row.id}`)}
          >
            <IconEye className='mr-2 h-4 w-4' /> View
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => navigate(`/invoice/view/${row.id}`)}
          >
            <IconPrinter className='mr-2 h-4 w-4' /> Print
          </DropdownMenuItem> */}
          <DropdownMenuItem 
             disabled={!rule[0]?.canDelete}
          onClick={() => deleteAction(row)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
