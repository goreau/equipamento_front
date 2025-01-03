<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Equipamento</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label for="" class="label">Tipo</label>
                <div class="control">
                  <CmbAuxiliares @selAux="cadastro.tipo = $event" :tipo="3"
                    :sel="cadastro.tipo" />
                  <span class="is-error" v-if="v$.cadastro.tipo.$error">
                    {{ v$.cadastro.tipo.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Fabricante</label>
                <div class="control">
                  <CmbAuxiliares @selAux="cadastro.fabricante = $event" :tipo="1"
                    :sel="cadastro.fabricante" />
                  <span class="is-error" v-if="v$.cadastro.fabricante.$error">
                    {{ v$.cadastro.fabricante.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Modelo</label>
                <div class="control">
                  <CmbAuxiliares @selAux="cadastro.modelo = $event" :tipo="4" :aux="cadastro.fabricante"
                    :sel="cadastro.modelo" />
                  <span class="is-error" v-if="v$.cadastro.modelo.$error">
                    {{ v$.cadastro.modelo.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Patrimônio</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Nome" v-model="cadastro.patrimonio"
                    :class="{ 'is-danger': v$.cadastro.patrimonio.$error }" />
                  <span class="is-error" v-if="v$.cadastro.patrimonio.$error">
                    {{ v$.cadastro.patrimonio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Ano de Fabricação</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Nome" v-model="cadastro.ano"
                    :class="{ 'is-danger': v$.cadastro.ano.$error }" />
                  <span class="is-error" v-if="v$.cadastro.ano.$error">
                    {{ v$.cadastro.ano.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Local</label>
                <div class="control">
                  <CmbTerritorio :tipo="2" @selTerr="cadastro.origem = $event"
                    :errclass="{ 'is-danger': v$.cadastro.origem.$error }" />
                  <span class="is-error" v-if="v$.cadastro.origem.$error">
                    {{ v$.cadastro.origem.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Condição</label>
                <div class="control">
                  <CmbAuxiliares @selAux="cadastro.condicao = $event" :tipo="2"
                    :sel="cadastro.condicao" />
                  <span class="is-error" v-if="v$.cadastro.condicao.$error">
                    {{ v$.cadastro.condicao.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Destino</label>
                <div class="control">
                  <CmbTerritorio :tipo="2" @selTerr="cadastro.destino = $event"
                    :errclass="{ 'is-danger': v$.cadastro.destino.$error }" />
                  <span class="is-error" v-if="v$.cadastro.destino.$error">
                    {{ v$.cadastro.destino.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Município</label>
                <div class="control">
                  <CmbTerritorio :tipo="4" @selTerr="cadastro.cedido_mun = $event"
                    :errclass="{ 'is-danger': v$.cadastro.cedido_mun.$error }" />
                  <span class="is-error" v-if="v$.cadastro.cedido_mun.$error">
                    {{ v$.cadastro.cedido_mun.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="create" @cancel="null" @aux="details" :cFooter="cFooter" />
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
      cadastro: {
        origem: 0,
        destino: 0,
        cedido_mun: 0,
        patrimonio: "",
        ano: "",
        tipo: 0,
        fabricante: 0,
        modelo: 0,
        condicao: 0,
        owner_id: 0,
      },
      v$: useValidate(),
      isLoading: false,
      message: "",
      caption: "",
      strLocal: "Local",
      type: "",
      showMessage: false,
      cFooter: {
        strSubmit: 'Cadastrar',
        strCancel: 'Cancelar',
        strAux: '',
        aux: false
      }
    };
  },
  validations() {
    return {
      cadastro: {
        patrimonio: { required$, minLength: minLength$(5) },
        ano: {required$, minValue: 1960, maxValue: 2025},
        origem: { required$, minValue: combo$(1) },
        destino: { required$, minValue: combo$(1) },
        cedido_mun: { required$, minValue: combo$(1) },
        fabricante: { required$, minValue: combo$(1) },
        modelo: { required$, minValue: combo$(1) },
        tipo: { required$, minValue: combo$(1) },
        condicao: { required$, minValue: combo$(1) },
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
    create() {
      this.v$.$validate();
      if (!this.v$.$error) {
        document.getElementById("login").classList.add("is-loading");

        cadastroService.create(this.cadastro).then(
          (response) => {
            this.showMessage = true;
            this.message = "Servidor cadastrado com sucesso.";
            this.type = "success";
            this.caption = "Servidor";
            setTimeout(() => (this.showMessage = false), 3000);
          },
          (error) => {
            this.message = error;
            /* (error.response &&
               error.response.data &&
               error.response.data.message) ||
             error.data.err ||
             error.message ||
             error.toString();*/
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
    this.cadastro.owner_id = this.currentUser.id;
  },
};
</script>

<style scoped></style>
