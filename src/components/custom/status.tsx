import React from 'react'
import { Badge } from '../ui/badge'

interface StatusProps {
  status: string
}


export const AppStatus: React.FC<StatusProps> = ({ status }) => {

 const checkStatus = (str:string) => {
  switch (str) {
    case 'wait approve':
      return <Badge className='bg-wait hover:bg-wait text-white' variant='default'>  {str.toUpperCase()} </Badge>;
    case 'new order':
      return <Badge className='bg-new hover:bg-new text-white' variant='default'> {str.toUpperCase()} </Badge>;
    case 'new saleorder':
        return <Badge className='bg-new hover:bg-new text-white' variant='default'> {str.toUpperCase()} </Badge>;
    case 'approved':
      return <Badge className='bg-approved hover:bg-approve text-white' variant='default'> {str.toUpperCase()} </Badge>;
    case 'rejected':
      return <Badge className='bg-reject hover:bg-reject text-white' variant='default'> {str.toUpperCase()} </Badge>;
    case 'completed':
        return <Badge className='bg-completed hover:bg-completed text-white' variant='default'> {str.toUpperCase()} </Badge>;
    default:
      return <>{str?.toUpperCase()} </>;
  }


 }

  return (
    <>
      
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
             { checkStatus(status) }
          </span>
       
    </>
  )
}
