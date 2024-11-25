import api from '../../config/SetupAxios'

const endpoint = '/User'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getUsers(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    console.log("getUsers");    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findUser(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    console.log('findUser',res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getUserProfile(id:any){
  try {
    const response = await api.get(`${endpoint}/profile/${id}`);  
    const res = await response.data
    console.log('getUserProfile',res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchUser(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    console.log('findUser',res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createUser(data:any) {
    try {
      const response = await api.post(endpoint, data);
      console.log('createCustomer',response.status);
      const res = await response.data
      return res
    } catch (error) {
      console.error(error);
    }
  }

  
export async function createBranchUser(data:any) {
  try {
    const response = await api.post(`${endpoint}/CreateBranchUser`, data);
    console.log('createBranchUser',response.status);
   // const res = await response.data
    return response
  } catch (error) {
    console.error(error);
  }
}

export async function uploadUserImage(image:any) {
  // console.error('login',data);
   try {
   
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    console.log('uploadUserImage',image);

     const response = await api.post(`${endpoint}/uploadimage`, image ,
    {
      headers: headers 
    });
     console.log('uploadUserImage',response.status);
     return response
   } catch (error) {
     console.error(error);
   }
 }
  export async function updateUserRoleBranch(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/CreateRoleBranch`, data);
       console.log('updateUserRoleBranch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateUser(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}`, data);
       console.log('updateUser',response);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function editUserRoleBranch(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/UpdateBranchUser`, data);
       console.log('editUserRoleBranch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteUser(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
    export async function deleteBranchUser(id:any) {
          try {
            const response = await api.delete(`${endpoint}/DeleteBranchUser?id=${id}`);
            console.log('deleteBranchUser',response.status);
            return response
          } catch (error) {
            return error
          }
        }





