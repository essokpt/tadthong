'use client'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// import { Branch } from './schema'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
import { Separator } from '@/components/ui/separator'
import { CompanyType } from './type'
import { updateCompany } from '@/services/companyApi'
import { ApiContext } from '@/components/layouts/api-context'
import { ApiType } from 'types/api'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void   
  data: CompanyType
}


export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,  
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { handleSubmit, register } = useForm()
  const [onloading, setOnloading] = useState(false)
  const { setRefresh } = useContext(ApiContext) as ApiType

  async function updateData(data:any) {   
    setOnloading(true)
    const res:any = await updateCompany(data)   
    if(res.status == 200) {
      console.log('update branch -success', res.status)         
     
    }  
    setTimeout(() => {
      setOnloading(false)
      setRefresh(true)
      onClose()
    }, 1000) 
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return ( 
    <>  
      <Dialog open={isOpen} onOpenChange={onClose} >
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader> 
          <Separator className='bg-primary'/>       
            <div className='grid gap-4'>
              <form onSubmit={handleSubmit(updateData)}>
                <div className='grid grid-cols-2 gap-2 '>
                <Input className='hidden' {...register('id')} defaultValue={data.id} />

                 
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='Company Name'>Company Name</Label>
                    <Input className='text-[0.8rem]' {...register('companyName')} defaultValue={data.companyName} />
                  </div>
                  
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='address'>Address</Label>
                    <Input className='text-[0.8rem]' {...register('address')} defaultValue={data.address} />
                  </div>  
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='district'>District</Label>
                    <Input className='text-[0.8rem]' {...register('district')} defaultValue={data.district} />
                  </div>                
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='province'>Province</Label>
                    <Input className='text-[0.8rem]' {...register('province')} defaultValue={data.province} />
                  </div>
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='country'>Country</Label>
                    <Input className='text-[0.8rem]' {...register('country')} defaultValue={data.country} />
                  </div>
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='zipcode'>Zipcode</Label>
                    <Input className='text-[0.8rem]' {...register('zipcode')} defaultValue={data.zipcode} />
                  </div>
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='phone'>Phone</Label>
                    <Input className='text-[0.8rem]' {...register('phone')} defaultValue={data.phone} />
                  </div>
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='tax'>Tax ID</Label>
                    <Input className='text-[0.8rem]' {...register('tax')} defaultValue={data.tax} />
                  </div>
                  
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='fax'>Fax</Label>
                    <Input className='text-[0.8rem]' {...register('fax')} defaultValue={data.fax} />
                  </div>
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='ext'>Fax-Ext</Label>
                    <Input className='text-[0.8rem]' {...register('ext')} defaultValue={data.ext} />
                  </div>
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='attn'>Attn</Label>
                    <Input className='text-[0.8rem]' {...register('attn')} defaultValue={data.attn} />
                  </div>
                  <div className='grid'>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='email'>Email</Label>
                    <Input className='text-[0.8rem]' {...register('email')} defaultValue={data.email} />
                  </div>
                  <div className='grid w-full'>
                    <div>
                    <Label className='text-[0.8rem] text-muted-foreground py-1' htmlFor='remark'>Remark</Label>
                    <Input className='text-[0.8rem]' {...register('remark')} defaultValue={data.remark} />
                    </div>
                  </div>
                                
                  </div>
               
                
                  <br/>
                  <DialogFooter>
                    <Button loading={onloading} type='submit'>Save changes</Button>
                  </DialogFooter>
               
              </form>
           
          </div>
        </DialogContent>
      </Dialog>     
   </>
  )
}
