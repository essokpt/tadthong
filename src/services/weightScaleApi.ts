import api from '../../config/SetupAxios'

const endpoint = '/WeightScalePrice'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getWeightScale(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getWeightScaleApprove(){
  try {
    const response = await api.get(`${endpoint}/Approve`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function searchWeightScale(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function gethWeightScaleVenderType(){
  try {
    const response = await api.get(`${endpoint}/VenderType`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findWeightScale(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createWeightScale(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
     // console.log('createCustomer',response.status);
      const res = await response

      return res
    } catch (error) {
      console.error(error);
    }
  }
  export async function createWeightScaleItem(data:any) {
     try {
       const response = await api.post(`${endpoint}/CreateWeightScaleItem`, data);
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
 
  export async function updateWeightScale(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update updateWeightScale',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateWeightScaleItems(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/updateWeightScaleItem`, data);
       console.log('updateWeightScaleItems',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function createWeightScaleItems(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/Items`, data);
       console.log('createWeightScaleItems',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }


  export async function deleteWeightScale(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

  export async function deleteWeightScaleItemById(id:any) {
        try {
          const response = await api.delete(`${endpoint}/deleteWeightScaleItem?id=${id}`);
          console.log('deleteWeightScaleItemById',response.status);
          return response
        } catch (error) {
          console.error(error);
        }
      }
    





