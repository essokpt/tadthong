import {  
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { PurchaseRequest } from './schema'
import { Loading } from '@/components/custom/loading'
import { toCurrency } from '@/lib/utils'

interface EditModalProps {
  data: PurchaseRequest
}
export const ExpandData: React.FC<EditModalProps> = ({ data }) => {
  return (
    <>      
        { data.purchaseRequestItems.length ? (          
            data.purchaseRequestItems.map((item) => (
              <TableRow key={item.id} className='bg-cyan-500/25 hover:bg-cyan-500/25 '>
                <TableCell></TableCell>
                <TableCell >{item.itemMaster?.code} </TableCell>
                <TableCell >{item.itemMaster?.name}</TableCell>
                <TableCell >{item.vender?.companyName}</TableCell>
                <TableCell>{item.specification}</TableCell>               
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{toCurrency(item.price)}</TableCell>
                <TableCell>{toCurrency(item.total)}</TableCell>
                <TableCell>{toCurrency(item.includeVat)}</TableCell>
                <TableCell>{toCurrency(item.amount)}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))            
          ) : (
            <TableRow>
              <TableCell
                colSpan={14}
                className='h-24 bg-slate-400 text-center text-background dark:bg-slate-200'
              >
                <Loading timeout={1000} />
              </TableCell>
            </TableRow>            
          ) 
        }  
    </>
  )
}
