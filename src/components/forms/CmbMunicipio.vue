<template>
  <div class="field has-addons">
    <div class="control is-expanded">
      <div class="select is-fullwidth">
        <select @change="onChange($event)" class="input" :class="errclass" :disabled="disabled">
          <option value="0">-- Selecione --</option>
          <option v-for="mun in municipios" :key="mun.id" :value="mun.id" :selected="mun.id == sel">
            {{ mun.nome }}
          </option>
          <option value="999" :selected="sel == 999" :v-if="disabled">NÃO SE APLICA</option>
        </select>

      </div>
    </div>
    <div class="control" v-if="all">
      <button class="button" :v-if="tudo" @click="trocaLista()">
        <span class="icon is-small has-text-success">
          <font-awesome-icon icon="fa-solid fa-repeat" />
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import TerritorioService from "@/services/territorio.service.js";

export default {
  name: "CmbMunicipio",
  data() {
    return {
      municipios: [],
      tudo: false,
    };
  },
  props: ['id_prop', 'sel', 'errclass', 'disabled', 'all','loadAll'],
  methods: {
    trocaLista() {
      this.tudo = this.tudo ? false : true;
      this.loadData();
    },
    onChange(event) {
      this.$emit('selMun', event.target.value);
    },
    loadData() {
      if (this.tudo) {
        TerritorioService.getComboAll()
          .then((res) => {
            this.municipios = res.data;
          })
          .catch((err) => {
            console.log(err.response);
            this.municipios = [];
          })
      } else {
        TerritorioService.getComboMun(this.id_prop)
          .then((res) => {
            this.municipios = res.data;
          })
          .catch((err) => {
            console.log(err.response);
            this.municipios = [];
          })
      }
    }
  },
  watch: {
     /* loadAll(value) {
        this.tudo == loadAll == true ? true : false;
      },*/
  },
  mounted() {
    this.tudo = this.loadAll == true ? true : false;
    this.loadData();
    
  },

};
</script>

<style scoped></style>
