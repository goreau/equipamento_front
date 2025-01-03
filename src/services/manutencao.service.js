import axios from "@/services/api.js";

class ServidorService {
  create(tipo, data) {
    return axios.post(`/create_manut/${tipo}`, data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getDados(tipo, id) {
    return axios.get(`/manutencao/${tipo}/${id}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error;
    })
  } 

  update(tipo, data) {
    return axios.put(`/update_manut/${tipo}`, data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  delete(tipo,id) {
    return axios.put(`/delete_manut/${tipo}/${id}`)
    .then(response => {
      return response;
    },
    (error) => {
      return error.response.data;
    })
  }  

  getLista(tipo){
    return axios.get(`/manutencao/${tipo}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }
  
}

export default new ServidorService();