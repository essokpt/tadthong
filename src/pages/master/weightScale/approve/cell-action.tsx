import { Button } from "@/components/custom/button";
import { WeightScalePrice } from "../components/schema";
import { useContext, useState } from "react";
import { EditModal } from "../components/edit-modal";
import { ApiContext } from "@/components/layouts/api-context";
import { ApiType } from "types/api";
import { IconEye } from "@tabler/icons-react";
import usePermission from "@/hooks/use-permission";

interface DataTableRowActionsProps{
    row: WeightScalePrice
  }

const initialValue = {
  id:  '',
  priceNumber:  '',
  status:  '',
  createAt:  '',
  reason:  '',
  inEffectiveDate:  '',
  outEffectiveDate:  '',
  weightScaleVenderTypeItem: [{
    id: 0,
    price: 0,
    itemMaster: {
      id: 0,
      code: '',
      name:''
    },
    venderType: {
      id: 0,
      typeName: '',
      description:''
    }
  }] 
}


export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {  
  const [isEdit, setIsEdit] = useState(false);
  const [editble, setEditble] = useState(false);
  const [modelType, setModelType] = useState('view');

  const [editValue, setEditValue] = useState<WeightScalePrice>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('approveWeightScalePrice')

  function updateAction(row:any) {   
     setIsEdit(true) 
    // row.selectedItemmaster = row.itemMaster.name
     setEditValue(row)
    console.log('update row',row);  
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
          editble={!editble}
          type={modelType}
      />
     
       <Button
        disabled={!rule[0]?.canUpdate}
        size='icon'
        variant='outline'
        className='rounded-full bg-primary text-white'
        onClick={() => {
          setModelType('approve')
          setEditble(false)
          updateAction(row)
        }}
      >
        <IconEye size={20} />
      </Button>
     
    </>
  );
};