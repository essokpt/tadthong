import axios from "axios";

export function isRole(role){   
   
    const userroles = localStorage.getItem('permisstions')
    const isUserRole = userroles?.includes(role)
    // const isUserRole = array1.find((element) => element === roles);
    console.log('find array:', role);
    // console.log('user roles:', localStorage.getItem('roles'));
        
    return !isUserRole
       
      
}

export async function getVender(url){
    try {
      const response = await axios.get('https://localhost:7244/api/Vender');
      console.log('getVender',url);
      console.log('getVender',response);
      return response.data
    } catch (error) {
      console.error(error);
    }
  }
  

   