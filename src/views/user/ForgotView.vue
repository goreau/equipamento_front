<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column is-two-fifths">
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="main-container">
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title is-centered">
                                Esqueci Minha Senha
                            </p>
                        </header>
                        <div class="card-content">
                            <div class="content">
                                <form @submit.prevent="requestPasswordReset">
                                    <label class="label">Email cadastrado no sistema</label>
                                    <input type="email" class="input" v-model="email" placeholder="Digite seu email"
                                        required />
                                    <br><br>
                                    <button class="button is-link cancel-btn is-fullwidth" type="submit">Enviar</button>
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
import Message from '@/components/general/Message.vue'

export default {
    data() {
        return {
            email: '',
            message: '',
            caption: '',
            type: '',
            showMessage: false,
        };
    },
    components: {
        Message,
    },
    methods: {
        async requestPasswordReset() {
            try {
                authService.forgot({ email: this.email }).then(
                    (response) => {
                        this.showMessage = true;
                        this.message = "Verifique seu email para redefinir sua senha.";
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
                alert('Erro ao solicitar redefinição de senha.');
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