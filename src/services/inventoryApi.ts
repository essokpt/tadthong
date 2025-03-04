import api from '../../config/SetupAxios'

const endpoint = '/Inventory'
const branchId:any = localStorage.getItem("branchId")
//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getInventoryAdjustment(){
  try {
    const response = await api.get(`${endpoint}/Adjustment`);  
    const res = await response.data
    console.log("getInventoryAdjustment:", res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}
export async function getAdjustmentReason(){
  try {
    const response = await api.get(`${endpoint}/AdjustmentReason`);  
    const res = await response.data
    console.log("getAdjustmentReason:", res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}
export async function getInventoryTransfer(){
  try {
    const response = await api.get(`${endpoint}/Transfer`);  
    const res = await response.data
    console.log("getInventoryTransfer:", res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}
export async function searchTransfer(str:any){
  try {
    
    const response = await api.get(`${endpoint}/Transfer/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchAdjustment(str:any){
  try {
    
    const response = await api.get(`${endpoint}/Adjustment/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}
export async function searchHistory(str:any){
  try {
    
    const response = await api.get(`${endpoint}/History/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getOnHandStock(){
  try {
    
    const response = await api.get(`${endpoint}/Stock/${branchId}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}



export async function getStockHistory(){
  try {
    const branchid:any = localStorage.getItem('branchId')
   //onst branchId = parseInt(branchid)
    const response = await api.get(`${endpoint}/History/${branchid}`);  
    const res = await response.data
    console.log('getStockHistory',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findInventory(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchStock(str:any){
  try {
    const response = await api.get(`${endpoint}/Stock/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function createInventory(data:any) {
    try {
      const response = await api.post(endpoint, data);
    
      //const res = await response.data
      console.log('createInventory',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function createInventoryAdjust(data:any) {
    try {
      const response = await api.post(`${endpoint}/Adjustment`, data);
      //const res = await response.data
      console.log('createInventoryAdjust',response);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function createInventoryTransfer(data:any) {
    try {
      const response = await api.post(`${endpoint}/Transfer`, data);
      //const res = await response.data
      console.log('createInventoryTransfer',response.status);
      return response
    } catch (error) {
      console.error(error);
    }
  }

  export async function createInventoryHistory(data:any) {
    // console.error('login',data);
     try {
       const response = await api.post(`${endpoint}/History`, data);
     
       //const res = await response.data
       console.log('create- Inventory History',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  export async function updateInventory(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update branch',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }
  
   

export async function deleteInventory(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('deleteInventory',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
export async function deleteHistory(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/History?id=${id}`);
        console.log('deleteHistory',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }






