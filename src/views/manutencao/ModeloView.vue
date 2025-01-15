<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column is-two-fifths">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Modelo de Equipamento</p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <div class="field">
                                <label for="" class="label">Fabricante</label>
                                <div class="control">
                                <CmbAuxiliares @selAux="auxiliar.extra = $event" :tipo="1"
                                    :sel="auxiliar.extra" />
                                <span class="is-error" v-if="v$.auxiliar.extra.$error">
                                    {{ v$.auxiliar.extra.$errors[0].$message }}
                                </span>
                                </div>
                            </div>
                            <div class="field">
                                <label for="" class="label">Código</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Código" v-model="auxiliar.codigo"
                                        :class="{ 'is-danger': v$.auxiliar.codigo.$error }" />
                                    <span class="is-error" v-if="v$.auxiliar.codigo.$error">
                                        {{ v$.auxiliar.codigo.$errors[0].$message }}
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Nome</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Nome" v-model="auxiliar.nome"
                                        :class="{ 'is-danger': v$.auxiliar.nome.$error }" />
                                    <span class="is-error" v-if="v$.auxiliar.nome.$error">
                                        {{ v$.auxiliar.nome.$errors[0].$message }}
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <div class="control">
                                    <label for="" class="checkbox">
                                        <input type="checkbox" v-model="auxiliar.active" :value="1">
                                        Ativo
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <footerCard @submit="save" @cancel="null" @aux="null" :cFooter="cFooter" />
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import footerCard from '@/components/forms/FooterCard.vue'
import manutencaoService from "@/services/manutencao.service";
import useValidate from "@vuelidate/core";
import {
    required$,
    combo$,
    minLength$,
} from "../../components/forms/validators.js";
import CmbAuxiliares from "@/components/forms/CmbAuxiliares.vue";

export default {
    data() {
        return {
            auxiliar: {
                tipo: 0,
                id_auxiliar: 0,
                extra: 0,
                nome: "",
                codigo: 0,
                active: true,
            },
            v$: useValidate(),
            isLoading: false,
            message: "",
            caption: "",
            type: "",
            strLocal: "",
            showMessage: false,
            cFooter: {
                strSubmit: 'Salvar',
                strCancel: 'Cancelar',
                strAux: '',
                aux: false
            }
        };
    },
    validations() {
        return {
            auxiliar: {
                nome: { required$, minLength: minLength$(5) },
                codigo: { required$ },
                extra: { required$, minValue: combo$(1) },
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
        footerCard,
        CmbAuxiliares
    },
    methods: {
        loadData() {
            this.isLoading = true;

            manutencaoService.getDados(this.auxiliar.id_auxiliar).then(
                (response) => {
                    let data = response.data;
                    this.auxiliar.extra = data.extra;
                    this.auxiliar.tipo = data.tipo;
                    this.auxiliar.codigo = data.codigo;
                    this.auxiliar.nome = data.nome;
                    this.auxiliar.active = data.active;
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
                    this.caption = "Manutenção";
                    setTimeout(() => (this.showMessage = false), 3000);
                }
            );

            this.isLoading = false;
        },
        save() {
            this.v$.$validate();
            if (!this.v$.$error) {
                document.getElementById("login").classList.add("is-loading");

                if (this.auxiliar.id_auxiliar > 0) {
                    manutencaoService.update(this.auxiliar).then(
                        (response) => {
                            this.showMessage = true;
                            this.message = "Dados alterados com sucesso.";
                            this.type = "success";
                            this.caption = "Manutenção";
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
                            this.caption = "Manutenção";
                            setTimeout(() => (this.showMessage = false), 3000);
                        }
                    )
                        .finally(() => {
                            document.getElementById("login").classList.remove("is-loading");
                        });
                } else {
                    manutencaoService.create(this.auxiliar).then(
                        (response) => {
                            this.showMessage = true;
                            this.message = "Manutenção cadastrada com sucesso.";
                            this.type = "success";
                            this.caption = "Manutenção";
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
                            this.caption = "Manutenção";
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
                this.caption = "Manutenção";
                setTimeout(() => (this.showMessage = false), 3000);
            }
        },
    },
    mounted() {
        this.auxiliar.owner_id = this.currentUser.id;
    },
    created() {
        this.auxiliar.id_auxiliar = this.$route.params.id;
        this.auxiliar.tipo = this.$route.params.tipo;
        if (this.auxiliar.id_auxiliar > 0) {
            this.loadData();
        }

    },
};
</script>

<style scoped></style>
