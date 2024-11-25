import api from '../../config/SetupAxios'

const endpoint = '/ApproveMaterial'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getApproveMaterial(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findApproveMaterial(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createApproveMaterial(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
      console.log('createCustomer',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function updateApproveMaterial(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteApproveMaterial(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }





