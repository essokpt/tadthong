import React, { useState } from 'react'
import { SaleOrder } from '../components/schema'

//type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface OrdersContextType {
 // open: UsersDialogType | null
  //setOpen: (str: UsersDialogType | null) => void
  countRow : number
  setCountRow: React.Dispatch<React.SetStateAction<number>>

  currentRow: SaleOrder []
  setCurrentRow: React.Dispatch<React.SetStateAction<SaleOrder []>>
}

const SaleOrderContext = React.createContext<OrdersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function SaleOrderProvider({ children }: Props) {
 // const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SaleOrder []>([])
  const [countRow, setCountRow] = useState(0)

  return (
    <SaleOrderContext.Provider value={{ currentRow, setCurrentRow, countRow, setCountRow}}>
      {children}
    </SaleOrderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSaleOrder = () => {
  const orderContext = React.useContext(SaleOrderContext)

  if (!orderContext) {
    throw new Error('useUsers has to be used within <orderContext>')
  }

  return orderContext
}
