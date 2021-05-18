import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import router from './routes';
import App from './App.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {faHeart, faUserSecret} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faHeart);

Vue.component('font-awesome-icon', FontAwesomeIcon)

window.eventHub = new Vue();

Vue.use(VueRouter, axios)

const base = axios.create({
  baseURL: "http://localhost:4000"
});

Vue.prototype.$http = base;
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  render: h => h(App)
})
