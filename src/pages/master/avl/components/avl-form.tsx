import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
//import { useNavigate } from 'react-router-dom'

import { VenderType } from '../../vender/components/type'
import { getVenders } from '@/services/vendersApi'
import { ItemType } from '../../item/components/type'
import { getItemMaster } from '@/services/itemApi'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

// const formSchema = z.object({
//   selectItem: z.string(),
//   selectVender: z.string(),
//   cost: z.number(),
 
// })

export function AvlForm({ className, ...props }: SignUpFormProps) {
  const [venders, setVender] = useState<VenderType[]>([])
  const [items, setItem] = useState<ItemType[]>([])
  const [avl, setAvl] = useState<ItemType>()
  const [newVenders, setNewVender] = useState<VenderType[]>([])

  const [isLoading, setIsLoading] = useState(false)
  //const navigate = useNavigate()
  const { handleSubmit, register } = useForm()

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     selectItem: '',
  //     selectVender: '',
  //     cost: 0,
  //   },
  // })

  async function onSubmit(payload: any) {
    // setIsLoading(true)
    console.log('new payload', payload)
    const itemObj: any = items.find((i) => i.code == payload.selectItem)
    const newVender: any = venders.find((i) => i.code == payload.selectVender)

    setAvl(itemObj)
    newVenders.push(newVender)

    // avl?.venders.push(newVender)
    const newData = {
      id: avl?.id,
      item: avl,
      venders: newVenders,
      cost: payload.cost,
    }

    console.log('new data', newData)

    // const res: any = await addItemVender(newData)
    // if (res.status == 200) {
    //   console.log('addItemVender -success', res.status)
    //   navigate('/master/uom', { replace: true })
    // }

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    setNewVender([])
    getVenders().then((data) => setVender(data))
    getItemMaster().then((data) => setItem(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Create AVL</h2>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid  gap-2 '>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='type'
                  >
                    Item Master
                  </Label>
                  <select
                    {...register('selectItem')}
                    // id={item.id}
                    // onChange={handleChangeBranch}
                    className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    {items.map((item) => (
                      <option
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        key={item.id}
                        value={item.code}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='type'
                  >
                    Venders List
                  </Label>
                  <select
                    {...register('selectVender')}
                    // id={item.id}
                    // onChange={handleChangeBranch}
                    className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                  >
                    {venders.map((item) => (
                      <option
                        className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        key={item.id}
                        value={item.code}
                      >
                        {item.code} {item.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid'>
                  <Label
                    className='py-1 text-[0.8rem] text-muted-foreground'
                    htmlFor='address'
                  >
                    Cost
                  </Label>
                  <Input
                    className='w-[300px]'
                    type='float'
                    {...register('cost')}
                    // onChange={handleChangePrice}
                  />
                </div>
                
              </div>

              <br />
              <div>
                <Button className='mt-2 w-full' loading={isLoading}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
