<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message
          v-if="showMessage"
          @do-close="closeMessage"
          :msg="message"
          :type="type"
          :caption="caption"
        />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Usuário</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Nome</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Nome"
                    v-model="user.nome"
                    :class="{ 'is-danger': v$.user.nome.$error }"
                  />
                  <span class="is-error" v-if="v$.user.nome.$error">
                    {{ v$.user.nome.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Nível</label>
                <div class="control has-icons-left has-icons-right">
                  <label class="radio">
                    <input
                      type="radio"
                      nome="nivel"
                      value="1"
                      v-model="role"
                      :disabled="currentUser.nivel > 1"
                    />
                    Administrador
                  </label>
                  <label class="radio">
                    <input
                      type="radio"
                      nome="nivel"
                      value="9"
                      v-model="role"
                      :disabled="currentUser.nivel == 2 || currentUser.nivel == 3"
                    />
                    Gestor Regional
                  </label>
                  <label class="radio">
                    <input
                      type="radio"
                      name="role"
                      value="2"
                      v-model="role"
                      :disabled="currentUser.nivel == 3"
                    />
                    Gestor Local
                  </label>
                  <label class="radio">
                    <input
                      type="radio"
                      nome="nivel"
                      value="3"
                      v-model="role"
                    />
                    Usuário Município
                  </label>
                </div>
              </div>
              <div class="field">
                <label class="label">{{ strLocal }}</label>
                <div class="control">
                    <CmbTerritorio
                      :id_prop="user.id_prop"
                      :tipo="user.nivel"
                      :sel="user.id_municipios"
                      @selTerr="user.id_municipios = $event"
                      :errclass="{ 'is-danger': v$.user.id_municipios.$error }"
                    />
                    <span class="is-error" v-if="v$.user.id_municipios.$error">
                      {{ v$.user.id_municipios.$errors[0].$message }}
                    </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="E-mail"
                    v-model="user.email"
                    :class="{ 'is-danger': v$.user.email.$error }"
                  />
                  <span class="is-error" v-if="v$.user.email.$error">
                    {{ v$.user.email.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Login</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Nome de usuário"
                    v-model="user.username"
                    :class="{ 'is-danger': v$.user.username.$error }"
                  />
                  <span class="is-error" v-if="v$.user.username.$error">
                    {{ v$.user.username.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Senha</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="user.password"
                    placeholder="Informe a senha"
                    :class="{ 'is-danger': v$.user.password.$error }"
                  />
                  <span class="is-error" v-if="v$.user.password.$error">
                    {{ v$.user.password.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Confirme a Senha</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="password"
                    placeholder="Confirme a senha"
                    :class="{ 'is-danger': v$.password.$error }"
                  />
                  <span class="is-error" v-if="v$.password.$error">
                    {{ v$.password.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="edit" @cancel="null" @aux="details" :cFooter="cFooter" />
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
import footerCard from '@/components/forms/FooterCard.vue'
import authService from "@/services/auth.service";
import useValidate from "@vuelidate/core";
import {
  required$,
  combo$,
  minLength$,
  email$,
  sameAs$
} from "../../components/forms/validators.js";

export default {
  data() {
    return {
      user: {
        id: 0,
        nome: "",
        username: "",
        password: "",
        email: "",
        id_municipios: 0,
        nivel: 0,
        id_prop: 0,
      },
      role: 0,
      password: '',
      municipio: '',
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
      user: {
        nome: {required$, minLength: minLength$(10)},
        username: {required$, minLength: minLength$(4)},
        password: {required$, minLength: minLength$(4)},
        email: {required$, email$},
        nivel: { minValue: combo$(1) },
        id_municipios: {minValue: combo$(1)},
      },
      password: {sameAs: sameAs$(this.user.password)}
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
    footerCard
  },
  methods: {
    loadData(){
      this.isLoading = true;

      authService.getUserData(this.user.id).then(
        (response) => {
          let data = response.data;
          this.user.nome = data.nome;
          this.user.username = data.username;
          this.user.id_municipios = data.id_municipios;
          this.municipio = data.municipio;
          this.user.email = data.email;
          this.role = data.nivel;
         // this.strLocal = (data.nivel == 3 ? 'Município' : (data.nivel == 2 ? 'GVE' : (data.nivel == 1 ? 'Local' : 'Regional')));
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
          this.caption = "Usuario";
          setTimeout(() => (this.showMessage = false), 3000);
        }
      );

      this.isLoading = false;
    },
    edit() {
      this.v$.$validate(); 
      if (!this.v$.$error) {
        document.getElementById("login").classList.add("is-loading");

        authService.edit(this.user).then(
          (response) => {
            this.showMessage = true;
            this.message = "Dados do usuário alterados com sucesso.";
            this.type = "success";
            this.caption = "Usuário";
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
            this.caption = "Usuário";
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
        this.caption = "Usuário";
        setTimeout(() => (this.showMessage = false), 3000);
      }
    },
  },
  watch:{
    role(value) {
      this.user.nivel = value;
      this.strLocal = (value == 3 ? 'Município' : (value == 2 ? 'GVE' : (value == 1 ? 'Local' : 'Regional')));
    },
  },
  mounted() {
    this.user.id_prop = this.currentUser.id;
  },
  created() {
    this.user.id = this.$route.params.id;
    this.loadData();
  },
};
</script>

<style scoped></style>
