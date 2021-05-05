<template>
  <form @submit.prevent="registerUser">
    <div class="parent">
      <div class="container">
        <div class="content">
          <div class="title_container">
            <h1>Регистрация</h1>
            <p>Для создания аккаунта, пожалуйста, заполните эту форму.</p>
            <hr />
          </div>
          <input
            type="text"
            id="name"
            placeholder="Имя"
            v-model="register.name"
            required
          />
          <input
            type="email"
            id="email"
            placeholder="Электронный адрес"
            v-model="register.email"
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Пароль"
            v-model="register.password"
          />

          <button class="registerbtn" type="submit">Зарегестрироваться</button>

          <center class="login-url">
            Уже зарегестрированы? Пожалуйста, авторизируйтесь
            <router-link to="/login" class="signup__link"> здесь.</router-link>
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
      register: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async registerUser() {
      try {
        let response = await this.$http.post("/user/register", this.register);
        console.log(response);
        let token = response.data.token;
        if (token) {
          localStorage.setItem("jwt", token);
          this.$router.push("/login");
          swal("Success", "Registration Was successful", "success");
        } else {
          swal("Error", "Something Went Wrong", "Error");
        }
      } catch (err) {
        let error = err.response;
        if (error.status == 409) {
          swal("Error", error.data.message, "error");
        } else {
          swal("Error", error.data.err.message, "error");
        }
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
.registerbtn {
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

.registerbtn:hover {
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

.signup__link {
  font-weight: 600;
  text-decoration: none;
}

.login-url {
  margin-top: 10px;
}
</style>
