<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="main-container">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title is-centered">
                Redefinição de Senha
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <form @submit.prevent="resetPassword">
                  <div class="field">
                    <label class="label">Nova Senha</label>
                    <div class="control">
                      <input type="password" class="input" :class="{ 'is-danger': v$.newPassword.$error }"
                        v-model="newPassword" placeholder="Nova senha" required />
                      <span class="is-error" v-if="v$.newPassword.$error">
                        {{ v$.newPassword.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Confirme a Nova Senha</label>
                    <div class="control">
                      <input type="password" class="input" :class="{ 'is-danger': v$.confirmPassword.$error }"
                        v-model="confirmPassword" placeholder="Confirmação da nova senha" required />
                      <span class="is-error" v-if="v$.confirmPassword.$error">
                        {{ v$.confirmPassword.$errors[0].$message }}
                      </span>
                    </div>

                  </div>

                  <br><br>
                  <button type="submit" class="button is-link cancel-btn is-fullwidth">Redefinir</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from "@/services/auth.service";
import Message from '@/components/general/Message.vue';
import useValidate from "@vuelidate/core";
import {
  required$,
  minLength$,
  sameAs$
} from "../../components/forms/validators.js";

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      token: this.$route.params.token,
      message: '',
      caption: '',
      type: '',
      showMessage: false,
      v$: useValidate(),
    };
  },
  components: {
    Message,
  },
  validations() {
    return {
      newPassword: { required$, minLength: minLength$(4) },
      confirmPassword: { sameAs: sameAs$(this.newPassword) }
    }
  },
  methods: {
    async resetPassword() {
      this.v$.$validate(); 
      if (!this.v$.$error) {
        try {
          authService.reset({ token: this.token, newPassword: this.newPassword }).then(
          (response) => {
            this.showMessage = true;
            this.message = "Senha redefinida com sucesso.";
            this.type = "success";
            this.caption = "Usuário";
            setTimeout(() => {
              (this.showMessage = false);
              this.$router.push('/login');
              }, 3000);
          },
          (error) => {
            this.message = error;
            this.showMessage = true;
            this.type = "alert";
            this.caption = "Usuário";
            setTimeout(() => (this.showMessage = false), 3000);
          }
        )
        } catch (err) {
          alert('Erro ao redefinir senha.');
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
};
</script>

<style scoped>
.card-footer {
  padding: 1rem;
}

.card-footer .button {
  width: 100%;
}
</style>