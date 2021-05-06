<template>
  <div>

    <div class="profile__content">
      <header class="profile__header">
        <h2 class="profile__title">Здравствуйте, {{ user.name }} !</h2>
        <button class="button" @click="logUserOut">Выйти</button>
      </header>
<!--      <movies-list :type="'component'" :mode="'favorite'"></movies-list>-->
<!--      <created-lists></created-lists>-->
    </div>

    <section>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item">Name : {{ user.name }}</li>
              <li class="list-group-item">Email : {{ user.email }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import VueJwtDecode from "vue-jwt-decode";
  export default {
    data() {
      return {
        user: {}
      };
    },
    methods: {
      getUserDetails() {
        let token = localStorage.getItem("jwt");
        let decoded = VueJwtDecode.decode(token);
        this.user = decoded;
      },
      logUserOut() {
        localStorage.removeItem("jwt");
        this.$router.push("/login");
      }
    },

    created() {
      this.getUserDetails();
    }
  };
</script>

<style lang="scss">
  @import "./src/scss/variables";
  @import "./src/scss/media-queries";
  .profile{
    &__content{
      .wrapper{
        min-height: calc(100vh - 175px);
        @include tablet-min{
          min-height: calc(100vh - 171px);
        }
      }
    }
    &__header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid rgba($c-dark, 0.05);
      @include tablet-min{
        padding: 29px 30px;
      }
      @include tablet-landscape-min{
        padding: 29px 50px;
      }
      @include desktop-min{
        padding: 29px 60px;
      }
    }
    &__title{
      margin: 0;
      font-size: 16px;
      line-height: 16px;
      color: $c-dark;
      font-weight: 300;
      @include tablet-min{
        font-size: 18px;
        line-height: 18px;
      }
    }
  }
</style>