import { Layout, LayoutBody } from '@/components/custom/layout'
import { findCustomer } from '@/services/customerApi'
import { useEffect, useState } from 'react'
import { Customer } from './schema'
import { useParams } from 'react-router-dom'
import { CustomerForm } from './customer-form'

type Param = {
  id:string
};

export default function EditCustomer() {

  const {id}  = useParams<Param>();
  const [reload, setReload] = useState(true)
  const [formData, setFormData] = useState<Customer[]>([])
  async function getCus(id:string) {
    const response = await findCustomer(id)
    const res:any = await response;
    setFormData(res)
    setReload(false)
  }     
  useEffect(() => {  
    if(id) {   
      getCus(id)
      console.log('getCus', formData);      
    }    
  }, [reload])   

  return (
    <Layout>
      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Edit Customer:</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>        
          { formData ? (
              <p>Hello</p>
          ) : ( <></>)
          }

{formData.map(({ code }: any) => {
          return <p>{code}</p>
        })}
                  
          {/* <DataTable data={data} columns={columns} /> */}
             <CustomerForm/>
        </div>
      </LayoutBody>
    </Layout>
  )
}
