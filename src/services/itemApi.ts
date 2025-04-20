import api from '../../config/SetupAxios'

const endpoint = '/ItemMaster'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getItem(){
  try {
    const response = await api.get(endpoint);  
    const res = await response.data
    console.log('getItem:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getWip(month:number, year: number){
  try {
    const response = await api.get(`${endpoint}/Wip/${month}/${year}`);  

    const res = await response.data
    console.log("getWip", res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getItemCategory(){
  try {
    const response = await api.get(`${endpoint}/Category`);  
    const res = await response.data
    console.log('getItemCategory:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getItemType(){
  try {
    const response = await api.get(`${endpoint}/Type`);  
    const res = await response.data
    console.log('getItemType:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getItemGroup(){
  try {
    const response = await api.get(`${endpoint}/Group`);  
    const res = await response.data
    console.log('getItemGroup:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getAccountCode(){
  try {
    const response = await api.get(`${endpoint}/AccountCode`);  
    const res = await response.data
    console.log('getAccountCode:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getItemPrice(){
  try {
    const response = await api.get(`${endpoint}/price`);  
    const res = await response.data
    console.log('getPrice:',res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getItemPriceById(id:any){
  try {
    console.log('getItemPriceById:',id);
    const response = await api.get(`${endpoint}/price/${id}`);  
    console.log('getPrice:',response);
    const res = await response.data
   
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getItemMaster(){
  try {
    const response = await api.get(`${endpoint}/Master`);  
    const res = await response.data
    console.log('getItemMaster:',res);

    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getItemBom(){
  try {
    const response = await api.get(`${endpoint}/Bom`);  
    const res = await response.data
    console.log('getItemBom:',res);

    return res
  } catch (error) {
    console.error(error);
  }
}


export async function getItemBomItem(){
  try {
    const response = await api.get(`${endpoint}/BomItem`);  
    const res = await response.data
    console.log('getItemBomItem:',res);

    return res
  } catch (error) {
    console.error(error);
  }
}


export async function searchWip(str:any){
  try {
    const response = await api.get(`${endpoint}/Wip/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchItem(str:any){
  try {
    const response = await api.get(`${endpoint}/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchPrice(str:any){
  try {
    const response = await api.get(`${endpoint}/Price/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function searchAvl(str:any){
  try {
    const response = await api.get(`${endpoint}/Avl/Query/${str}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function findItem(id:any){
  try {
    const response = await api.get(`${endpoint}/${id}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function itemMasterDownloadFileAttach(filename:any){
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
export async function updateWipValue(data:any) {
  // console.error('login',data);
   try {
     const response = await api.put(`${endpoint}/WipValue`, data);
     console.log('updateWipValue',response);
     //const res = await response.data
     return response
   } catch (error:any) {
     return error.response
   }
 }

 export async function UpdateProductionWip(data:any) {
  // console.error('login',data);
   try {
     const response = await api.put(`${endpoint}/UpdateProductionWip`, data);
     console.log('UpdateProductionWip',response);
     //const res = await response.data
     return response
   } catch (error:any) {
     return error.response
   }
 }


export async function createVenderItem(data:any) {
  // console.error('login',data);
   try {
     const response = await api.post(`${endpoint}/CreateItemVenderList`, data);
     console.log('create Vender Item',response.status);
     const res = await response.data
     return res
   } catch (error:any) {
     return error.response
   }
 }


export async function updateItemVender(data:any) {
  // console.error('login',data);
   try {
     const response = await api.put(`${endpoint}/Vender`, data);
     console.log('addItemVender',response.status);
     return response
   } catch (error) {
     console.error(error);
   }
 }

 

export async function createWip(id:number) {
  // console.error('login',data);
   try {
     const response = await api.post(`${endpoint}/CreateWip?itemMasterId=${id}`);
     console.log('createWip',response);
     //const res = await response.data
     return response
   } catch (error) {
     return error
   }
 }


export async function createItem(data:any) {
   // console.error('login',data);
    try {
      const response = await api.post(endpoint, data);
      console.log('createCustomer',response.status);
      const res = await response.data
      return res
    } catch (error) {
      return error
    }
  }

  export async function itemMasterUploadFiles(files:any) {
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

  export async function updateItem(payload:any) {
    // console.error('login',payload);
     try {
       const response = await api.put(endpoint, payload);
       console.log('update bom',response.data);
       return response
     } catch (error) {
       console.error(error);
     }
   }

export async function deleteItem(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

export async function itemMasterDeleteFileAttach(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}/DeleteFileAttach?id=${id}`);
        console.log('itemMasterDeleteFileAttach',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

    export async function deleteVenderitem(id:any) {
      try {
        const response = await api.delete(`${endpoint}/DeleteItemVenderList?id=${id}`);
        console.log('deleteVenderitem',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }
    







