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
            <p class="card-header-title is-centered">Meu Cadastro</p>
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
                <label class="label">{{strLocal}}</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Local do usuário"
                    v-model="municipio"
                    readonly
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">Nível</label>
                <div class="control has-icons-left has-icons-right">
                  <label class="radio" v-if="user.role==1">
                    <input
                      type="radio"
                      nome="role"
                      value="1"
                      checked="checked"
                    />
                    Administrador
                  </label>
                  <label class="radio" v-if="user.role==2">
                    <input
                      type="radio"
                      nome="role"
                      value="2"
                      checked="checked"
                    />
                    Gestor Regional
                  </label>
                  <label class="radio" v-if="user.role==3">
                    <input
                      type="radio"
                      nome="role"
                      value="2"
                      checked="checked"
                    />
                    Gestor Local
                  </label>
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
                    readonly
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">Senha Atual</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="user.old_password"
                    placeholder="Informe a senha"
                    :class="{ 'is-danger': v$.user.old_password.$error }"
                  />
                  <span class="is-error" v-if="v$.user.old_password.$error">
                    {{ v$.user.old_password.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Nova Senha</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="user.new_password"
                    placeholder="Confirme a senha"
                    :class="{ 'is-danger': v$.user.new_password.$error }"
                  />
                  <span class="is-error" v-if="v$.user.new_password.$error">
                    {{ v$.user.new_password.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Confirme a Senha</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="senha"
                    placeholder="Confirme a senha"
                    :class="{ 'is-danger': v$.senha.$error }"
                  />
                  <span class="is-error" v-if="v$.senha.$error">
                    {{ v$.senha.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="columns" v-if="false">
                <div class="column is-1 is-offset-11 vs">{{ version }}</div>
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
import CmbUnidade from "@/components/forms/CmbTerritorio.vue";
import footerCard from '@/components/forms/FooterCard.vue'
import authService from "@/services/auth.service";
import useValidate from "@vuelidate/core";
import {
  required$,
  requiredIf$,
  minLength$,
  minLengthIfFilled$,
  email$,
  sameAs$
} from "../../components/forms/validators.js";

export default {
  data() {
    return {
      user: {
        nome: "",
        username: "",
        old_password: '',
        new_password: '',
        email: "",
        local: 0,
        role: 0,
        id: 1,
      },
      version: '27.11',
      senha: '',
      v$: useValidate(),
      unidade:'',
      isLoading: false,
      message: "",
      caption: "",
      type: "",
      strLocal: "Município",
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
        nome: {minLength: minLength$(10)},
        new_password: {minLength: minLengthIfFilled$(4)},
        old_password: {requiredIf: requiredIf$(this.user.new_password.length > 0),},
        email: {required$, email$},
      },
      senha: {sameAs: sameAs$(this.user.new_password) || !this.user.new_password}
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
    CmbUnidade,
    footerCard
  },
  methods: {  
    update() {
      this.v$.$validate(); 
      var teste = this.v$.senha.$dirty;
      if (!this.v$.$error) {
        document.getElementById("login").classList.add("is-loading");

        authService.update(this.user).then(
          (response) => {
            this.showMessage = true;
            this.message = "Seu cadastro foi alterado com sucesso.";
            this.type = "success";
            this.caption = "Meu Cadastro";
            setTimeout(() => (this.showMessage = false), 3000);
          },
          (error) => {
            this.message = error;
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
        this.caption = "Meu Cadastro";
        setTimeout(() => (this.showMessage = false), 3000);
      }
    },
    loadData() {
      this.isLoading = true;

      authService.getUserData(this.user.id).then(
        (response) => {
          let data = response.data;
          this.user.nome = data.nome;
          this.user.email = data.email;
          this.municipio = data.tlocal;
          this.user.role = data.nivel;
          //this.user.old_password = data.password;
          this.user.username = data.username;
          this.strLocal = (data.nivel == 3 ? 'GVE' : (data.nivel == 1 ? 'Local' : 'Regional'));
        },
        (error) => {
          this.message = error.data;
          this.showMessage = true;
          this.type = "alert";
          this.caption = "Usuário";
          setTimeout(() => (this.showMessage = false), 3000);
        }
      );

      this.isLoading = false;
    },

  },
  mounted() {
    let cUser = this.currentUser;
    if (cUser){
      this.user.id = cUser.id;
    }
    
    this.loadData();
  },
};
</script>

<style scoped>
  .vs{
    font-size: x-small;
  }
</style>
