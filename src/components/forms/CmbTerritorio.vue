<template>
  <div class="control">
    <div class="select">
      <select @change="onChange($event)" class="input" :class="errclass">
        <option value="0">-- Selecione --</option>
        <option
          v-for="loc in territorios"
          :key="loc.id"
          :value="loc.id"
          :selected="loc.id == sel"
        >
          {{ loc.nome }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import TerritorioService from "@/services/territorio.service.js";

export default {
  name: "CmbTerritorio",
  data() {
    return {
      territorios: [],
    };
  },
  props: ['sel', 'errclass','tipo'],
  methods: {
    onChange(event) {
      this.$emit('selTerr',event.target.value);
    },
    loadData() {
      TerritorioService.getCombo(this.tipo)
      .then((res) => {
        this.territorios = res.data;
      })
      .catch((err) => {
        console.log(err.response);
        this.territorios = [];
      })
    }
  },
  mounted() {
    this.loadData();
  },
  watch: {
    tipo() {
      this.loadData();
    }
  },
};
</script>

<style scoped>
  
</style>
