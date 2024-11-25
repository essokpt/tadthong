import GeneralError from '@/pages/errors/general-error'
//import  { lazy} from 'react'
import { Route, Routes} from 'react-router-dom'

export function MasterRoutes() {
  // const Customers = lazy(() =>  import('../pages/master/customer'))
  // const Venders = lazy(() =>  import('../pages/master/vender'))
  // const Suppliers = lazy(() =>  import('../pages/master/supplier'))
  // const Users = lazy(() =>  import('../pages/master/user'))
 
  return (
      <Routes>
        {/* <Route path='/master/customer' element={<Customers/>} />
        <Route path='/master/vender' element={<Venders/>} />
        <Route path='/master/supplier' element={<Suppliers/>} />
        <Route path='/master/user' element={<Users/>} />
        */}
        <Route errorElement={<GeneralError/>} />
      </Routes>
    
  )
}
