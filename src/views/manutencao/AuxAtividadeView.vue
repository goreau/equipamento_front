<template>
    <div class="main-container">
        <div class="columns is-centered">
            <div class="column is-two-fifths">
                <Loader v-if="isLoading" />
                <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-centered">Atividades</p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <div class="field">
                                <label for="" class="label">Programa</label>
                                <div class="control">
                                    <CmbAuxiliares @selAux="aux_atividade.id_programa = $event" :tipo="5"
                                        :sel="aux_atividade.id_programa" />
                                    <span class="is-error" v-if="v$.aux_atividade.id_programa.$error">
                                        {{ v$.aux_atividade.id_programa.$errors[0].$message }}
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Código</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Nome" v-model="aux_atividade.codigo"
                                        :class="{ 'is-danger': v$.aux_atividade.codigo.$error }" />
                                    <span class="is-error" v-if="v$.aux_atividade.codigo.$error">
                                        {{ v$.aux_atividade.codigo.$errors[0].$message }}
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Nome</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Nome"
                                        v-model="aux_atividade.descricao" maxlength="50"
                                        :class="{ 'is-danger': v$.aux_atividade.descricao.$error }" />
                                    <span class="is-error" v-if="v$.aux_atividade.descricao.$error">
                                        {{ v$.aux_atividade.descricao.$errors[0].$message }}
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label for="" class="label">Modalidade</label>
                                <div class="control">
                                    <CmbAuxiliares @selAux="aux_atividade.id_modalidade = $event" :tipo="7"
                                        :aux="aux_atividade.id_modalidade" :sel="aux_atividade.id_modalidade" />
                                    <span class="is-error" v-if="v$.aux_atividade.id_modalidade.$error">
                                        {{ v$.aux_atividade.id_modalidade.$errors[0].$message }}
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Quantidade Prevista</label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="Nome" v-model="aux_atividade.producao"
                                        :class="{ 'is-danger': v$.aux_atividade.producao.$error }" />
                                    <span class="is-error" v-if="v$.aux_atividade.producao.$error">
                                        {{ v$.aux_atividade.producao.$errors[0].$message }}
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <div class="control">
                                    <label for="" class="checkbox">
                                        <input type="checkbox" v-model="aux_atividade.vestimenta" :value="1">
                                        Necessidade de Vestimenta
                                    </label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="control">
                                    <label for="" class="checkbox">
                                        <input type="checkbox" v-model="aux_atividade.active" :value="1">
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
            aux_atividade: {
                id_aux_atividade: 0,
                descricao: "",
                id_programa: 0,
                id_modalidade: 0,
                producao: 0,
                codigo: 0,
                active: true,
                vestimenta: false,
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
            aux_atividade: {
                descricao: { required$, minLength: minLength$(5) },
                id_programa: { required$, minValue: combo$(1) },
                id_modalidade: { required$, minValue: combo$(1) },
                producao: { required$ },
                codigo: { required$ },
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

            manutencaoService.getDados(2, this.aux_atividade.id_aux_atividade).then(
                (response) => {
                    let data = response.data;
                    this.aux_atividade.id_programa = data.id_programa;
                    this.aux_atividade.id_modalidade = data.id_modalidade;
                    this.aux_atividade.codigo = data.codigo;
                    this.aux_atividade.descricao = data.descricao;
                    this.aux_atividade.producao = data.producao;
                    this.aux_atividade.active = data.active;
                    this.aux_atividade.vestimenta = data.vestimenta;
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
                    this.caption = "Atividade";
                    setTimeout(() => (this.showMessage = false), 3000);
                }
            );

            this.isLoading = false;
        },
        save() {
            this.v$.$validate();
            if (!this.v$.$error) {
                document.getElementById("login").classList.add("is-loading");

                if (this.aux_atividade.id_aux_atividade > 0) {
                    manutencaoService.update(2, this.aux_atividade).then(
                        (response) => {
                            this.showMessage = true;
                            this.message = "Dados da atividade alterados com sucesso.";
                            this.type = "success";
                            this.caption = "Atividade";
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
                            this.caption = "Atividade";
                            setTimeout(() => (this.showMessage = false), 3000);
                        }
                    )
                        .finally(() => {
                            document.getElementById("login").classList.remove("is-loading");
                        });
                } else {
                    manutencaoService.create(2, this.aux_atividade).then(
                        (response) => {
                            this.showMessage = true;
                            this.message = "Atividade cadastrada com sucesso.";
                            this.type = "success";
                            this.caption = "Atividade";
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
                            this.caption = "Atividade";
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
                this.caption = "Atividade";
                setTimeout(() => (this.showMessage = false), 3000);
            }
        },
    },
    mounted() {
        this.aux_atividade.owner_id = this.currentUser.id;
    },
    created() {
        this.aux_atividade.id_aux_atividade = this.$route.params.id;
        if (this.aux_atividade.id_aux_atividade > 0) {
            this.loadData();
        }

    },
};
</script>

<style scoped></style>
