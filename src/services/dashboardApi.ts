import api from '../../config/SetupAxios'

const endpoint = '/Dashboard'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getDashboard(fromDate:string, toDate:string){
  try {
    const response = await api.get(`${endpoint}?fromDate=${fromDate}&toDate=${toDate}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getUom(){
  try {
    const response = await api.get('/Uom');  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchBom(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findBom(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createBom(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
     // console.log('createCustomer',response.status);
      const res = await response.data

      return res
    } catch (error) {
      console.error(error);
    }
  }
  export async function createBomItem(data:any) {
     try {
       const response = await api.post(`${endpoint}/CreateBomItem`, data);
       console.log('createItem',response);
       //const res = await response.data
 
       return response
     } catch (error:any) {
       return error.response
     }
   }

   export async function createItem(data:any) {
    try {
      const response = await api.post(`${endpoint}/CreateItems`, data);
     // console.log('createItem',response);
     // const res = await response.data

      return response
    } catch (error) {
      console.error(error);
    }
  }
 
  export async function updateBom(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update bom',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateBomItems(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/UpdateBomItems`, data);
       console.log('uupdateBomItems',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function createBomItems(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/Items`, data);
       console.log('createBomItems',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }


  export async function deleteBom(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

  export async function deleteBomItemById(id:any) {
        try {
          const response = await api.delete(`${endpoint}/DeleteBomItem?id=${id}`);
          console.log('createCustomer',response.status);
          return response
        } catch (error) {
          console.error(error);
        }
      }
    





