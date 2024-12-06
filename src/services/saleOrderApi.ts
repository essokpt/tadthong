import api from '../../config/SetupAxios'
const endpoint = '/SaleOrder'

export async function getSaleOrder(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchSaleOrder(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchSaleOrderItems(str:any){
  try {
    const response = await api.get(`${endpoint}/OrderItems/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchInvoice(str:any){
  try {
    const response = await api.get(`${endpoint}/Invoices/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getInvoice(){
  try {
    const response = await api.get(`${endpoint}/Invoices`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function downloadFileAttach(filename:any){
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

export async function getSaleOrderItems(){
  try {
    const response = await api.get(`${endpoint}/SaleOrderItems`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findSaleOrder(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findInvoiceById(id:any){
  try {
    const response = await api.get(`${endpoint}/Invoice/${id}`);  
    
    const res = await response.data   
    console.log('findInvoiceById:',res); 
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function uploadFiles(files:any) {
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

export async function createSaleOrder(data:any) {
   // console.error('login',data);
    try {
      console.log('createSaleOrder',data);
      const response = await api.post(endpoint, data);
    
      //const res = await response.data
      console.log('createSaleOrder response',response);
      return response.data
    } catch (error) {
      console.error(error);
    }
  }

  export async function createInvoice(data:any) {
    // console.error('login',data);
     try {
       const response = await api.post(`${endpoint}/GenerateInvoice`, data);
     
       //const res = await response.data
       console.log('createInvoice',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  export async function createSaleOrderItem(data:any) {
    // console.error('login',data);
     try {
       const response = await api.post(`${endpoint}/CreateOrderItem`, data);
     
       const res = await response.data
       console.log('createSaleOrderItem',res);
       return res
     } catch (error) {
       console.error(error);
     }
   }

  export async function updateSaleOrderCompleted(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(`${endpoint}/UpdateSaleOrderCompleted`,data);
       console.log('updateSaleOrderCompleted',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateSaleOrder(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

   export async function updateSaleOrderItem(data:any) {
     try {
       const response = await api.put(`${endpoint}/UpdateOrderItem`, data);
       console.log('updateSaleOrderItem',response.status);
       return response.data
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteSaleOrder(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('deleteSaleOrder',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

export async function deleteInvoice(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/Invoice?id=${id}`);
        console.log('deleteInvoice',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

    export async function deleteFileAttach(id:any) {
      // console.error('login',data);
          try {
            const response = await api.delete(`${endpoint}/DeleteFileAttach?id=${id}`);
            console.log('deleteFileAttach',response.status);
            return response
          } catch (error) {
            console.error(error);
          }
        }
    
    export async function deleteSaleOrderItem(id:any) {
      // console.error('login',data);
          try {
            const response = await api.delete(`${endpoint}/DeleteSaleOrderItem?id=${id}`);
            console.log('deleteSaleOrderItem',response.status);
            return response
          } catch (error) {
            console.error(error);
          }
        }




