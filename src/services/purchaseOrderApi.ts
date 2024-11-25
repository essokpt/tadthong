import api from '../../config/SetupAxios'

const endpoint = '/PurchaseOrder'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getPurchaseOrder(pageNumber: number,pageSize:number ){
  try {
    const response = await api.get(`${endpoint}/Page?pageNumber=${pageNumber}&pageSize=${pageSize}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseOrderApprove(){
  try {
    const response = await api.get(`${endpoint}/Approve`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseOrderReceipt(){
  try {
    const response = await api.get(`${endpoint}/Receipt`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseOrderItems(str:string){
  try {
    const response = await api.get(`${endpoint}/Items/Query/${str}`);  
    console.log('get getPurchaseOrderItems Items',response);
    
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchPurchaseOrder(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchPurchaseOrderApproved(str:any){
  try {
    const response = await api.get(`${endpoint}/Approved/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchPurchaseOrderReceipt(str:any){
  try {
    const response = await api.get(`${endpoint}/Receipt/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}



export async function findPurchaseOrder(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function purchaseOrderDownloadFileAttach(filename:any){
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

export async function purchaseOrderUploadFiles(files:any) {
  try {
  
   const headers = {
     'Content-Type': 'application/x-www-form-urlencoded',
   }
    const response = await api.post(`${endpoint}/UploadFile`, files ,
   {
     headers: headers 
   });
    console.log('uploadFiles',response.data);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export async function createPurchaseOrder(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
    
      //const res = await response.data
      console.log('createPurchaseOrder',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function createPurchaseOrderItem(data:any) {
    // console.error('login',data);
     try {
       const response = await api.post(`${endpoint}/CreateItem`, data);
     
       const res = await response.data
       console.log('createPurchaseOrder',res);
       return res
     } catch (error) {
       console.error(error);
     }
   }

   export async function createReceiveOrderItem(data:any) {
    // console.error('login',data);
     try {
       const response = await api.post(`${endpoint}/ReceiveItems`, data);
     
       //const res = await response.data
       console.log('createReceiveOrderItem',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  export async function updatePurchaseOrder(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function sendPurchaseOrderApprove(id:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/Approve?id=${id}`);
       console.log('sendPurchaseOrderApprove',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function approvePurchaseOrder(data:any) {
     try {
       const response = await api.put(`${endpoint}/ConfirmApprove`, data);
       console.log('sendPurchaseOrderApprove',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  export async function updatePurchaseOrderItem(data:any) {
    try {
      const response = await api.put(`${endpoint}/UpdateOrderItems`, data);
      console.log('updatePurchaseOrderItem',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function updatePurchaseOrderItemById(data:any) {
    try {
      const response = await api.put(`${endpoint}/UpdateItem`, data);
      console.log('updatePurchaseOrderItem',response);
      return response
    } catch (error) {
      console.error(error);
    }
  }


export async function deletePurchaseOrder(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

export async function deletePurchaseOrderItem(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/Item?id=${id}`);
        console.log('deletePurchaseOrderItem',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
export async function purchaseOrderDeleteFileAttach(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/DeleteFileAttach?id=${id}`);
        console.log('deleteFileAttach',response.status);
        return response.data
      } catch (error) {
        console.error(error);
      }
    }





