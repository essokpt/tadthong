import api from '../../config/SetupAxios'

const endpoint = '/Company'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);
export async function companyDownloadFileAttach(filename:any){
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

export async function getCompany(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    console.log('getCompany', res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findCompany(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    console.log('findCompany', res);
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function companyUploadFiles(files:any) {
  try {
  
   const headers = {
     'Content-Type': 'application/x-www-form-urlencoded',
   }
    const response = await api.post(`${endpoint}/UploadFile`, files ,
   {
     headers: headers 
   });
    console.log('uploadFiles',response.status);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export async function createCompany(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
      console.log('createCustomer',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function updateCompany(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('updateCompany',response.status);
       return response.data
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateCompanyLogo(data:any) {
    // console.error('login',data);
     try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
       const response = await api.post(`${endpoint}/uploadlogo`, data, {
        headers: headers 
      });
       console.log('updateCompany',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteCompany(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
export async function companyDeleteFileAttach(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/DeleteFileAttach?id=${id}`);
        console.log('deleteFileAttach',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }





