import api from '../../config/SetupAxios'

const endpoint = '/Customer'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getCustomer(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    console.log('getCustomer',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findCustomer(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchCustomer(str:any){
  try {
    console.log("search customer", str);
    
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createCustomer(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
      console.log('createCustomer',response.status);
      return response
    } catch (error) {
     return error
    }
  }
export async function createCustomerBilling(data:any) {
    try {
      const response = await api.post(`${endpoint}/Billing`, data);
      console.log('createCustomerBilling',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function updateCustomerBilling(data:any) {
    try {
      const response = await api.put(`${endpoint}/Billing`, data);
      console.log('updateCustomerBilling',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function updateCustomer(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update Customer',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteCustomer(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

export async function deleteCustomerBilling(id:any) {
      try {
        const response = await api.delete(`${endpoint}/Billing/?id=${id}`);
        console.log('deleteCustomerBilling',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
    





