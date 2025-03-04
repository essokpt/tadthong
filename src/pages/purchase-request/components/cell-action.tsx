import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import 'jspdf-autotable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseRequest } from "./schema";
import { Edit, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { EditModal } from "./edit-modal";
import { ApproveModal } from "@/components/custom/approve-modal";
import { approvePurchaseRequest, deletePurchaseRequest } from "@/services/purchaseRequestApi";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconPrinter, IconSettingsDown } from "@tabler/icons-react";
//import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import  logo  from '@/assets/logo.jpg'
import  '@/assets/fonts/Sarabun-Light-italic';
import  '@/assets/fonts/Sarabun-Regular-normal';
import usePermission from "@/hooks/use-permission";


interface DataTableRowActionsProps{
    row: PurchaseRequest
  }

const initialValue = {
  id: '',
  code: '',  
  companyId : '',
  branchId : '',
  discount : 0,
  vat : 0,
  amount : 0,  
  description: '',
  requirmentDate: '',
  createAt: '',
  approveBy: '',
  userId: '',
  venderId: '',
  vender : {
    code: '',
    companyName: ''
  },
  locationId: 0,
  location : {
    id: 0,
    name: ''
  },
  user : {
    firstName: ''
  },
  remark: '',   
  status: '', 
  reason: '',
  cause: '',
  department: '',
  purchaseRequestItems : [],
  total : 0,
  sumVat : 0,
  sumQty : 0,
  purchaseRequestFileAttach: [{
    id: 0,
    fileName: '',
    path: ''
}]

}

const initialApprove = {
  id : 0,
  status : '',
  cause : ','
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editble, setEditble] = useState(false);

  const [openApprove, setOpenApprove] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [approveId, setApproveId] = useState(initialApprove)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [approveTitle, setApproveTitle] = useState(null)

  const [isEdit, setIsEdit] = useState(false);
  const [printX, setPrintX] = useState(0);
  const [printY, setPrintY] = useState(0);
  const [editValue, setEditValue] = useState<PurchaseRequest>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType

  const rule: any = usePermission('purchaseRequest')


  function printHeader(doc:any, value:PurchaseRequest){
    let bodyItems = [];  
    for (let index = 0; index < value.purchaseRequestItems.length; index++) {
      let item = [
        index+1, 
        value.purchaseRequestItems[index].quantity,
        value.purchaseRequestItems[index].itemMaster.code,
        value.purchaseRequestItems[index].specification,
        value.purchaseRequestItems[index].price,
        value.purchaseRequestItems[index].total,
        value.purchaseRequestItems[index].includeVat,
        value.purchaseRequestItems[index].amount
      ]
      bodyItems.push(item);
      
    }

    for (let index = 0; index < 5; index++) {
        bodyItems.push(['','','','','','','','']);
    }
 
    //summary
    bodyItems.push(['','','','','Total', value.total,value.sumVat, value.amount]);


    doc.addImage(logo, 'JPG', 15, 5, 30, 30)
  
    doc.setFontSize(15) 
    doc.setFont('Sarabun-Regular', 'normal');
    doc.text('ใบขอซื้อ', printX + 90, printY + 10);
    doc.setFontSize(15)
    doc.text('Purchase Request', printX + 78, printY + 20);
   
   // setPrintY(printY+20)
    doc.setFontSize(10)
    doc.text('ชื่อผู้ขาย',printX + 15, printY + 40)
    doc.text(`: ${value.user.firstName}`,printX + 45, printY + 40)

    doc.setFontSize(10)
    doc.text('วันที่',printX + 145, printY + 40)
    doc.text(`: ${value.createAt}`,printX + 165, printY + 40)

    doc.setFontSize(10)
    doc.text('เหตุผลในการขอซื้อ',printX + 15, printY + 50)
    doc.text(`: ${value.cause}`,printX + 45, printY + 50)

    doc.setFontSize(10)
    doc.text('ผู้จัดหา/จัดซื้อ',printX + 145, printY + 50)
    doc.text(`: ${value.user.firstName}`,printX + 165, printY + 50)

    doc.setFontSize(10)
    doc.text('ผู้รับผิดชอบ/จัดเก็บ',printX + 15, printY + 60)
    doc.text(`: ${value.user.firstName}`,printX + 45, printY + 60)

    doc.setFontSize(10)
    doc.text('ผู้ใช้งาน',printX + 145, printY + 60)
    doc.text(`: ${value.user.firstName}`,printX + 165, printY + 60)

    doc.autoTable({
      startY: printY + 70,
      theme: 'grid',
       headStyles: {                  
         // lineColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle',
         // cellPadding: 1.5
      },
      columnStyles: {
          0: { halign: 'center', valign: 'middle', cellWidth: 15 },
          1: { halign: 'center', valign: 'middle', cellWidth: 20 },
          2: { halign: 'center', valign: 'middle', cellWidth: 30 },
          3: { halign: 'left', valign: 'middle', cellWidth: 50 },
          4: { halign: 'right', valign: 'middle', cellWidth: 20 },
          5: { halign: 'right', valign: 'middle', cellWidth: 20 },
          6: { halign: 'right', valign: 'middle', cellWidth: 15 },
          7: { halign: 'right', valign: 'middle', cellWidth: 20 },                            
      },
      head: [['Item', 'Quantity', 'Item Code', 'Description', 'Unit Price', 'Amount', 'Vat', 'Total']],
      body: bodyItems,
  })

  let finalY = doc.lastAutoTable.finalY || 5
  doc.text('Remark : ',printX + 15, finalY + 10)
  doc.text(`${value.remark}`,printX + 32, finalY + 10)

  //footer
  doc.text('ผู้ขอซื้อ ',printX + 55, printY + 200)
  doc.text('ผู้ขออนุมัติ',printX + 137, printY + 200)

  doc.setDrawColor(0, 0, 0);
  doc.line(printX + 35, printY + 215, printX + 90, printY + 215) 
  doc.line(printX + 120, printY + 215, printX + 170, printY + 215) 

  
  doc.setFontSize(10)
  doc.text('Date : ',printX + 45, printY + 225)
  doc.text(`${value.createAt}`,printX + 55, printY + 225) 

  doc.text('Date : ',printX + 120, printY + 225)
  doc.line(printX + 130, printY + 225, printX + 170, printY + 225) 

}

  async function print(data:PurchaseRequest) {
    console.log('Print value:', data);
    
    //setEditValue(data)
    const doc = new jsPDF();
    setPrintX(0);
    setPrintY(10);
    printHeader(doc, data); 
    doc.output('dataurlnewwindow');
  }


  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }

  function approveAction(row:any) {   
    setOpenApprove(true) 
    setApproveId(row)
    setApproveTitle(row.code)   
    console.log('Approve data',row);  
  }

  const onConfirm = async () => {
    const res:any = await deletePurchaseRequest(deleteId)
    if(res.status == 200) {
      console.log('deletePurchaseRequest -success', res.status)      
      setOpen(false)
    } 
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  };

  const sendApprove = async () => {
    setLoading(true)
    const sendData = {
      id: approveId.id,
      remark : approveId.cause,
      type: 'Wait Approve'
    }
    console.log('sendApprove', sendData)  
    const res:any = await approvePurchaseRequest(sendData)
    if(res.status == 200) {
      console.log('sendApprove', res.status)    
      setLoading(false)  
      setOpen(false)
    } 
    setTimeout(() => {     
      setOpenApprove(false)
      setRefresh(true)

    }, 1000)
  };

  async function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.code)
  }

  function closeEditModal() {   
    setIsEdit(false) 
    setRefresh(true)
  }

  return (
    <>
     <ApproveModal
        isOpen={openApprove}
        onClose={() => setOpenApprove(false)}
        onConfirm={sendApprove}
        loading={loading}
        title={approveTitle}
      />
      
      <EditModal
          isOpen={isEdit}
          onClose={closeEditModal}         
          data={editValue}
          editble={editble}
      />
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={deleteTitle}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconSettingsDown className="h-4 w-4 text-button" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem 
            disabled={row.status == 'Wait Approve' ||  !rule[0]?.canUpdate}
            //onClick={() => navigate(`/purchase-request/print/${row.id}`)}
            onClick={() => print(row)}
            >
            <IconPrinter className="mr-2 h-4 w-4" />  Print
          </DropdownMenuItem>
         
          <DropdownMenuItem 
            disabled={row.status == 'Wait Approve' || row.status == 'Approved' ||  !rule[0]?.canUpdate} 
            onClick={() => approveAction(row)}> 
            <Edit className="mr-2 h-4 w-4" />  Send Approve
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={row.status == 'Wait Approve' || row.status == 'Approved' ||  !rule[0]?.canUpdate} 
            onClick={() => { 
              setEditble(true)
              updateAction(row)
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem 
            disabled={row.status == 'Wait Approve' || row.status == 'Approved' ||  !rule[0]?.canDelete} 
            onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};