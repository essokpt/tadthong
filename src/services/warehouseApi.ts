import api from '../../config/SetupAxios'

const endpoint = '/Warehouse'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getWarehouse(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
} 

export async function searchWarehouse(str: string){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    console.log('searchWarehouse',res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchWarehouseByBranch(id:any, str: string){
  try {
    const response = await api.get(`${endpoint}/BranchQuery/${id}/${str}`);  
    const res = await response.data
    console.log('getWarehouseByBranch',res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getWarehouseByBranch(id:any){
  try {
    const response = await api.get(`${endpoint}/branch/${id}`);  
    const res = await response.data
    console.log('getWarehouseByBranch',id);
    return res
  } catch (error) {
    console.error(error);
  }
}



export async function findWarehouse(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createWarehouse(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
      console.log('createCustomer',response.status);
      return response
    } catch (error:any) {
      return error.response
    }
  }

  export async function updateWarehouse(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteWarehouse(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }





