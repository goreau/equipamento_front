<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Equipamentos Cadastrados</p>
            <button class="button is-primary is-outlined" @click="newUser">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Novo</span>
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
          <span class="icon is-small is-left" name="coisa3">
            <font-awesome-icon  icon="fa-solid fa-arrow-right-arrow-left" />
          </span>
        </div>
      </div>
    </div>
  </div>
  <confirm-dialog ref="confirmDialog"></confirm-dialog>
</template>

<script>
import cadastroService from "@/services/cadastro.service";
import MyTable from '@/components/forms/MyTable.vue';
import Loader from '@/components/general/Loader.vue';
import Message from "@/components/general/Message.vue";
import ConfirmDialog from '@/components/forms/ConfirmDialog.vue';

export default {
  name: 'ListaVendas',
  data() {
      return {
          tableName: 'cadastro',
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
        this.$router.push('/cadastro');
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
    this.myspan3 = document.getElementsByName('coisa3')[0];

    //document.createElement('span');
   // this.myspan.innerHTML='<p>teste</p>';;

      this.isLoading = true;
      cadastroService.getCadastros(this.id_user)
          .then((response) => {
              this.dataTable = response.data;
              this.isLoading = false;
          })
          .catch((err) =>{
            console.log(err);
          })
          .finally(() => this.isLoading = false);

      this.columns = [
          {title: 'Local Origem', field: 'origem', minWidth: 200, responsive: 1},
          {title: 'Tipo', field: 'tipo', minWidth: 200, responsive: 4},
          {title: 'Fabricante', field: 'fabricante', minWidth: 100},
          {title: 'Patrimônio', field: 'patrimonio', minWidth: 150},
          {title: 'Patrimônio CCD', field: 'patr_ccd', minWidth: 150},
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
                this.$router.push(`/editEquipamento/${row.id_cadastro}`);
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
                  message: 'Deseja mesmo excluir esse equipamento e os possíveis movimentos associados a ele? Essa ação não poderá ser revertida!',
                  okButton: 'Confirmar',
              })
              if (ok) {
                cadastroService.delete(row.id_cadastro)
                .then(resp =>{
                  if (resp.status == '200'){
                    if (resp.data.err){
                      var uses = resp.data.msg.join();
                      this.message = `Esse usuário tem uso nas seguinte(s) fonte(s) de informação: <b> ${uses}</b>. Ele foi marcado como inativo. Para excluí-lo definitavamente, exclua os usos e depois tente novamente!`;
                      this.showMessage = true;
                      this.type = "alert";
                      this.caption = "Usuário";
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
                    this.caption = "Usuário";
                    setTimeout(() => {this.showMessage = false}, 3000);
                  }
                })
                .catch(err =>{
                  this.message = err;
                  this.showMessage = true;
                  this.type = "alert";
                  this.caption = "Usuário";
                  setTimeout(() => {this.showMessage = false}, 3000);
                })
              }
              });

              const btMov = document.createElement('button');
              btMov.type = 'button';
              btMov.title = 'Movimentos';
              //btMov.disabled = this.id_user != row.owner_id;
              btMov.style.cssText = 'height: fit-content; margin-left: 1rem;';
              btMov.classList.add('button', 'is-link', 'is-outlined');
              btMov.innerHTML = this.myspan3.innerHTML;
              btMov.addEventListener('click', () => {
                this.$router.push(`/movimentosEq/${row.id_cadastro}`);
              });

              
              const buttonHolder = document.createElement('span');
              buttonHolder.appendChild(btEdit);
              buttonHolder.appendChild(btDel);
              buttonHolder.appendChild(btMov);
             
              return buttonHolder;

            }}
      ]
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/loggedUser"];
    },
  },
}
</script>

<style scoped>
.button { 
  margin-right: 1rem;
}
  
</style>