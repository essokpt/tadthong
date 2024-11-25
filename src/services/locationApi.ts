import api from '../../config/SetupAxios'

const endpoint = '/Location'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getLocation(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function getLocationByBranch(id:any){
  try {
    const response = await api.get(`${endpoint}/branch/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchLocation(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchLocationByBranch(barnchId:any, str:any){
  try {
    const response = await api.get(`${endpoint}/BranchQuery/${barnchId}/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findLocation(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createLocation(data:any) {
    try {
      const response = await api.post(endpoint, data);
      console.log('createLocation',response);
      return response
    } catch (error:any) {
      return error.response
    }
  }

  export async function updateLocation(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteLocation(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('deleteLocation',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }





