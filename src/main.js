import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import router from './routes';
import App from './App.vue';
// import "bootstrap/dist/css/bootstrap.css";

window.eventHub = new Vue();

Vue.use(VueRouter, axios)

const base = axios.create({
  baseURL: "http://localhost:4000"
});

Vue.prototype.$http = base;
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
