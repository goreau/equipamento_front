import axios from "@/services/api.js";

class MovimentoService {
  create(data) {
    return axios.post("/movimento", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getMovimento(id) {
    return axios.get(`/movimento/${id}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error;
    })
  } 

  update(data) {
    return axios.put("/movimento", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  delete(id) {
    return axios.delete(`/movimento/${id}`)
    .then(response => {
      return response;
    },
    (error) => {
      return error.data.msg;
    })
  }  

  getMovimentos(prop){
    return axios.get(`/movimentos/${prop}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  getCombo(prop){
    return axios.get('/movimentocombo')
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  
}

export default new MovimentoService();