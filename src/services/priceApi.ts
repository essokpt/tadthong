import api from '../../config/SetupAxios'

const endpoint = '/Price'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getPrice(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    console.log('getPrice:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findPrice(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createPrice(data:any) {
    try {
      const response = await api.post(endpoint, data);      
      const res = await response.data
      console.log('createPrice',res);
      return res
    } catch (error:any) {
      return error.response
    }
  }

  
  export async function updatePrice(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update bom',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deletePrice(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('deletePrice',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }







