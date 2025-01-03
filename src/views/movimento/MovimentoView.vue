<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Movimentação de Equipamento</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label for="" class="label">Equipamento</label>
                <div class="control">
                  <CmbEquipamento @selMov="movimento.id_cadastro = $event"
                    :sel="movimento.id_cadastro" />
                  <span class="is-error" v-if="v$.movimento.id_cadastro.$error">
                    {{ v$.movimento.id_cadastro.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                    <label class="label">Data</label>
                    <div class="control" id="contDate">
                      <input type="text" id="dtMov">
                    </div>
                    <span class="is-error" v-if="v$.movimento.dt_movimento.$error">
                      {{ v$.movimento.dt_movimento.$errors[0].$message }}
                    </span>
                  </div>
              <div class="field">
                <label for="" class="label">Condição</label>
                <div class="control">
                  <CmbAuxiliares @selAux="movimento.condicao = $event" :tipo="2"
                    :sel="movimento.condicao" />
                  <span class="is-error" v-if="v$.movimento.condicao.$error">
                    {{ v$.movimento.condicao.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Destino</label>
                <div class="control">
                  <CmbTerritorio :tipo="2" @selTerr="movimento.destino = $event"
                    :errclass="{ 'is-danger': v$.movimento.destino.$error }" />
                  <span class="is-error" v-if="v$.movimento.destino.$error">
                    {{ v$.movimento.destino.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Município</label>
                <div class="control">
                  <CmbTerritorio :tipo="4" @selTerr="movimento.id_municipio = $event"
                    :errclass="{ 'is-danger': v$.movimento.id_municipio.$error }" />
                  <span class="is-error" v-if="v$.movimento.id_municipio.$error">
                    {{ v$.movimento.id_municipio.$errors[0].$message }}
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
import CmbEquipamento from "@/components/forms/CmbEquipamento.vue";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import CmbAuxiliares from "@/components/forms/CmbAuxiliares.vue";
import footerCard from '@/components/forms/FooterCard.vue'
import movimentoService from "@/services/movimento.service";
import moment from 'moment';
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';
import "bulma-calendar/dist/css/bulma-calendar.min.css";
import useValidate from "@vuelidate/core";
import {
  required$,
  combo$,
} from "../../components/forms/validators.js";

export default {
  data() {
    return {
      movimento: {
        id_cadastro: 0,
        destino: 0,
        id_municipio: 0,
        condicao: 0,
        dt_movimento: '',
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
      movimento: {
        destino: { required$, minValue: combo$(1) },
        id_municipio: { required$, minValue: combo$(1) },
        id_cadastro: { required$, minValue: combo$(1) },
        condicao: { required$, minValue: combo$(1) },
        dt_movimento: { required$ }
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
    CmbEquipamento,
    footerCard
  },
  methods: {
    create() {
      this.v$.$validate();
      if (!this.v$.$error) {
        document.getElementById("login").classList.add("is-loading");

        movimentoService.create(this.movimento).then(
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
    startCalendar() {
      const teste = document.querySelector('#dtMov');

      if (teste.type == 'text') {
        const elDt = document.querySelector('#contDate');
        elDt.innerHTML = "<input type='date' id='dtMov' />";
        
      }

      const options = {
        type: "date",
        dateFormat: "dd/MM/yyyy",
        startDate: this.movimento.dt_movimento,
        showHeader: false,
        color: "info",
        allowInput: true,
        cancelLabel: 'Cancelar',
        showClearButton: false,
        todayLabel: 'Hoje',
        maxDate: new Date(),
      };

      var calini = bulmaCalendar.attach('#dtMov', options);

      const element = document.querySelector('#dtMov');

      const input = document.querySelector('.datetimepicker-dummy-input');
      input.removeAttribute('readonly');
      input.setAttribute('value', "__/__/____");
      input.setAttribute('data-mask', "__/__/____");
      this.applyDataMask(input);

      input.addEventListener('blur', () => {
        this.movimento.dt_movimento = moment(input.value).format('YYYY-MM-DD');
      })

      if (element) {
        // bulmaCalendar instance is available as element.bulmaCalendar
        element.bulmaCalendar.on('select', datepicker => {
          this.movimento.dt_movimento = moment(datepicker.data.startDate).format('YYYY-MM-DD');
        });
      }
    },
    applyDataMask(field) {
      var mask = field.dataset.mask.split('');

      // For now, this just strips everything that's not a number
      function stripMask(maskedData) {
        function isDigit(char) {
          return /\d/.test(char);
        }
        return maskedData.split('').filter(isDigit);
      }

      // Replace `_` characters with characters from `data`
      function applyMask(data) {
        return mask.map(function (char) {
          if (char != '_') return char;
          if (data.length == 0) return char;
          return data.shift();
        }).join('')
      }

      function reapplyMask(data) {
        return applyMask(stripMask(data));
      }

      function changed() {
        var oldStart = field.selectionStart;
        var oldEnd = field.selectionEnd;

        field.value = reapplyMask(field.value);

        field.selectionStart = oldStart;
        field.selectionEnd = oldEnd;
      }

      field.addEventListener('click', changed)
      field.addEventListener('keyup', changed)
    },
  },
  mounted() {
    this.movimento.owner_id = this.currentUser.id;

    this.startCalendar();
  },
};
</script>

<style scoped></style>
