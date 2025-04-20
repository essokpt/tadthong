import api from '../../config/SetupAxios'

const endpoint = '/Report'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);
export async function getWeightScaleReport(fromDate:string, toDate:string, productId:number){
  try {
    const response = await api.get(`${endpoint}/WeightScale?fromDate=${fromDate}&toDate=${toDate}&productId=${productId}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}


export async function getSaleOrderReport(fromDate:string, toDate:string, productId:number, customerId:number, woCode:string){
  try {
    const response = await api.get(`${endpoint}/SaleOrderReport?fromDate=${fromDate}&toDate=${toDate}&productId=${productId}&customerId=${customerId}&woCode=${woCode}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getPurchaseRequestReport(fromDate:string, toDate:string, productId:number, venderId:number, prCode:string){
  try {
    const response = await api.get(`${endpoint}/PurchaseRequest?fromDate=${fromDate}&toDate=${toDate}&productId=${productId}&venderId=${venderId}&prCode=${prCode}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}



export async function getForecast(pageNumber:number, pageSize:number){
  try {
    const response = await api.get(`${endpoint}/Page?pageNumber=${pageNumber}&pageSize=${pageSize}`);  
    const res = await response.data
    console.log('getForecast', res);
    
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function getMasterReport(year:number ,month: number ){
  try {
    const response = await api.get(`${endpoint}/Master?year=${year}&month=${month}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}



export async function getDailyReport(year:number ,month: number ){
  try {
    const response = await api.get(`${endpoint}/Daily?year=${year}&month=${month}`);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}


  export async function updateForecast(data:any) {
    // console.error('login',data);
     try {
       const response = await api.put(endpoint, data);
       console.log('update bom',response.status);
       return response
     } catch (error) {
       console.error(error);
     }
   }

  
  export async function deleteForecast(id:any) {
  // console.error('login',data);
      try {
        const response = await api.delete(`${endpoint}?id=${id}`);
        console.log('createCustomer',response.status);
        return response
      } catch (error) {
        console.error(error);
      }
    }

 
    





