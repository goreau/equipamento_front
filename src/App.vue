<template>
  <Header />
  <div class="cont_total pt-5">
    <div class="cont_menu" v-if="showMenu">
      <sidebar-menu
        :menu="menu"
        :relative="true"
        @update:collapsed="onToggleCollapse"
        :showOneChild="true"
      />
    </div>
    <div class="main" id="main">
      
      <router-view />
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/general/Header.vue";
import Footer from "@/components/general/Footer.vue";
import { SidebarMenu } from "vue-sidebar-menu";

import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

export default {
  components: {
    Header,
    SidebarMenu,
    Footer,
    
  },
  methods: {
    onToggleCollapse(collapsed) {
      var dv = document.getElementById("main");
      if (collapsed) {
        dv.className = "main_colapsed";
      } else {
        dv.className = "main";
      }
    },
  },
  mounted() {
    if (this.hide) {
      this.onToggleCollapse(true);
    } 
  },
  watch:{
    hide(val){
      this.onToggleCollapse(val);
    }
  },
  computed: {
    showMenu() {
      this.hide = this.$route.path === "/"  || this.$route.path === "/login" || this.$route.path === "/forgot" || this.$route.path === "/reset";
      return !this.hide;
    },
  },
  data() {
    return {
      hide: false,
      user: true,
      menu: [
        {
          header: "Opções",
          hiddenOnCollapse: true,
        },
        {
          href: "/home",
          title: "Home",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-house",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/mycad",
              title: "Meu Cadastro",
            },
           /* {
              href: "/ajuda",
              title: "Materiais Auxiliares",
            },*/
            {
              href: "/",
              title: "Sair",
            },
          ],
        },
        {
          href: "/user",
          title: "Usuarios",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-users",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/users",
              title: "Consultar",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
            {
              href: "/troca",
              title: "Excluir",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-trash",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
          ],
        },
        {
          href: "/equipamento",
          title: "Equipamento",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-spray-can-sparkles",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/equipamentos",
              title: "Consultar",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
          ],
        },
        {
          href: "/movimento",
          title: "Movimento",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-arrow-right-arrow-left",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/movimentos",
              title: "Consultar",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
          ],
        },
        {
          href: "/equipMun",
          title: "Equip. Município",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-spray-can-sparkles",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/equipMuns",
              title: "Consultar",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
          ],
        },
        {
          href: "",
          title: "Manutenção",
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "fa-solid fa-screwdriver-wrench",
              size: "lg",
              transform: "shrink-8",
            },
          },
          child: [
            {
              href: "/listManutencao/1",
              title: "Fabricante",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
            {
              href: "/listManutencao/4",
              title: "Modelo",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
            {
              href: "/listManutencao/2",
              title: "Situação do Equipamento",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
            {
              href: "/listManutencao/3",
              title: "Tipo de Equipamento",
              icon: {
                element: "font-awesome-icon",
                attributes: {
                  icon: "fa-solid fa-search",
                  size: "lg",
                  transform: "shrink-8",
                },
              },
            },
          ],
        },
        {
          href: "",
          title: "Relatórios",
          icon: {
            element: "font-awesome-icon",
            class: "small",
            attributes: {
              icon: "fa-solid fa-file-lines",
              transform: "shrink-10",
            },
            // text: ''
          },
          child: [
            {
              href: "/mainReport/1",
              title: "Resumo de Equipamentos",
            },
            {
              href: "/mainReport/2",
              title: "Situação dos Equipamentos",
            },
            {
              href: "/mainReport/5",
              title: "Equipamentos sem Situação",
            },
            {
              href: "/mainReport/3",
              title: "Resumo Equip. Municipais",
            },
            {
              href: "/mainReport/4",
              title: "Listagem Equip. Municipais",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "@/components/general/css/custom-var";
@import "vue-sidebar-menu/src/scss/vue-sidebar-menu.scss";

* {
  font-family: Helvetica;
  font-size: medium;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.main-container {
  margin: 5rem;
  min-height: 40rem;
}
iframe#webpack-dev-server-client-overlay{display:none!important}
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
}
#app {
  height: 100%;
}
.main {
  margin-left: 290px;
  width: calc(100% - 290px);
  height: calc(100% - 7rem);
  margin-top: 6rem;
}
.main_colapsed {
  margin-left: 65px;
  width: calc(100% - 65px);
  height: calc(100% - 7rem);
  //   border:1px solid green;
}
.cont_total {
  width: 100%;
  height: calc(100%);

  ///  border:1px solid red;
}
.cont_menu {
  position: fixed;
  height: calc(100% - 7rem);
  width: 290px;
  overflow: auto;
  top: 4rem;
  bottom: 1rem;
}

.card {
  border: 0.5px solid #ccc;
  padding-top: 1rem;
}

.card-header p {
  color: rgb(23, 24, 102);
  font-size: larger;
}

.select {
  width: 100%;
}

.is-error {
  font-size: smaller;
  color: red;
  padding-left: 1rem;
}
.vsm--child {
  padding-left: 2rem;
  color:rgb(4, 5, 92);
}
.right-border {
    border-right: 2px solid black !important;
}

.tabulator-col-group{
  border-right: 2px solid black !important;
}
</style>
