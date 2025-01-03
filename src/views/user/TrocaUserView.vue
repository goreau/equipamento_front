<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Excluir Usuário</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <div class="field">
                    <label class="label">Local</label>
                    <div class="control">
                      <CmbTerritorio :id_prop="id_user" :tipo="9" @selTerr="id_local = $event" />
                    </div>
                  </div>
                </div>
              </div>
              <hr>
              <div class="columns" v-if="id_local > 0">
                <div class="column is-5">
                  <div class="field">
                    <label for="" class="label">Usuário a ser excluído</label>
                    <div class="control">
                      <CmbAuxiliares :tipo="11" :aux="id_local" @selAux="id_sai = $event" :id="'sai'"
                        :errclass="{ 'is-danger': v$.id_sai.$error }" />
                      <span class="is-error" v-if="v$.id_sai.$error">
                        {{ v$.id_sai.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-5 is-offset-2">
                  <div class="field">
                    <label for="" class="label">Usuário que irá receber a produção</label>
                    <div class="control">
                      <CmbAuxiliares :tipo="11" :aux="id_local" @selAux="id_fica = $event" :id="'fica'"
                        :errclass="{ 'is-danger': v$.id_fica.$error }" />
                      <span class="is-error" v-if="v$.id_fica.$error">
                        {{ v$.id_fica.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <br>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="register" @cancel="null" @aux="details" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
  <confirm-dialog ref="confirmDialog"></confirm-dialog>
</template>

<script>
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import footerCard from '@/components/forms/FooterCard.vue'
import auxiliaresService from "@/services/auxiliares.service";
import useValidate from "@vuelidate/core";
import {
  required$,
  combo$,
} from "../../components/forms/validators.js";
import CmbAuxiliares from "@/components/forms/CmbAuxiliares.vue";
import ConfirmDialog from "@/components/forms/ConfirmDialog.vue";

export default {
  data() {
    return {
      id_user: 0,
      id_local: 0,
      id_fica: 0,
      id_sai: 0,
      v$: useValidate(),
      isLoading: false,
      message: "",
      caption: "",
      type: "",
      showMessage: false,
      cFooter: {
        strSubmit: 'Excluir',
        strCancel: 'Cancelar',
        strAux: '',
        aux: false
      }
    };
  },
  validations() {
    return {
      id_fica: { required$, minValue: combo$(1) },
      id_sai: { required$, minValue: combo$(1) },
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
    ConfirmDialog,
    CmbTerritorio,
    CmbAuxiliares,
    footerCard
  },
  methods: {
    getSelectedText(elementId) {
      var elt = document.getElementById(elementId);

      if (elt.selectedIndex == -1)
        return null;

      return elt.options[elt.selectedIndex].text;
    },
    async register() {
      this.v$.$validate();
      if (!this.v$.$error) {
        var strFica = document.getElementById('fica').selectedOptions[0].text;//this.getSelectedText('fica');
        var strSai = document.getElementById('sai').selectedOptions[0].text;//this.getSelectedText('sai');
        const ok = await this.$refs.confirmDialog.show({
          title: 'Excluir',
          message: `Atenção: o usuário ${strSai} será permanente excluído do sistema e a sua produção transferida para o usuário ${strFica}. Essa ação não poderá ser desfeita. Confirma?`,
          okButton: 'Confirmar',
        })
        if (ok) {
          document.getElementById("login").classList.add("is-loading");

          auxiliaresService.trocaUser({ id_fica: this.id_fica, id_sai: this.id_sai }).then(
            (response) => {
              this.showMessage = true;
              this.message = "Usuário excluído com sucesso.";
              this.type = "success";
              this.caption = "Usuário";
              setTimeout(() => (this.showMessage = false), 3000);
            },
            (error) => {
              this.message = error.message;
              /* (error.response &&
                 error.response.data &&
                 error.response.data.message) ||
               error.data.err ||
               error.message ||
               error.toString();*/
              this.showMessage = true;
              this.type = "alert";
              this.caption = "Usuário";
              setTimeout(() => (this.showMessage = false), 3000);
            }
          )
            .finally(() => {
              document.getElementById("login").classList.remove("is-loading");
            });
        } 
      } else {
        this.message = "Corrija os erros para enviar as informações";
        this.showMessage = true;
        this.type = "alert";
        this.caption = "Usuário";
        setTimeout(() => (this.showMessage = false), 3000);
      }
    },
  },
  mounted() {
    this.id_user = this.currentUser.id;
  },
};
</script>

<style scoped></style>