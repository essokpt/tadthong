import { AlertModal } from "@/components/custom/alert-modal";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item } from "./schema";
import { Edit, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { EditModal } from "./edit-modal";
import { deleteItem } from "@/services/itemApi";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconSettingsDown } from "@tabler/icons-react";

interface DataTableRowActionsProps{
    row: Item
  }

const initialValue = {
    id: "",
    code: '',
    name: '',
    description: '',
    status: '',
    category: '',
    subCategory1: '',
    subCategory2: '',
    subCategory3: '',
    type: '',
    brand: '',
    size: '',
    model: '',
    feature: '',
    material: '',
    specification: '',
    group: '',
    purchaseLeadTime: '',
    manufacturingLeadTime: '',
    weight: '',
    safetyStock: '',
    stockingUom: '',
    cubicVolumn: '',
    lenght: '',
    width: '',
    height: '',
    standardCost : 0,
    averageCost : 0,
    defualtLocation: '',
    combineMtFlag: false,
    lotControlFlag: true,
    shefLifeDay: '',
    specialInstruction: '',
    priceMaster : [],
    venders : [],
    itemCategoryId: '',
    itemTypeId: '',
    itemGroupId: '',
    itemType : {
      id : 0,
      name : ''
    },
    itemGroup : {
        id : 0,
        name : ''
    },
    itemCategory : {
        id : 0,
        name : ''
    },
    locationId: '',
    location : {
      id : 0,
      name : ''
  },
  itemMasterFileAttach: [{
    id : 0,
    fileName : "",
    path: "",
}]
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState(null)
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<Item>(initialValue)

  const { setRefresh } = useContext(ApiContext) as ApiType

  function updateAction(row:any) {   
    setIsEdit(true) 
    setEditValue(row)
    console.log('update row',row);  
  }

  const onConfirm = async () => {
    setLoading(true)
    const res:any = await deleteItem(deleteId)
    if(res.status == 200) {
      console.log('deleteItem -success', res.status)      
      setOpen(false)
    } 
    setTimeout(() => {
      setLoading(false)
      setRefresh(true)
    }, 1000)
  };

  function deleteAction(row:any) {   
    setOpen(true) 
    setDeleteId(row.id)  
    setdeleteTitle(row.name)
  }

  function closeEditModal() {
    setIsEdit(false)
    setRefresh(true)
   
  }

  return (
    <>
      <EditModal
          isOpen={isEdit}
          onClose={closeEditModal}
          data={editValue}
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
            onClick={() => updateAction(row)}
          >
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