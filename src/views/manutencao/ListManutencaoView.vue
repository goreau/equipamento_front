<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-8">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">{{ strTipo }}</p>
            <button class="button is-primary is-outlined" @click="newItem" :disabled="currentUser.nivel != 1">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Novo</span>
            </button>
          </header>
          <div class="card-content">
            <MyTable :tableData="dataTable" :columns="columns" :filtered="true" :tableName="tableName" />
          </div>
        </div>
        <div style="display: none;">
          <span class="icon is-small is-left" name="coisa">
            <font-awesome-icon icon="fa-solid fa-edit" />
          </span>
          <span class="icon is-small is-left" name="coisa2">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </span>
        </div>
      </div>
    </div>
  </div>
  <confirm-dialog ref="confirmDialog"></confirm-dialog>
</template>

<script>
import manutencaoService from "@/services/manutencao.service";
import MyTable from '@/components/forms/MyTable.vue';
import Loader from '@/components/general/Loader.vue';
import Message from "@/components/general/Message.vue";
import ConfirmDialog from '@/components/forms/ConfirmDialog.vue';

export default {
  name: 'ListaVendas',
  data() {
    return {
      tableName: 'manutencao',
      dataTable: [],
      isLoading: false,
      showMessage: false,
      message: "",
      caption: "",
      type: "",
      columns: [],
      myspan: null,
      myspan2: null,
      id_user: 0,
      tipo: 0,
      strTipo: '',
    }
  },
  components: {
    MyTable,
    Loader,
    ConfirmDialog,
    Message,

  },
  methods: {
    newItem() {
      if (this.tipo == 1){
        this.$router.push('/programa/0');
      } else if (this.tipo == 2){
        this.$router.push('/aux_atividade/0');
      } else if (this.tipo == 3) {
        this.$router.push('/ativ_lab/0');
      } else if (this.tipo == 4) {
        this.$router.push('/modalidade/0');
      } else if (this.tipo == 5) {
        this.$router.push('/perdas/0');
      } else if (this.tipo == 6) {
        this.$router.push('/siafem/0');
      }         
    },
    editItem(id) {
      this.$router.push(`/manage/${id}`);
    },
    getFormat(row) {
      return {
        'has-text-danger-dark': row.status == 1,
        'has-text-danger': row.status == 2,
        'has-text-info': row.status == 3,
        'has-text-success': row.status == 9,
        'has-text-info': row.status == 7
      }
    }
  },
  mounted() {
    this.id_user = this.currentUser.id;

    this.myspan = document.getElementsByName('coisa')[0];
    this.myspan2 = document.getElementsByName('coisa2')[0];
    this.isLoading = true;

    manutencaoService.getLista(this.tipo)
      .then((response) => {
        this.dataTable = response.data;
        this.isLoading = false;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => this.isLoading = false);

      if (this.tipo == 4){
        this.columns = [
        { title: 'Fabricante', field: 'fabricante', minWidth: 100 },
        { title: 'Modelo', field: 'nome', minWidth: 100 },
        { title: 'Ativo', field: 'active', minWidth: 100, formatter:"tickCross" },
        {
          title: 'Ações', responsive: 0, minWidth: 250,
          formatter: (cell, formatterParrams) => {
            const row = cell.getRow().getData();

            const btEdit = document.createElement('button');
            btEdit.type = 'button';
            btEdit.title = 'Editar';
            btEdit.disabled = this.currentUser.nivel != 1;
            btEdit.style.cssText = 'height: fit-content; margin-left: 1rem;';
            btEdit.classList.add('button', 'is-primary', 'is-outlined');
            btEdit.innerHTML = this.myspan.innerHTML;
            btEdit.addEventListener('click', () => {
              this.$router.push(`/modelo/${row.id_auxiliar}`);
            });

            const btDel = document.createElement('button');
            btDel.type = 'button';
            btDel.title = 'Excluir';
            btDel.disabled = this.currentUser.nivel != 1;
            btDel.style.cssText = 'height: fit-content; margin-left: 1rem;';
            btDel.classList.add('button', 'is-danger', 'is-outlined');
            btDel.innerHTML = this.myspan2.innerHTML;
            btDel.addEventListener('click', async () => {
              const ok = await this.$refs.confirmDialog.show({
                title: 'Excluir',
                message: 'Deseja mesmo excluir esse modelo?',
                okButton: 'Confirmar',
              })
              if (ok) {
                manutencaoService.delete(this.tipo, row.id_auxiliar)
                  .then(resp => {
                    if (resp.status == '200') {
                      location.reload();
                    } else {
                      this.message = resp;
                      this.showMessage = true;
                      this.type = "alert";
                      this.caption = "Modelo";
                      setTimeout(() => (this.showMessage = false), 3000);
                    }
                  })
                  .catch(err => {
                    this.message = err;
                    this.showMessage = true;
                    this.type = "alert";
                    this.caption = "Modelo";
                    setTimeout(() => (this.showMessage = false), 3000);
                  })
              }
            });

            


            const buttonHolder = document.createElement('span');
            buttonHolder.appendChild(btEdit);
            buttonHolder.appendChild(btDel);

            return buttonHolder;

          }
        }
      ]
      } else {
        this.columns = [
        { title: 'Nome', field: 'nome', minWidth: 100 },
        { title: 'Ativo', field: 'active', minWidth: 100, formatter:"tickCross" },
        {
          title: 'Ações', responsive: 0, minWidth: 250,
          formatter: (cell, formatterParrams) => {
            const row = cell.getRow().getData();

            const btEdit = document.createElement('button');
            btEdit.type = 'button';
            btEdit.title = 'Editar';
            btEdit.disabled = this.currentUser.nivel != 1;
            btEdit.style.cssText = 'height: fit-content; margin-left: 1rem;';
            btEdit.classList.add('button', 'is-primary', 'is-outlined');
            btEdit.innerHTML = this.myspan.innerHTML;
            btEdit.addEventListener('click', () => {
              this.$router.push(`/auxiliar/${row.id_auxiliar}/${this.tipo}`);
            });

            const btDel = document.createElement('button');
            btDel.type = 'button';
            btDel.title = 'Excluir';
            btDel.disabled = this.currentUser.nivel != 1;
            btDel.style.cssText = 'height: fit-content; margin-left: 1rem;';
            btDel.classList.add('button', 'is-danger', 'is-outlined');
            btDel.innerHTML = this.myspan2.innerHTML;
            btDel.addEventListener('click', async () => {
              const ok = await this.$refs.confirmDialog.show({
                title: 'Excluir',
                message: 'Deseja mesmo excluir esse registro?',
                okButton: 'Confirmar',
              })
              if (ok) {
                manutencaoService.delete(this.tipo, row.id_programa)
                  .then(resp => {
                    if (resp.status == '200') {
                      location.reload();
                    } else {
                      this.message = resp;
                      this.showMessage = true;
                      this.type = "alert";
                      this.caption = "Manutenção";
                      setTimeout(() => (this.showMessage = false), 3000);
                    }
                  })
                  .catch(err => {
                    this.message = err;
                    this.showMessage = true;
                    this.type = "alert";
                    this.caption = "Manutenção";
                    setTimeout(() => (this.showMessage = false), 3000);
                  })
              }
            });

            


            const buttonHolder = document.createElement('span');
            buttonHolder.appendChild(btEdit);
            buttonHolder.appendChild(btDel);

            return buttonHolder;

          }
        }
      ]
    } 
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/loggedUser"];
    },
    param() {
      return this.$route.params.id;
    }
  },
  watch: {
    param(newValue, oldValue) {
      location.reload(); // Chame sua função para carregar dados
    }
  },
  created() {
    this.tipo = this.$route.params.id;
    switch (this.tipo) {
      case '1':
        this.strTipo = 'Fabricantes Cadastrados';
        this.tableName = 'manFab';
        break;
      case '4':
        this.strTipo = 'Modelos Cadastradas';
        this.tableName = 'manMod';
        break;
      case '2':
        this.strTipo = 'Situações Cadastradas';
        this.tableName = 'manCond';
        break;
      case '3':
        this.strTipo = 'Tipos de Equipamento Cadastrados';
        this.tableName = 'manTipo';
        break;
      
      default:
      this.strTipo = 'ERRO';
        break;
    }
   // this.loadData();
  }
}
</script>

<style scoped>
.button {
  margin-right: 1rem;
}
</style>