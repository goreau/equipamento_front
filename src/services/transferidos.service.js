import axios from "@/services/api.js";

class TransferidosService {
  create(data) {
    return axios.post("/transferidos", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getTransferidos(id) {
    return axios.get(`/transferidos/${id}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error;
    })
  } 

  update(data) {
    return axios.put("/transferidos", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  delete(id) {
    return axios.delete(`/transferidos/${id}`)
    .then(response => {
      return response;
    },
    (error) => {
      return error.data.msg;
    })
  }  

  getTransferidoss(){
    return axios.get(`/transferidoss`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  getTransferidosOpen(id){
    return axios.get(`/transferidos/${id}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  generate(id){
    return axios.get(`/generate/${id}`)
    .then(response => {
        return response;
    },
    (error) => {
        throw new Error(error.data.msg);
    })
  }

  getCombo(){
    return axios.get('/transferidoscombo')
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }
}

export default new TransferidosService();