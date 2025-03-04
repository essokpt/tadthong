import api from '../../config/SetupAxios'

const endpoint = '/Vender'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getVenders(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getVenderType(){
  try {
    const response = await api.get(`${endpoint}/VenderType`);  
    const res = await response.data
    console.log("get vendertype:", res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findVender(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    console.log('Find vender:', res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchVender(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    console.log('Find vender:', res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function venderDownloadFileAttach(filename:any){
  try {
    const response = await api.get(`${endpoint}/DownloadFile?filename=${filename}`, {
      responseType: "blob",
    });  
   // const res = await response.data
    return response
  } catch (error) {
    console.error(error);
  }
}

export async function updateVender(data:any) {
  // console.error('login',data);
   try {
     const response = await api.put(endpoint, data);
     console.log('update vender',response.status);
     return response
   } catch (error) {
     console.error(error);
   }
 }

export async function updateVenderBilling(data:any) {
  try {
    const response = await api.put(`${endpoint}/Billing`, data);
    console.log('update Vender Billing',response.status);
    return response
  } catch (error) {
    console.error(error);
  }
}

export async function venderUploadFiles(files:any) {
  try {
  
   const headers = {
     'Content-Type': 'application/x-www-form-urlencoded',
   }
    const response = await api.post(`${endpoint}/UploadFile`, files ,
   {
     headers: headers 
   });
    console.log('uploadFiles',response);
    return response.data
  } catch (error) {
    console.error(error);
  }
}


export async function createVender(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
     // console.log('createVender',response.status);
      return response.data
    } catch (error) {
      return error
    }
  }

export async function createVenderBilling(data:any) {
    try {
      const response = await api.post(`${endpoint}/Billing`, data);
      console.log('createVenderBilling',response.status);
      return response
    } catch (error) {
      return error 
    }
  }

export async function deleteVender(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

export async function deleteVenderBillig(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/Billing?id=${id}`);
        console.log('deleteVenderBillig',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

export async function venderDeleteFileAttach(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/DeleteFileAttach?id=${id}`);
        console.log('venderDeleteFileAttach',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
    





