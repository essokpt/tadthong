/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../../config/SetupAxios'

const endpoint = '/Expense'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getExpense(pageNumber:number, pageSize:number){
  try {
    const response = await api.get(`${endpoint}/Page?pageNumber=${pageNumber}&pageSize=${pageSize}`);  
    const res = await response.data
    console.log('getExpense', res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchExpense(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getExpenseType(){
  try {
    const response = await api.get(`${endpoint}/Type`);  
    const res = await response.data
    console.log('getExpenseType', res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}



export async function findExpense(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createExpense(data:any) {
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
  
  export async function updateExpense(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update bom',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  
  export async function deleteExpense(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

 
    





