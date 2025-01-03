<template>
  <div class="home">
    <br>
    <div class="columns">
      <div class="column is-8 is-offset-2 has-text-centered pt-6 mt-6">
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
      </div>
    </div>
    <div class="columns">
      <div class="column is-full has-text-centered pt-6 mt-6">
        <div class="box">
          <div class="welcome_image"></div>
          <p class="title place" style="margin-top: 5%;">Sistema para gerenciamento de equipamentos utilizados no controle de vetores
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import authService from "@/services/auth.service";
import Message from "@/components/general/Message.vue";

export default {
  name: 'HomeView',
  components: {
    Message,
  },
  data() {
    return {
      user: 0,
      cUser: {},
      message: "",
      caption: "",
      type: "",
      showMessage: false,
    }
  },
  methods: {
    closeMessage(){
      this.showMessage = false;
    },
    alertEmail() {
      authService.getUserData(this.user).then(
        (response) => {
          this.showMessage = true;
          this.cUser = response.data;
          this.showMessage = true;
          this.message = "<b>Atenção</b>: O Email cadastrado para essa conta é: <br> <b>" + this.cUser.email + "</b>.<br> Altere-o caso necessário na seção Meu Cadastro!";
          this.type = "warning";
          this.caption = "Cadastro";
          setTimeout(() => {
            this.showMessage = false;
          }, 10000);
        },
        (error) => {
          this.message = error;
          this.showMessage = true;
          this.type = "alert";
          this.caption = "Cadastro";
          setTimeout(() => (this.showMessage = false), 3000);
        }
      )
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/loggedUser"];
    },
  },
  mounted() {
    let cUser = this.currentUser;
    if (cUser) {
      this.user = cUser.id;
    }
    this.alertEmail();
  },
}
</script>

<style scoped lang="scss">
@import "@/components/general/css/custom-var";

img {
  width: 18vw;
}

.title {
  margin-top: 4vw;
  font-size: 3vw;
  color: $item-color-master;
}

.place {
  font-size: 2vw;
  color: $item-color-master;
}

.welcome_image {
  background-image: url('../../assets/home.png');
  opacity: 0.3;
  height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
}

.box {
  position: relative;
  display: inline-block;
  /* Make the width of box same as image */
  width: 100%;
}

.box.title {
  color: $item-color-master;
  position: absolute;
  z-index: 1;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 40%;
  /* Adjust this value to move the positioned div up and down */
  text-align: center;
  width: 100%;
  font-size: 4vw;
  /* Set the width of the positioned div */
}
</style>
