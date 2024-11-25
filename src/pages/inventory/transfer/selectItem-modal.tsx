'use client'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { columns } from './components/columns'
import { getOnHandStock } from '@/services/inventoryApi'
import { StockOnhand } from '../stock/schema'
import { DataTable } from './components/dataTable'

// interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
//   target: EventTarget & T
// }

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void 
}

export const SelectItemModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData  
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [stockItems, setStockItems] = useState<StockOnhand[]>([])

  async function addData(data: any) {
    console.log("select item value:", data);    
    createData(data)
    onClose()
  }

  useEffect(() => {
    setIsMounted(true)
    getOnHandStock().then((data) => setStockItems(data))
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>Select Onhand Stock</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <DataTable data={stockItems} columns={columns} selectData={addData}/>
            
            <br />
            <DialogFooter>
             
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
