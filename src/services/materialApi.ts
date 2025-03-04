import api from '../../config/SetupAxios'

const endpoint = '/Material'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getMaterial(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    console.log('getMaterial:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function getMaterialApprove(){
  try {
    const response = await api.get(`${endpoint}/RequestApprove`); 
    const res = await response.data
    console.log('getMaterial:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchMaterial(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`); 
    const res = await response.data
    console.log('searchMaterial:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchMaterialApprove(str:any){
  try {
    const response = await api.get(`${endpoint}/Approved/Query/${str}`); 
    const res = await response.data
    console.log('searchMaterial:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function findMaterial(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createMaterial(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
    //  const res = await response.data
      console.log('createMaterial',response);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function createMaterialItem(importMaterialId: number, data:any) {
    // console.error('login',data);
     try {
       const response = await api.post(`${endpoint}/CreateItem/${importMaterialId}`, data);
       console.log('createMaterialItem',response);
       return response
     } catch (error) {
       console.error(error);
     }
   }
 

  export async function updateMaterial(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update Material',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteMaterial(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }







