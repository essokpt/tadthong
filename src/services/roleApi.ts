import api from '../../config/SetupAxios'

const endpoint = '/Role'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getRoles(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPermissions(){
  try {
    const response = await api.get('/Permission');  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findRole(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}
export async function searchRole(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createRole(data:any) {
    try {
      const response = await api.post(endpoint, data);
      console.log('createRole',response.status);
      const res = await response.data
       return res
    } catch (error:any) {
      return error.response
    }
  }

  export async function updateRole(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('updateRoleWithPermissions',response.status);
      // const res = await response.data
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateRoleWithPermissions(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/UpdatePermission`, data);
       console.log('updateRoleWithPermissions',response.status);
      // const res = await response.data
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteRole(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }





