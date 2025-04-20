import axios from 'axios'

export default axios.create({
 // baseURL: "https://localhost:7244/api",
  baseURL: "http://tadthongback.c-space.store/api",
  headers: {
    "Access-Control-Allow-Origin": "*",
    'content-type': 'application/json',
    'Accept': 'application/json',
  }
  // interceptors.request.use(
  //  multipart/form-data
  //   (config: any) => {
  //     const accessToken = localStorage.getItem('accessToken')

  //     if (accessToken) {
  //       config.headers.Authorization = `Bearer ${accessToken}`
  //     }

  //     return config
  //   },
  //   (err: any) => Promise.reject(err)
  // )
});

//export const axios = axios.create();

//axios.defaults.baseURL = `${process.env.VUE_APP_BASE_API}`
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//HTTP.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

