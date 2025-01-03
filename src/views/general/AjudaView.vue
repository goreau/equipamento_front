<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Materiais Auxiliares</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="columns">
                <ul>
                  <li><a href="/capop/files/instrução.pdf"  target="_blank">Instrução de Preenchimento</a></li>
                  <li><a href="/capop/files/boletim.pdf" target="_blank">Boletim de Campo</a></li>
                  <li><a @click="gerar" target="_blank">Listagem de Códigos</a></li>
                  <li><a href="/capop/files/relação.pdf" target="_blank">Relação de Atividades segundo orgão responsável</a></li>
                  <li><a href="/capop/files/atualizacao.html" target="_blank">Histórico de Atualizações</a></li>
                  <!--<li><a href="./files/atualizacao.html" target="_blank">Atualizações</a></li>-->
                </ul>
                
                <br>
                <br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from '@/components/general/Message.vue';
import { gerarPDF } from './atividades.js';
import auxiliaresService from '@/services/auxiliares.service';
import { publicPath } from '/vue.config.js';

export default {
  name: "GeradorPDF",
  components: {
    Message
  },
  data() {
    return {
      message: "",
      caption: "",
      type: "",
      showMessage: false,
    }
  },
  methods: {
    closeMessage(){
      this.showMessage = false;
    },
    gerar() {
      auxiliaresService.getListaAtividades().then(
        (response) => {
          let data = response.data;
          gerarPDF(data);
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.response.data ||
            error.message ||
            error.toString();
          this.showMessage = true;
          this.type = "alert";
          this.caption = "Ajuda";
          setTimeout(() => (this.showMessage = false), 3000);
        }
      );

    }
  },
};
</script>
<style scoped>
  li {
    padding-top: 1rem;
  }
</style>