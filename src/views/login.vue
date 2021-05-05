<template>
  <form @submit.prevent="loginUser">
    <div class="parent">
      <div class="container">
        <div class="content">
          <div class="title_container">
            <h2>Авторизация</h2>
            <hr />
          </div>
          <input
            type="text"
            id="email"
            placeholder="Email"
            v-model="login.email"
            required
          />

          <input
            type="password"
            id="password"
            placeholder="Пароль"
            v-model="login.password"
            required
          />

          <center>
            <button class="loginbtn" type="submit">Войти</button>
          </center>

          <center class="register-url">
            Нет аккаунта? Зарегестрируйтесь
            <router-link to="/register" class="register-link"
              >здесь</router-link
            >
          </center>
        </div>
      </div>
    </div>
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
body {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}

* {
  box-sizing: border-box;
}

.parent {
  width: 650px;
  height: 650px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.container {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  border: none;
}

.content {
  background-color: white;
  padding-top: 10px;
  padding-left: 55px;
  padding-bottom: 15px;
  padding-right: 55px;
}

/* Add padding to containers */
.title_container {
  text-align: center;
  padding-bottom: 15px;
}

/* Full-width input fields */
input {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #ddd;
  outline: none;
}

#submit {
  border-radius: 2px;
  border: none;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 2em;
  line-height: 1.6em;
  margin: 2em 0 0;
  outline: none;
  padding: 0.8em 0;
  text-shadow: 0 1px #68b25b;
}

/* Overwrite default styles of hr */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for the submit button */
.loginbtn {
  background-color: #04aa6d;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
  font-size: 14px;
  font-weight: bold;
}

.loginbtn:hover {
  opacity: 1;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.signin {
  background-color: #f1f1f1;
  text-align: center;
}

.register-link {
  font-weight: 600;
  text-decoration: none;
}

.register-url {
  margin-top: 10px;
}
</style>
