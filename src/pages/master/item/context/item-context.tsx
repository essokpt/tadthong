import React, { useState } from 'react'
import { ItemEcount } from '../components/type'
//import useDialogState from '@/hooks/use-dialog-state'
//import type { User } from '../schema'

//type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface UsersContextType {
 // open: UsersDialogType | null
  //setOpen: (str: UsersDialogType | null) => void
  currentRow: ItemEcount []
  setCurrentRow: React.Dispatch<React.SetStateAction<ItemEcount []>>
}

const ItemsContext = React.createContext<UsersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ItemsProvider({ children }: Props) {
 // const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ItemEcount []>([])

  return (
    <ItemsContext.Provider value={{ currentRow, setCurrentRow }}>
      {children}
    </ItemsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useItems = () => {
  const itemsContext = React.useContext(ItemsContext)

  if (!itemsContext) {
    throw new Error('useUsers has to be used within <itemsContext>')
  }

  return itemsContext
}
