import api from '../../config/SetupAxios'

const endpoint = '/Forecast'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getForecast(pageNumber:number, pageSize:number){
  try {
    const response = await api.get(`${endpoint}/Page?pageNumber=${pageNumber}&pageSize=${pageSize}`);  
    const res = await response.data
    console.log('getForecast', res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchForecast(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}



export async function findForecast(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createForecast(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
     // console.log('createCustomer',response.status);
     // const res = await response.data

      return response
    } catch (error) {
      console.error(error);
    }
  }
  
  export async function updateForecast(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update bom',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  
  export async function deleteForecast(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

 
    





