<template>
  <div class="control">
    <div class="select">
      <select @change="onChange($event)" :id="id" class="input" :class="errclass" :disabled="disabled">
        <option value="0">-- Selecione --</option>
        <option
          v-for="loc in auxiliares"
          :key="loc.id"
          :value="loc.id"
          :selected="loc.id == sel"
          :data-g="loc.geral"
        >
          {{ loc.nome }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import auxiliaresService from "@/services/auxiliares.service.js";

export default {
  name: "CmbAuxiliar",
  data() {
    return {
      auxiliares: []
    };
  },
  props: ['sel', 'errclass','tipo', 'aux', 'disabled', 'id'],
  methods: {
    onChange(event) {
      this.$emit('selAux',event.target.value);
    },
    loadData() {
      auxiliaresService.getCombo(this.tipo, this.aux)
      .then((res) => {
        this.auxiliares = res.data;
      })
      .catch((err) => {
        console.log(err.response);
        this.auxiliares = [];
      })
    }
  },
  watch: {
    tipo() {
      this.loadData();
    },
    aux() {
      this.loadData();
    },
  },
  mounted() {
    this.loadData();
  },
  
};
</script>

<style scoped>
  
</style>
