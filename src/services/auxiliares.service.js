import axios from "@/services/api.js";

class AuxiliaresService {
  getCombo(tipo, aux){
    return axios.get(`/auxiliares/${tipo}/${aux}`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }

  trocaUser(data) {
    return axios.post("/trocauser", data)
    .then(response => {
      return response;
    },
    (error) => {
      throw new Error(error.data.msg);
    })
  }
  
  getListaAtividades(){
    return axios.get(`/listaatividades`)
    .then(response => {
        return {data: response.data};
    },
    (error) => {
        return error.response.data;
    })
  }
}

export default new AuxiliaresService();