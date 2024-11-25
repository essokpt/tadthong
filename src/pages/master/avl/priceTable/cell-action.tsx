import { Button } from '@/components/custom/button'
import { VenderList } from './schema'
import { useContext, useState } from 'react'
import { EditModal } from './edit-modal'
//import { PriceType } from './type'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { AlertModal } from '@/components/custom/alert-modal'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'
import { deleteVenderitem } from '@/services/itemApi'
//import PriceMaster from "..";

interface DataTableRowActionsProps {
  row: VenderList
}

const initialValue = {
  id: '',
  cost: 0,
  remark: '',
  itemMasterId: 0,
  vender:{
      id: 0,
      code: '',
      companyName : ''
  }
}

export const CellAction: React.FC<DataTableRowActionsProps> = ({ row }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [editValue, setEditValue] = useState<VenderList>(initialValue)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setdeleteTitle] = useState('')
  const [onloading, setOnloading] = useState(false)

  const { setRefresh } = useContext(ApiContext) as ApiType

  function updateAction(row: any) {
   
    setEditValue(row)
    console.log('update row', row)
    setIsEdit(true)
  }

  function deleteAction(row: any) {
    setDeleteId(row.id)
    setdeleteTitle(`Vender:${row.vender.companyName}  #Cose:${row.cost}`)
    setOpenDeleteModal(true)
    console.log('deleteAction', row)
  }

  async function confirmDeletePrice() {
    console.log('deleteItemPrice', deleteId)
    setOnloading(true)
    const response: any = await deleteVenderitem(deleteId)

    if (response.status == 200) {
      console.log(response.data)
      // const deleteIndex = data.itemVenderLists.findIndex((a) => a.id == deleteId)
      // if (deleteId != -1) {
      //   data.itemVenderLists.splice(deleteIndex, 1)
      // }
    }
    setTimeout(() => {
      setOpenDeleteModal(false)
      setOnloading(false)
      setRefresh(true)
    }, 1000)
  }


  return (
    <>
      <EditModal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        data={editValue}
      />

        <AlertModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={confirmDeletePrice}
          loading={onloading}
          title={deleteTitle}
        />

      
        <Button
          loading={false}
          size='icon'
          variant='ghost'
          className='rounded-full'
          onClick={() => updateAction(row)}
        >
          <IconEdit size={20} />
        </Button>

        <Button
          size='icon'
          variant='ghost'
          className='rounded-full'
          onClick={() => deleteAction(row)}
        >
          <IconTrash size={20} />
        </Button>
      
    </>
  )
}
