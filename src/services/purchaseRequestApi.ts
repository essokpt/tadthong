import api from '../../config/SetupAxios'

const endpoint = '/PurchaseRequest'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);
export async function getPurchaseRequests(){
  try {
    const response = await api.get(`${endpoint}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseRequestItems(str:string){
  try {
    const response = await api.get(`${endpoint}/Items/Query/${str}`);  
    console.log('get PurchaseRequest Items',response);
    
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseRequest(pageNumber:number, pageSize:number){
  try {
    const response = await api.get(`${endpoint}/Page?pageNumber=${pageNumber}&pageSize=${pageSize}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseRequestApprove(){
  try {
    const response = await api.get(`${endpoint}/Approve`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseRequestConvert(){
  try {
    const response = await api.get(`${endpoint}/Convert`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findPurchaseRequest(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
   // console.log('findPurchaseRequest', res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchPurchaseRequest(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchPurchaseRequestConvert(str:any){
  try {
    const response = await api.get(`${endpoint}/Convert/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function searchPurchaseRequestApproved(str:any){
  try {
    const response = await api.get(`${endpoint}/Approved/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function purchaseRequestDownloadFileAttach(filename:any){
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

export async function purchaseRequestUploadFiles(files:any) {
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

export async function createPurchaseRequest(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);    
      const res = await response.data
      console.log('createPurchaseRequest',response.status);
      return res
    } catch (error) {
      console.error(error);
    }
  }

  export async function createPurchaseRequestItem(purchaseRequestId:number, data:any) {
    // console.error('login',data);
     try {
       const response = await api.post(`${endpoint}/CreateItem/${purchaseRequestId}`, data);
     
       const res = await response.data
       console.log('createPurchaseRequest',res);
       return res
     } catch (error) {
       console.error(error);
     }
   }

  export async function updatePurchaseRequest(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  

   export async function updatePurchaseRequestItem(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/UpdateItem`, data);
       console.log('updatePurchaseOrderItem',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }


   export async function approvePurchaseRequest(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/Approve`, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deletePurchaseRequest(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
  
export async function deletePurchaseRequestItem(id:any) {
    try {
      const response = await api.delete(`${endpoint}/item?id=${id}`);
      console.log('deletePurchaseRequestItem',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }
export async function purchaseRequestDeleteFileAttach(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/DeleteFileAttach?id=${id}`);
        console.log('deleteFileAttach',response.status);
        return response.data
      } catch (error) {
        console.error(error);
      }
    }






