import api from '../../config/SetupAxios'

const endpoint = '/Branch'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getBranch(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    console.log('getBranch', res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findBranch(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchBranch(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createBranch(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
      //const res = await response.data
      console.log('createBranch',response.status);
      return response
    } catch (error:any) {
      console.log('error',error);
      return error.response
    }
  }

  export async function updateBranch(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteBranch(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }





