<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Relatórios</p>
          </header>
          <div class="card-content">
            <div class="content">
              <section class="section">
                <div class="dvTipo">
                  <label class="label">Filtros:</label>
                  <div class="columns" v-if="currentUser.nivel == 1">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">Regional</label>
                        <div class="control">
                          <CmbTerritorio :id_prop="currentUser.id" :sel="filterEq.id_regional" :tipo="2"
                            @selTerr="filterEq.id_regional = $event" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns" v-if="currentUser.nivel >= 2">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">GVE</label>
                        <div class="control">
                          <CmbTerritorio :id_prop="currentUser.id" :sel="filterEq.id_gve" :tipo="3"
                            @selTerr="filterEq.id_gve = $event" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns" v-if="this.tipo_relat == 3 || this.tipo_relat == 4">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">Município</label>
                        <div class="control">
                          <CmbMunicipio :id_prop="currentUser.id" :sel="filterEq.id_municipio" :tipo="9" :all="false"
                            @selMun="filterEq.id_municipio = $event" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  
                </div>
              </section>
              <section class="section" v-if="tipo_relat > 0">
                <div class="columns is-centered">
                  <div class="column is-4">
                    <div class="control">
                      <button class="button is-link submit-btn is-fullwidth" id="login" @click="processar">
                        <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                        Processar
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from "@/components/general/Message.vue";
import Loader from "@/components/general/Loader.vue";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import CmbMunicipio from "@/components/forms/CmbMunicipio.vue";

export default {
  data() {
    return {
      tipo_relat: 1,
      filterEq: {
        id_regional: 0,
        id_gve: 0,
        id_municipio: 0,
      },
      cFooter: {
        strSubmit: 'Filtrar',
        strCancel: 'Cancelar',
        strAux: '',
        aux: false
      },
      id_usuario: 0,
      unidade: "",
      isLoading: false,
      message: "",
      caption: "",
      type: "",
      showMessage: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/loggedUser"];
    },
  },
  components: {
    Message,
    Loader,
    CmbTerritorio,
    CmbMunicipio,
  },
  methods: {
    closeMessage(){
      this.showMessage = false;
    },
    processar() {
      this.filterEq.id_prop = this.id_usuario;
      localStorage.setItem('filterEq', JSON.stringify(this.filterEq));

      if (this.tipo_relat < 100) {
        this.$router.push(`/report/${this.tipo_relat}`);
      } else {
        this.$router.push(`/reportN/${this.tipo_relat}`);
      }
    },
  },
  mounted() {
    let cUser = this.currentUser;
    if (cUser) {
      this.id_usuario = cUser.id;
    }

    var obj = localStorage.getItem('filterEq');
    if (obj) {
      this.filterEq = JSON.parse(obj);
    }
  },
  created() {
    this.tipo_relat = this.$route.params.id;
  },
  watch: {
    '$route'() {
      this.tipo_relat = this.$route.params.id;
    }
  },
};
</script>

<style scoped>
.submit-btn {
  background-color: #4f52a3;
  color: #e6e2db;
  font-weight: bold;
  border: 2px solid #13156e;
  padding: 1rem;
  font-size: 1rem;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.5s;
}

.myToday {
  color: #FF5722 !important
}

.submit-btn:hover {
  background-color: transparent;
  color: #13156e;
  border: 2px solid #4f52a3;
}

.btico {
  padding-right: 2rem;
  margin-left: -2rem;
}

section {
  padding: .5rem;
}

.radio {
  margin-left: 1rem !important;
  width: 100%;
}

.flatpickr-input {
  width: auto;
}

.flatpickr-input[readonly] {
  width: auto;
}

.dvTipo {
  border: 1px solid #aaa;
  border-radius: 4px;
  position: relative;
  padding: 1.25rem 2.5rem 1.25rem 1.5rem;
  width: 100%;
}

label.radio {
  margin-left: 1rem;
  margin-top: .5rem;
}

.fieldset {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .02);
  color: #4a4a4a;
  display: block;
  padding: 1.25rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.fieldset>legend {
  color: #363636;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  background-color: #fff;
  padding: 0 5px;
  width: max-content;
  border: 0 none
}
</style>
