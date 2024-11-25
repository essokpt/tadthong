import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { deleteCustomer } from "@/services/customerApi";
import { EditModal } from "./edit-modal";
import { CustomerType } from "./type";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconSettingsDown } from "@tabler/icons-react";

interface DataTableRowActionsProps{
    row: CustomerType
  }
  
  const initCustomerEdit = {
    id: 0,
    code: '',
    companyName: '',
    address: '',
    phone: '',
    fax: '',
    tax: '', 
    email: '',
    type: '',
    remark: '',
    district : '',
    subDistrict : '',
    province : '',
    zipcode : '',
    creditHold : false,
    creditLimitOrder : '',
    creditLimitItem : '',
    alternatePhone : '',
    phoneExt : '',
    alternateFax : '',
    specialIntruction : '',
    attn : '',
    country : '',
    ext : '',
    meng : '',
    costmarkup : '',
    paymentTerm : '',
    status : '',
    currency : '',
    paymenTerm : '',
    createAt : '',
    customerBillings: []
  }


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [customerEdit, setCustomerEdit] = useState<CustomerType>(initCustomerEdit)

  const { setRefresh } = useContext(ApiContext) as ApiType
  
  const onConfirm = async () => {
    setLoading(true)
    const res:any = await deleteCustomer(deleteId)
    if(res.status == 200) {
      console.log('deleteCustomer -success', res.status)      
      setOpen(false)
    } 
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  };

  function updateAction(row:any) {   
    setIsEdit(true)     
    setCustomerEdit(row)
    console.log('update row',row);
  }

  function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.companyName)
  }

  return (
    <>
      <EditModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          // loading={loading}
          data={customerEdit}
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

          <DropdownMenuItem onClick={() => updateAction(row)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAction(row)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      
      </DropdownMenu>
    </>
  );
};