import axios from "@/services/api.js";
import authHeader from './auth.header.js';

class AuthService {
    login(user) {
       return axios.post("/login", user)
        .then(response => {
          if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
          } 
    
          return response.data;
        },
        (error) => {
          throw new Error(error.data.message);
       })
    }

    logout() {
      localStorage.removeItem('user');
    }

    register(data) {
      return axios.post("/user", data)
      .then(response => {
        return response;
      },
      (error) => {
        throw new Error(error.data.err);
      });
    }

    list() {
      return axios.get(`/users`)
      .then(response => {
        return response.data;
      })
    }

    update(data) {
      return axios.put("/user", data)
      .then(response => {
        return response.data;
      },
      (error) => {
        throw new Error(error.data.msg);
      });
    }

    firstAccess(data) {
      return axios.put("/firstaccess", data)
      .then(response => {
        return response.data;
      },
      (error) => {
        throw new Error(error.data.msg);
      });
    }

    edit(data) {
      return axios.put('/editUser', data)
      .then(response => {
        return response.data;
      },
      (error) => {
        return error.response.data;
      })
    }

    delete(id) {
      return axios.delete(`/user/${id}`)
      .then(response => {
        return response;
      },
      (error) => {
        return error.data;
      })
    }
  

    getUserData(id) {
      return axios.get(`/user/${id}` )
      .then(response => {
        return response;
      })
    }  

    forgot(data) {
      return axios.post(`/forgot`,data )
      .then(response => {
        return response;
      },
      (error) => {
        throw new Error(error.data);
      })
    }  

    reset(data) {
      return axios.post(`/reset`, data )
      .then(response => {
        return response;
      },
      (error) => {
        throw new Error(error.data);
      })
    }  
    
}

export default new AuthService();