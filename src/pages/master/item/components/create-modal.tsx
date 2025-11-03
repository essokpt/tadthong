/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
//import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'

import { zodResolver } from '@hookform/resolvers/zod'
import { ItemEcount } from './type'


interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  createData: (data: any) => void
  loading: boolean
  data: ItemEcount
}

const formSchema = z.object({
  id: z.number(),
  code: z.string().min(1, 'Code is required'),
  itemMasterId: z.number(),
  name: z.string().min(1, 'Name is required'),
})

export const CreateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  createData,
  loading,
  data
}) => {
  const [isMounted, setIsMounted] = useState(false)
  //const [onloading, setOnloading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: data 
  })

  function onSubmit(data: z.infer<typeof formSchema>) {

    console.log('createBom', data)
    createData(data)
    form.reset()
    onClose()
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen-md'>
          <DialogHeader>
            <DialogTitle>New Ecount</DialogTitle>
          </DialogHeader>
          <Separator className='bg-primary' />
          <div className='grid gap-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-2 '>
                  <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <br />
                <DialogFooter>
                  <Button loading={loading} type='submit'>
                    Save changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
