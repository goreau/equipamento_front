<template>
    <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Servidor</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Nome</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Nome" v-model="servidor.nome"
                    :class="{ 'is-danger': v$.servidor.nome.$error }" />
                  <span class="is-error" v-if="v$.servidor.nome.$error">
                    {{ v$.servidor.nome.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">{{ strLocal }}</label>
                <div class="control">
                  <CmbTerritorio :id_prop="servidor.id_prop" :tipo="9" @selTerr="servidor.id_base = $event"
                    :errclass="{ 'is-danger': v$.servidor.id_base.$error }" :sel="servidor.id_base" />
                  <span class="is-error" v-if="v$.servidor.id_base.$error">
                    {{ v$.servidor.id_base.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Função</label>
                <div class="control">
                  <CmbAuxiliares @selAux="servidor.id_funcao = $event" :tipo="1"
                    :sel="servidor.id_funcao" />
                  <span class="is-error" v-if="v$.servidor.id_funcao.$error">
                    {{ v$.servidor.id_funcao.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label for="" class="checkbox">
                    <input type="checkbox" v-model="servidor.ativo" :value="1">
                    Ativo
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label for="" class="checkbox">
                    <input type="checkbox" v-model="servidor.temporario" :value="1">
                    Temporário
                  </label>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="update" @cancel="null" @aux="details" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import CmbAuxiliares from "@/components/forms/CmbAuxiliares.vue";
import footerCard from '@/components/forms/FooterCard.vue'
import cadastroService from "@/services/cadastro.service";
import useValidate from "@vuelidate/core";
import {
  required$,
  combo$,
  minLength$,
} from "../../components/forms/validators.js";

export default {
  data() {
    return {
      servidor: {
        id_servidor: 0,
        nome: "",
        id_base: 0,
        id_funcao: 0,
        ativo: true,
        temporario: false,
        owner_id: 0,
      },
      v$: useValidate(),
      isLoading: false,
      message: "",
      caption: "",
      type: "",
      strLocal: "",
      showMessage: false,
      cFooter:{
          strSubmit:'Salvar',
          strCancel: 'Cancelar',
          strAux:'',
          aux: false
        }
    };
  },
  validations(){
    return {
      servidor: {
        nome: { required$, minLength: minLength$(10) },
        id_funcao: { required$, minValue: combo$(1) },
        id_base: { required$, minValue: combo$(1) },
      }
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters["auth/isLogged"];
    },
    currentUser() {
      return this.$store.getters["auth/loggedUser"];
    },
  },
  components: {
    Message,
    Loader,
    CmbTerritorio,
    CmbAuxiliares,
    footerCard
  },
  methods: {
    loadData(){
      this.isLoading = true;

      cadastroService.getServidor(this.servidor.id_servidor).then(
        (response) => {
          let data = response.data;
          this.servidor.nome = data.nome;
          this.servidor.id_base = data.id_base;
          this.servidor.id_funcao = data.id_funcao;
          this.servidor.ativo = data.ativo;
          this.servidor.temporario = data.temporario;
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
          this.caption = "Servidor";
          setTimeout(() => (this.showMessage = false), 3000);
        }
      );

      this.isLoading = false;
    },
    update() {
      this.v$.$validate(); 
      if (!this.v$.$error) {
        document.getElementById("login").classList.add("is-loading");

        servidorService.update(this.servidor).then(
          (response) => {
            this.showMessage = true;
            this.message = "Dados do servidor alterados com sucesso.";
            this.type = "success";
            this.caption = "Servidor";
            setTimeout(() => (this.showMessage = false), 3000);
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
            this.caption = "Servidor";
            setTimeout(() => (this.showMessage = false), 3000);
          }
        )
        .finally(() => {
            document.getElementById("login").classList.remove("is-loading");
          });
      } else {
        this.message = "Corrija os erros para enviar as informações";
        this.showMessage = true;
        this.type = "alert";
        this.caption = "Servidor";
        setTimeout(() => (this.showMessage = false), 3000);
      }
    },
  },
  mounted() {
    this.servidor.owner_id = this.currentUser.id;
  },
  created() {
    this.servidor.id_servidor = this.$route.params.id;
    this.loadData();
  },
};
</script>

<style scoped></style>
