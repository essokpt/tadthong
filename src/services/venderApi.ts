import axios from 'axios';

//const baseUrl = process.env.REACT_APP_BASE_API
export const fetcher = (url: string) =>  axios.get(url).then((res) => res.data);

export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

export async function getVender(url:string){
  try {
    const response = await axios.get(url);  
    const res = await response.data
    return res
  } catch (error) {
    console.error(error);
  }
}

export async function auth(data:any) {
   // console.error('login',data);
    try {
      const response = await axios.post('https://localhost:7244/api/Account/authenticate', { username: data.email, password: data.password });
      console.log('auth',response);
      return response.data
    } catch (error) {
      console.error(error);
    }
  }

  export async function getPermission() {
    // console.error('login',data);
     try {
       const response = await axios.get('https://localhost:7244/api/Permission');
       console.log('get permissions',response);
       return response.data
     } catch (error) {
       console.error(error);
     }
   }




