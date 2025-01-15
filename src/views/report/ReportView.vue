<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">{{ title }}</p>
          </header>
          <div class="card-content">
            <span class="filter">{{ strFiltro }}</span>
            <MyTable :tableData="dataTable" :columns="columns" :filtered="false" :tableName="tableName" :extra="extra"  v-if="grouped.indexOf(id) == -1"/>
            <MyGroupedTable :tableData="dataTable" :columns="columns" :is-filtered="false" :myGroups="group" :has-exports="true" v-if="grouped.indexOf(id) > -1"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/general/Loader.vue";
import MyTable from "@/components/forms/MyTable.vue";
import MyGroupedTable from "@/components/forms/MyGroupedTable.vue";
import reportService from "@/services/report.service";

export default {
  name: "Relatórios",
  data() {
    return {
      id: 0,
      filter: {},
      dataTable: [],
      isLoading: false,
      columns: [],
      title: 'Relatórios',
      strFiltro: '',
      tableName: 'equip_relatorio',
      extra: '',
      grouped: ['12','15'],
      group:[],
    };
  },
  components: {
    Loader,
    MyTable,
    MyGroupedTable,
  },
  methods: {
    createColumns(){
      switch (this.id) {
        case '1':
          this.title = 'Resumo de Equipamentos';
              this.columns = [
                { title: "Local", field: "local",  },
                { title: "Tipo", field: "tipo",  },
                { title: "Funcionando", field: "func",  },
                { title: "Manutenção", field: "manut",  },
                { title: "Emprest - TPU", field: "empr",  },
                { title: "Cedido - Ofício", field: "cedido",  },
                { title: "Arrolado", field: "arrol",  },
                { title: "Furtado", field: "furto",  },
                { title: "Emprest Regional", field: "sr",  },
                { title: "N/I", field: "ni",  },
                { title: "Ignorado", field: "ign",  },
              ];
              
          
          break;
        case '2':
          this.title = 'Situação dos Equipamentos';
          this.columns = [
                        { title: "Local", field: "local",  },
                        { title: "Tipo", field: "tipo", minWidth: 600, },
                        { title: "Patrimônio", field: "patrimonio",  },
                        { title: "Fabricante", field: "fabricante",  },
                        { title: "Modelo", field: "modelo" },
                        { title: "Situação", field: "condicao" },
                        { title: "Data", field: "data", formatter:"datetime", formatterParams:{
                          inputFormat:"yyyy-MM-dd",
                          outputFormat:"dd/MM/yyyy",
                          invalidPlaceholder:"Data inválida",
                          timezone:"America/Sao_Paulo",
                        }}, 
                        { title: "Regional", field: "destino" }, 
                        { title: "Município", field: "municipio" },                     
          ];
          break;
        case '3':
          this.title = 'Resumo de Equipamentos - Municípios';
              this.columns = [
                { title: "Local", field: "local",  },
                { title: "Município", field: "municipio",  },
                { title: "Tipo", field: "tipo",  },
                { title: "Próprios", field: "proprio",  },
                { title: "Cedidos", field: "cedido",  },
              ];
              
          
          break;
        case '4':
          this.title = 'Listagem de Equipamentos Municipais';
          this.columns = [
                        { title: "Local", field: "local",  },
                        { title: "Município", field: "municipio",  },
                        { title: "Tipo", field: "tipo",  },
                        { title: "Fabricante", field: "fabricante",  },
                        { title: "Modelo", field: "modelo" },
                        { title: "Próprios", field: "proprio",  },
                        { title: "Cedidos", field: "cedido",  },        
          ];
          break;
        case '5':
          this.title = 'Equipamento sem Situação Registrada';
          this.columns = [
                        { title: "Local", field: "local",  },
                        { title: "Patrimônio", field: "patrimonio",  },
                        { title: "Tipo", field: "tipo",  },
                        { title: "Fabricante", field: "fabricante",  },
                        { title: "Modelo", field: "modelo" },
                      ];
          break;
        default:
          break;
      }
      this.loadData();
    },
    loadData(){
      this.isLoading = true; 
      reportService.getRelat(this.id,this.filter)
      .then((response) => {
        var data = response.data;
        if (this.id == '8'){
          this.dataTable = data.data.dados;
          this.extra = `Nº Desin/Dia disponíveis: ${data.data.total}  -   Indicador de Utilização: ${data.data.indicador}`;
        } else {
          this.dataTable = data.data;
        }
        this.strFiltro = data.filter;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        //console.log('done');
        this.isLoading = false;
      });
    }
  },
  mounted() {
    
  },
  created() {
    this.id = this.$route.params.id;
    this.filter = localStorage.getItem('filterEq');
    this.createColumns();
  },
};
</script>

<style scoped>
.visible {
  display: none !important;
}
.filter{
  font-size: small;
  font-weight: 600;
}
</style>
