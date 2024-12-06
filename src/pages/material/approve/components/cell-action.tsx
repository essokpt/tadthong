import { Button } from '@/components/custom/button'
import { ImportMaterial } from '../../components/schema'
import { useContext, useEffect, useState } from 'react'
import { EditModal } from './edit-modal'
import { IconEdit } from '@tabler/icons-react'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import usePermission from '@/hooks/use-permission'

interface DataTableRowActionsProps {
  row: ImportMaterial
}

const initialValue = {
  id: '',
  code: '',
  importDate: '',
  remark: '',
  status: '',
  stockIn: '',
  locationId: 0,
  location: {
    id: 0,
    name: '',
  },
  user: {
    firstName: '',
    lastName: '',
  },
  approvedBy: '',
  materials: [],
}

const initSum = {
  sumWeightIn: 0,
  sumWeightOut: 0,
  sumWeightNet:0,
  sumHumiduty: 0,
  sumadulteration: 0,
  sumWeightBalace: 0,
  sumOther: 0,  
  sumPrice: 0, 
  sumAmount: 0, 
  sumCol7: 0,  
  sumShiping: 0,  
  sumMoney: 0,  
  sumBalance: 0,
}



export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
 
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<ImportMaterial>(initialValue)
  const { setRefresh } = useContext(ApiContext) as ApiType
  const rule: any = usePermission('approve')

  function summary(data:any) {
   
      initSum.sumWeightIn = 0
      initSum.sumWeightOut = 0
      initSum.sumWeightNet =0
      initSum.sumHumiduty = 0
      initSum.sumadulteration = 0
      initSum.sumOther = 0  
      initSum.sumPrice = 0  
      initSum.sumAmount = 0  
      initSum.sumCol7 = 0  
      initSum.sumShiping = 0  
      initSum.sumMoney = 0  
      initSum.sumBalance = 0
    
     for (let index = 0; index < data.materials?.length; index++) {      
        // setSummaryItem({...summaryItem,  
        //   sumWeightIn : summaryItem.sumWeightIn += parseInt(data.materials[index].weightIn),
        //   sumWeightOut : summaryItem.sumWeightOut += parseInt(data.materials[index].weightOut)          
        // })
          initSum.sumWeightIn += parseInt(data.materials[index].weightIn)
          initSum.sumWeightOut += parseInt(data.materials[index].weightOut)       
          initSum.sumHumiduty += parseInt(data.materials[index].col4)
          initSum.sumadulteration += parseInt(data.materials[index].col5)
          initSum.sumOther += parseInt(data.materials[index].col6)
          initSum.sumPrice += parseInt(data.materials[index].priceReceipt)
          initSum.sumCol7 += parseInt(data.materials[index].sumCol7)
          initSum.sumShiping += parseInt(data.materials[index].sumCol8)
          initSum.sumMoney += parseInt( data.materials[index].col9)       
     }
     initSum.sumWeightNet = initSum.sumWeightIn - initSum.sumWeightOut
      //Sum น้ำหนักคงเหลือ (Sum น้ำหนักสุทธิ - Sum หักความชื้น - Sum หักสิ่งเจือปน - Sum หักอื่นๆ)
      initSum.sumWeightBalace = initSum.sumWeightNet - initSum.sumHumiduty - initSum.sumadulteration - initSum.sumOther
    // Sum จำนวนเงิน (น้ำหนักสุทธิ x ราคา)
      initSum.sumAmount = initSum.sumWeightNet * initSum.sumPrice      
      //  - Sum เงินคงเหลือ (Sum จำนวนเงิน - Sum หักเงินค่าชั่ง  - Sum หักค่าลง - Sum หักเงินอื่นๆ)
     initSum.sumBalance = initSum.sumAmount - initSum.sumCol7 - initSum.sumShiping - initSum.sumMoney  
 

    console.log('sum:', initSum);
   }

  function updateAction(row: any) {
    //setSummaryItem(initSum)
    summary(row)
    setEditValue(row)
    setIsEdit(true)

    console.log('update row', row)
  }

  function closeEditModal() {
   
    setIsEdit(false)
    setRefresh(true)

  }

  useEffect(() => {
   // setSummaryItem(initSum)

  }, [])
  

  return (
    <>
      <EditModal
        isOpen={isEdit}
        onClose={closeEditModal}
        data={editValue}
        summary={initSum}
      />

      <Button
        disabled={!rule[0]?.canView}
        size='icon'
        variant='outline'
        className='rounded-full bg-primary text-white'
        onClick={() => updateAction(row)}
      >
        <IconEdit size={20} />
      </Button>
      
    </>
  )
}
