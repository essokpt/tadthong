import { TableCell, TableRow } from '@/components/ui/table'
import { PurchaseOrder } from './schema'
import { Loading } from '@/components/custom/loading'

interface EditModalProps {
  data: PurchaseOrder
}
export const ExpandData: React.FC<EditModalProps> = ({ data }) => {
  return (
    <>
      {data.purchaseOrderItems.length ? (
        data.purchaseOrderItems.map((item) => (
          <TableRow
            key={item.id}
           className='bg-cyan-500/25 hover:bg-secondary'
          >
            <TableCell></TableCell>
            <TableCell className='font-medium'>
              {item.itemMaster?.code}
            </TableCell>
            <TableCell >{item.itemMaster?.name}</TableCell>
            <TableCell>{item.specification}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.price?.toFixed(2)}</TableCell>
            <TableCell>{item.discountPercent?.toFixed(2)}</TableCell>
            <TableCell>{item.discountUnit?.toFixed(2)}</TableCell>
            <TableCell>{item.discountTotal?.toFixed(2)}</TableCell>
            <TableCell>{item.amount?.toFixed(2)}</TableCell>
            <TableCell>{item.vat?.toFixed(2)}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={11}
            className='h-24 bg-slate-400 text-center text-background dark:bg-slate-200'
          >
            <Loading timeout={500}/>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
