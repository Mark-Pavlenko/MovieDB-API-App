<template>
  <form
    class="text-center border border-primary p-5"
    style="margin-top: 70px; height: auto; padding-top: 100px !important"
    @submit.prevent="loginUser"
  >
    <h2>Sign Up</h2>
    <input
      type="text"
      id="email"
      class="form-control mb-5"
      placeholder="Email"
      v-model="login.email"
      required
    />

    <!-- Password -->
    <input
      type="password"
      id="password"
      class="form-control mb-5"
      placeholder="Password"
      v-model="login.password"
      required
    />

    <p>
      Dont have an account??<router-link to="/register">click here</router-link>
    </p>

    <!-- Sign in button -->
    <center>
      <button class="btn btn-primary btn-block w-75 my-4" type="submit">
        Sign in
      </button>
    </center>
  </form>
</template>

<script>
import swal from "sweetalert";
export default {
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async loginUser() {
      try {
        let response = await this.$http.post("/user/login", this.login);
        let token = response.data.token;
        localStorage.setItem("jwt", token);
        if (token) {
          swal("Success", "Login Successful", "Error");
          console.log("Our token: " + token);
          this.$router.push("/profile");
        }
      } catch (err) {
        swal("Error", "Something Went Wrong", "error");
        console.log(err.response);
      }
    },
  },
};
</script>

<style scoped>
</style>