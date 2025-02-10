<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Equipamento em Município</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Município</label>
                <div class="control">
                  <CmbTerritorio :tipo="4" @selTerr="equipamun.id_municipio = $event"
                    :errclass="{ 'is-danger': v$.equipamun.id_municipio.$error }" />
                  <span class="is-error" v-if="v$.equipamun.id_municipio.$error">
                    {{ v$.equipamun.id_municipio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Tipo</label>
                <div class="control">
                  <CmbAuxiliares @selAux="equipamun.tipo = $event" :tipo="3"
                    :sel="equipamun.tipo" />
                  <span class="is-error" v-if="v$.equipamun.tipo.$error">
                    {{ v$.equipamun.tipo.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Fabricante</label>
                <div class="control">
                  <CmbAuxiliares @selAux="equipamun.fabricante = $event" :tipo="1"
                    :sel="equipamun.fabricante" />
                  <span class="is-error" v-if="v$.equipamun.fabricante.$error">
                    {{ v$.equipamun.fabricante.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Modelo</label>
                <div class="control">
                  <CmbAuxiliares @selAux="equipamun.modelo = $event" :tipo="4" :aux="equipamun.fabricante" :extra="equipamun.tipo"
                    :sel="equipamun.modelo" />
                  <span class="is-error" v-if="v$.equipamun.modelo.$error">
                    {{ v$.equipamun.modelo.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Próprios</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Nome" v-model="equipamun.proprio"
                    :class="{ 'is-danger': v$.equipamun.proprio.$error }" />
                  <span class="is-error" v-if="v$.equipamun.proprio.$error">
                    {{ v$.equipamun.proprio.$errors[0].$message }}
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
import equipamunService from "@/services/equipamun.service";
import useValidate from "@vuelidate/core";
import {
  required$,
  combo$,
  numeric$
} from "../../components/forms/validators.js";

export default {
  data() {
    return {
      equipamun: {
        id_municipio: 0,
        fabricante: 0,
        tipo: 0,
        modelo: 0,
        proprio: 0,
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
      equipamun: {
        tipo: { required$, minValue: combo$(1) },
        fabricante: { required$, minValue: combo$(1) },
        modelo: { required$, minValue: combo$(1) },
        id_municipio: { required$, minValue: combo$(1) },
        proprio: { numeric$ },
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

        equipamunService.create(this.equipamun).then(
          (response) => {
            this.showMessage = true;
            this.message = "Equipamento cadastrado com sucesso.";
            this.type = "success";
            this.caption = "Equipamento";
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
            this.caption = "Equipamento";
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
        this.caption = "Equipamento";
        setTimeout(() => (this.showMessage = false), 3000);
      }
    },
  },
  mounted() {
    this.equipamun.owner_id = this.currentUser.id;
    if (this.currentUser.nivel == 9){
      this.message = "Você não tem permissão para cadastrar novos equipamentos";
        this.showMessage = true;
        this.type = "alert";
        this.caption = "Equipamento";
        setTimeout(() => {this.showMessage = false; this.$router.push('/equipMuns'); }, 3000);
    }
  },
};
</script>

<style scoped></style>
