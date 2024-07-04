import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/'
  });
  
class APIClient {
    endpoint
    constructor(endpoint) {
      this.endpoint = endpoint;
    }
    getWithToken = () =>{
      let token = localStorage.getItem("auth-token");
      console.log(token);
      const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
      };
      return axiosInstance.get(this.endpoint,config).then((res) => res.data)
    }
    get = (config) => {
      
      return axiosInstance.get(this.endpoint,config).then((res) => res.data)
    }
    post = (item,params) => {
        return axiosInstance.post(this.endpoint,item,{params: params}).then((res) => res);
    }
    postWithToken = (item,params) => {
      let token = localStorage.getItem("auth-token");
      console.log(token);
      const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: params
      };
      return axiosInstance.post(this.endpoint,item,config).then((res) => res);
    }
    put = (item,params) => {
      return axiosInstance.put(this.endpoint,item,{params: params}).then((res) => res);
    }
    putWithToken = (item,params) => {
      let token = localStorage.getItem("auth-token");
      console.log(token);
      const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
      };
      return axiosInstance.put(this.endpoint,item,config).then((res) => res);
    }
    del = (params) => {
      return axiosInstance.delete(this.endpoint,{params: params}).then((res) => res);
    }
    delWithToken = (password) => {
      let token = localStorage.getItem("auth-token");
      console.log(token);
      const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'password': password
          }
      };
      return axiosInstance.delete(this.endpoint,config).then((res) => res);
    }
  }
  
  export default APIClient;