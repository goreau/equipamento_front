import axios from "@/services/api.js";

class CadastroService {
  create(data) {
    return axios.post("/cadastro", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  getCadastro(id) {
    return axios.get(`/cadastro/${id}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error;
    })
  } 

  update(data) {
    return axios.put("/cadastro", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }

  delete(id) {
    return axios.delete(`/cadastro/${id}`)
    .then(response => {
      return response;
    },
    (error) => {
      return error.data.msg;
    })
  }  

  getCadastros(prop){
    return axios.get(`/cadastros/${prop}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  getCombo(){
    return axios.get('/cadastrocombo')
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  
}

export default new CadastroService();