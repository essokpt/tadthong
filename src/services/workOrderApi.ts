import api from '../../config/SetupAxios'

const endpoint = '/WorkOrder'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);
export async function workOrderDownloadFileAttach(filename:any){
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

export async function getWorkOrder(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function getProduction(){
  try {
    const response = await api.get(`${endpoint}/Productions`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchWorkOrder(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}
export async function searchProduction(str:any){
  try {
    const response = await api.get(`${endpoint}/Productions/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function findWorkOrder(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function workOrderUploadFiles(files:any) {
  try {
  
   const headers = {
     'Content-Type': 'application/x-www-form-urlencoded',
   }
    const response = await api.post(`${endpoint}/UploadFile`, files ,
   {
     headers: headers 
   });
    console.log('Workorder UploadFiles',response);
    return response
  } catch (error) {
    console.error(error);
  }
}

export async function createWorkOrder(data:any) {
    try {
      const response = await api.post(endpoint, data);
      const res = await response.data
      console.log('createWorkOrder',res);
      
      return res
    } catch (error) {
      console.error(error);
    }
  }
 
 
  export async function updateWorkOrder(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('updateWorkOrder',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }


   export async function updateProduction(data:any) {
    // console.error('login',data);
     try {
      //data.remark =  "Testing"
       const response = await api.put(`${endpoint}/UpdateProduction`, data);
       console.log('updateProduction',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateWorkOrderItems(data:any) {
    const branchId:any = localStorage.getItem('branchId')
    data.branchId = parseInt(branchId)
     try {
       const response = await api.put(`${endpoint}/UpdateWorkOrderItems`, data);
       console.log('updateWorkOrderItems',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }


  export async function deleteWorkOrder(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('deleteWorkOrder',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

  export async function deleteWorkOrderItemById(id:any) {
        try {
          const response = await api.delete(`${endpoint}/DeleteWorkorderUsage?id=${id}`);
          console.log('deleteWorkOrderItemById',response);
          return response
        } catch (error) {
          console.error(error);
        }
      }
  export async function workOrderDeleteFileAttach(id:any) {
    // console.error('login',data);
        try {
          const response = await api.delete(`${endpoint}/DeleteFileAttach?id=${id}`);
          console.log('deleteFileAttach',response.status);
          return response
        } catch (error) {
          console.error(error);
        }
      }
  
    





