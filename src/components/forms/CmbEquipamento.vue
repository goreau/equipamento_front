<template>
    <div class="control">
      <div class="select">
        <select @change="onChange($event)" class="input" :class="errclass">
          <option value="0">-- Selecione --</option>
          <option
            v-for="loc in equipamentos"
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
  import cadastroService from "@/services/cadastro.service.js";
  
  export default {
    name: "CmbEquipamento",
    data() {
      return {
        equipamentos: [],
      };
    },
    props: ['sel', 'errclass','tipo'],
    methods: {
      onChange(event) {
        this.$emit('selMov',event.target.value);
      },
      loadData() {
        cadastroService.getCombo()
        .then((res) => {
          this.equipamentos = res.data;
        })
        .catch((err) => {
          console.log(err.response);
          this.equipamentos = [];
        })
      }
    },
    watch: {
      tipo() {
        this.loadData();
      }
    },
    mounted() {
      this.loadData();
    },
    
  };
  </script>
  
  <style scoped>
    
  </style>
  