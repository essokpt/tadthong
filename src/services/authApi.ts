import userTableMock from "@/components/mockdata/userTableMock"

import api from '../../config/SetupAxios'
//import { verify } from "crypto";

//const endpoint = '/Account/authenticate'

export function login(data:any){
    const user = userTableMock.find( x => x.email === data.email )

    if(user?.password === data.password){
        console.log('has user data', user);
        return user
    }else {
        console.log('can"t find user ', data);
    }
}

export async function forgotpassword(data:any){
  try {
    const response = await api.post('/Account/forgotpassword', { email: data.email });
    console.log('forgotpassword',response);
    return response
  } catch (error) {
    console.error(error);
  }
}

export async function resetPassword(data:any){
  try {
    const response = await api.post('/Account/resetpassword', data);
    console.log('resetPassword',response);
    return response
  } catch (error) {
    return error
  }
}


export async function auth(data:any) {
    try {
      const response = await api.post('/Account/authenticate', { username: data.email, password: data.password, branchname: data.branch});
      console.log('auth',response);
      return response.data
    } catch (error) {
      console.error(error);
    }
  }

  export async function getPermission() {
    // console.error('login',data);
     try {
       const response = await api.get('Permission');
       console.log('get permissions',response);
       return response.data
     } catch (error) {
       console.error(error);
     }
   }




