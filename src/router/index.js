import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'loginHome',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/LoginView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/LoginView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component:  () => import(/* webpackChunkName: "about" */ '../views/general/HomeView.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "user" */ '../views/user/UsuarioView.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "user" */ '../views/user/ListUsersView.vue'),
  },
  {
    path: '/troca',
    name: 'troca',
    component: () => import(/* webpackChunkName: "user" */ '../views/user/TrocaUserView.vue'),
  },
  {
    path: '/editUser/:id',
    name: 'editUser',
    component: () => import(/* webpackChunkName: "user" */ '../views/user/EditUsuarioView.vue'),
  },
  {
    path: '/mycad',
    name: 'cadastro',
    component: () => import(/* webpackChunkName: "home" */ '../views/user/MyCadastroView.vue'), 
  },
  {
    path: '/ajuda',
    name: 'ajuda',
    component: () => import(/* webpackChunkName: "about" */ '../views/general/AjudaView.vue'),
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: () => import(/* webpackChunkName: "home" */ '../views/user/ForgotView.vue'), 
  },
  {
    path: '/resets/:token',
    name: 'resets',
    component: () => import('../views/user/ResetView.vue'), 
  },
  {
    path: '/equipamento',
    name: 'equipamento',
    component: () => import(/* webpackChunkName: "user" */ '../views/equipamento/EquipamentoView.vue'),
  },
  {
    path: '/equipamentos',
    name: 'equipamentos',
    component: () => import(/* webpackChunkName: "user" */ '../views/equipamento/ListEquipamentoView.vue'),
  },
  {
    path: '/editEquipamento/:id',
    name: 'editEquipamento',
    component: () => import(/* webpackChunkName: "user" */ '../views/equipamento/EditEquipamentoView.vue'),
  },
  {
    path: '/movimento',
    name: 'movimento',
    component: () => import(/* webpackChunkName: "user" */ '../views/movimento/MovimentoView.vue'),
  },
  {
    path: '/movimentos',
    name: 'movimentos',
    component: () => import(/* webpackChunkName: "user" */ '../views/movimento/ListMovimentoView.vue'),
  },
  {
    path: '/editMovimento/:id',
    name: 'editMovimento',
    component: () => import(/* webpackChunkName: "user" */ '../views/movimento/EditMovimentoView.vue'),
  },
  {
    path: '/equipMun',
    name: 'equipMun',
    component: () => import(/* webpackChunkName: "user" */ '../views/equipamento/EquipamentoView.vue'),
  },
  {
    path: '/equipMuns',
    name: 'equipMuns',
    component: () => import(/* webpackChunkName: "user" */ '../views/equipamento/ListEquipamentoView.vue'),
  },
  {
    path: '/editEquipMun/:id',
    name: 'editEquipMun',
    component: () => import(/* webpackChunkName: "user" */ '../views/equipamento/EditEquipamentoView.vue'),
  },
  {
    path: '/listManutencao/:id',
    name: 'listManutencao',
    component: () => import(/* webpackChunkName: "user" */ '../views/manutencao/ListManutencaoView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
