import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { Layout, LayoutBody } from '@/components/custom/layout'
//import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
//import { createItem } from '@/services/itemApi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent  
} from '@/components/ui/card'
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUom } from '@/services/bomApi'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

const itemStatus = [
  { value: 'new', name: 'New' },
  { value: 'pending', name: 'Pending' },
  { value: 'instock', name: 'Instock' },
]

const itemCategory = [
  { value: 'home', name: 'Home' },
  { value: 'wood', name: 'Wood' },
  { value: 'electical', name: 'Electical' },
]

const itemType = [
  { value: 'home', name: 'Home' },
  { value: 'wood', name: 'Wood' },
  { value: 'electical', name: 'Electical' },
]

const itemGroup = [
  { value: 'home', name: 'Home' },
  { value: 'wood', name: 'Wood' },
  { value: 'electical', name: 'Electical' },
]

interface Uom {
  id: string
  code: string
}

const formSchema = z.object({
  code: z.string().min(1, { message: 'Please enter your email' }),
  name: z.string().min(1, {
    message: 'Please enter your password',
  }),
  description: z.string(),
  status: z.string(),
  category: z.string(),
  subCategory1: z.string(),
  subCategory2: z.string(),
  subCategory3: z.string(),
  brand: z.string(),
  size: z.string(),
  model: z.string(),
  feature: z.string(),
  material: z.string(),
  specification: z.string(),
  group: z.string(),
  type: z.string(),
  purchaseLeadTime: z.string(),
  manufacturingLeadTime: z.string(),
  weight: z.string(),
  saftyStock: z.string(),
  stockingUom: z.string(),
  cubicVolumn: z.string(),
  lenght: z.string(),
  width: z.string(),
  height: z.string(),
  defualtLocation: z.string(),
  combineMtFlag: z.boolean(),
  lotControlFlag: z.boolean(),
  shefLifeDay: z.string(),
  specialInstruction: z.string(),
})

export function ItemForm({ className, ...props }: SignUpFormProps) {
  const [uom, setUom] = useState<Uom[]>([])
  const [isLoading, setIsLoading] = useState(false)
 // const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      status: '',
      category: '',
      subCategory1: '',
      subCategory2: '',
      subCategory3: '',
      brand: '',
      size: '',
      model: '',
      feature: '',
      material: '',
      specification: '',
      group: '',
      purchaseLeadTime: '',
      manufacturingLeadTime: '',
      weight: '',
      saftyStock: '',
      stockingUom: '',
      cubicVolumn: '',
      lenght: '',
      width: '',
      height: '',
      defualtLocation: '',
      combineMtFlag: false,
      lotControlFlag: false,
      shefLifeDay: '',
      specialInstruction: '',
      type: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log('onSubmit', data)

    // const res: any = await createItem(data)
    // if (res.status == 200) {
    //   console.log('createVender -success', res.status)
    //   navigate('/master/item', { replace: true })
    // }

    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }

  useEffect(() => {
    getUom().then((data) => setUom(data))
  }, [])

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Create Item</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className={cn('grid gap-4', className)} {...props}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue='general' className='w-full'>
                  <TabsList className='grid w-full grid-cols-2 bg-primary'>
                    <TabsTrigger value='general' className='text-white'>
                      Generl Information
                    </TabsTrigger>
                    <TabsTrigger value='planing' className='text-white'>
                      Planing & Stock Information
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value='general'>
                    <Card>
                      {/* <CardHeader>
                        <CardTitle>general</CardTitle>
                        <CardDescription>
                          Make changes to your account here. Click save when
                          you're done.
                        </CardDescription>
                      </CardHeader> */}
                      <CardContent className='space-y-2'>
                        <div className='grid grid-cols-3 gap-2 '>
                          <FormField
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                  />
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
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='category'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Category</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select status' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {itemCategory.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.name}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='subCategory1'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Sub-Category1</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='subCategory2'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Sub-Category2</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='subCategory3'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Sub-Category3</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='brand'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='name@example.com'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='size'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                  <Input placeholder='' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='stockingUom'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Stocking-Uom</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select Uom' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {uom.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.code}
                                      >
                                        {item.code}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='model'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='feature'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Feature</FormLabel>
                                <FormControl>
                                  <Input placeholder='feature' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='material'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Material</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='specification'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>specification</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select Type' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {itemType.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.name}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='group'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Group</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select group' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {itemGroup.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.name}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='status'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>Status</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select status' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {itemStatus.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.name}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      {/* <CardFooter>
                        <Button>Save changes</Button>
                      </CardFooter> */}
                    </Card>
                  </TabsContent>
                  <TabsContent value='planing'>
                    <Card>
                      {/* <CardHeader>
                        <CardTitle>Planing</CardTitle>
                        <CardDescription>
                          Change your password here. After saving, you'll be
                          logged out.
                        </CardDescription>
                      </CardHeader> */}
                      <CardContent className='space-y-2'>
                        <div className='grid grid-cols-3 gap-2 '>
                          <FormField
                            control={form.control}
                            name='purchaseLeadTime'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>purchaseLeadTime</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='manufacturingLeadTime'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>manufacturingLeadTime</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='weight'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>weight</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='saftyStock'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>safetyStock</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name='cubicVolumn'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>cubicVolumn</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='lenght'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>lenght</FormLabel>
                                <FormControl>
                                  <Input placeholder='lenght' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='width'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>width</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='height'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>height</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='defualtLocation'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>defualtLocation</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='shefLifeDay'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>shefLifeDay</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='specialInstruction'
                            render={({ field }) => (
                              <FormItem className='space-y-1'>
                                <FormLabel>SpecialInstruction</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <br/>
                          <FormField
                            control={form.control}
                            name='combineMtFlag'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel>Combine Mt Flag</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='lotControlFlag'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel>Lot Control Flag</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      {/* <CardFooter>
                        <Button>Save password</Button>
                      </CardFooter> */}
                    </Card>
                  </TabsContent>
                </Tabs>

                <br />
                <div>
                  <Button className='mt-2 w-full' loading={isLoading}>
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
