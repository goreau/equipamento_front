<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Movimentação de Equipamentos Cadastradas</p>
            <button class="button is-primary is-outlined" @click="newUser" v-if="id_cadastro == null">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Novo</span>
            </button>
            <button class="button is-primary is-outlined" @click="newMov" v-if="id_cadastro != null">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Novo</span>
            </button>
            <button class="button is-info is-outlined" @click="back" v-if="id_cadastro != null">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Voltar</span>
            </button>
          </header>
          <div class="card-content">
            <MyTable :tableData="dataTable" :columns="columns" :filtered="true" :tableName="tableName"/>
          </div>
        </div>
        <div style="display: none;">
          <span class="icon is-small is-left" name="coisa">
            <font-awesome-icon icon="fa-solid fa-edit" />
          </span>
          <span class="icon is-small is-left" name="coisa2">
            <font-awesome-icon  icon="fa-solid fa-trash" />
          </span>
        </div>
      </div>
    </div>
  </div>
  <confirm-dialog ref="confirmDialog"></confirm-dialog>
</template>

<script>
import movimentoService from "@/services/movimento.service";
import MyTable from '@/components/forms/MyTable.vue';
import Loader from '@/components/general/Loader.vue';
import Message from "@/components/general/Message.vue";
import ConfirmDialog from '@/components/forms/ConfirmDialog.vue';

export default {
  name: 'ListaVendas',
  data() {
      return {
          tableName: 'movimento',
          dataTable: [],
          isLoading: false,
          showMessage: false,
          message: "",
          caption: "",
          type: "",
          columns: [],
          myspan: null,
          myspan2: null,
          myspan3: null,
          id_user: 0,
      }
  },
  components: {
      MyTable,
      Loader,
      ConfirmDialog,
      Message,

  },
  methods: {
      newUser() {
        this.$router.push('/movimento');
      },
      newMov() {
        this.$router.push(`/movimentoEq/${this.id_cadastro}`);
      },
      back() {
        this.$router.go(-1);
      },
      editUser(id) {
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
    if (this.id_cadastro != null){
      localStorage.removeItem(this.tableName);

      movimentoService.getMovimentosEq(this.id_cadastro)
          .then((response) => {
              this.dataTable = response.data;
              this.isLoading = false;
          })
          .catch((err) =>{
            console.log(err);
          })
          .finally(() => this.isLoading = false);
    } else {
      movimentoService.getMovimentos()
          .then((response) => {
              this.dataTable = response.data;
              this.isLoading = false;
          })
          .catch((err) =>{
            console.log(err);
          })
          .finally(() => this.isLoading = false);
    }

      
      

      this.columns = [
          {title: 'Patrimônio', field: 'patrimonio', minWidth: 150},
          {title: 'Fabricante', field: 'fabricante', minWidth: 100},
          {title: 'Tipo', field: 'tipo', minWidth: 200, responsive: 3},
          {title: 'Local Origem', field: 'origem', minWidth: 200, responsive: 1},
          {title: 'Condição', field: 'condicao', minWidth: 200},
          {title: 'Local Destino', field: 'destino', minWidth: 200, responsive: 2},
          {title: 'Município', field: 'municipio', minWidth: 200},
          {title: 'Data', field: 'dt_movimento', minWidth: 200, formatter:"datetime", formatterParams:{
              inputFormat:"yyyy-MM-dd",
              outputFormat:"dd/MM/yyyy",
              invalidPlaceholder:"Data inválida",
              timezone:"America/Sao_Paulo",
          }},
          {title: 'Responsável', field: 'owner', minWidth: 100},
          {title: 'Ações', responsive: 0, minWidth: 250, 
            formatter: (cell, formatterParams) =>{
              const row = cell.getRow().getData();

              const btEdit = document.createElement('button');
              btEdit.type = 'button';
              btEdit.title = 'Editar';
              btEdit.disabled = this.id_user != row.owner_id;
              btEdit.style.cssText = 'height: fit-content; margin-left: 1rem;';
              btEdit.classList.add('button', 'is-primary', 'is-outlined');
              btEdit.innerHTML = this.myspan.innerHTML;
              btEdit.addEventListener('click', () => {
                this.$router.push(`/editMovimento/${row.id_movimento}`);
              });

            /* const teste = document.createElement('div'); 
              teste.classList.add('icon', 'is-small');
              teste.innerHTML='<span><font-awesome-icon icon=\"fa-solid fa-envelope\" /></span>';*/

              const btDel = document.createElement('button');
              btDel.type = 'button';
              btDel.title = 'Excluir';
              btDel.disabled = this.id_user != row.owner_id;
              btDel.style.cssText = 'height: fit-content; margin-left: 1rem;';
              btDel.classList.add('button', 'is-danger', 'is-outlined');
              btDel.innerHTML = this.myspan2.innerHTML;
              btDel.addEventListener('click', async() => {
                const ok = await this.$refs.confirmDialog.show({
                  title: 'Excluir',
                  message: 'Deseja mesmo excluir esse movimento?',
                  okButton: 'Confirmar',
              })
              if (ok) {
                movimentoService.delete(row.id_movimento)
                .then(resp =>{
                  if (resp.status == '200'){
                    if (resp.data.err){
                      var uses = resp.data.msg.join();
                      this.message = `Erro: ${uses}!`;
                      this.showMessage = true;
                      this.type = "alert";
                      this.caption = "Movimento";
                      setTimeout(() => {
                        this.showMessage = false;
                        location.reload();
                      }, 5000);
                      
                    } else {
                      location.reload();
                    }
                    
                  } else {
                    this.message = resp;
                    this.showMessage = true;
                    this.type = "alert";
                    this.caption = "Movimento";
                    setTimeout(() => {this.showMessage = false}, 3000);
                  }
                })
                .catch(err =>{
                  this.message = err;
                  this.showMessage = true;
                  this.type = "alert";
                  this.caption = "Movimento";
                  setTimeout(() => {this.showMessage = false}, 3000);
                })
              }
              });

              
              const buttonHolder = document.createElement('span');
              buttonHolder.appendChild(btEdit);
              buttonHolder.appendChild(btDel);
             
              return buttonHolder;

            }}
      ]
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/loggedUser"];
    },
    id_cadastro(){
      return this.$route.params.id || null;
    }
  },
}
</script>

<style scoped>
.button { 
  margin-right: 1rem;
}
  
</style>