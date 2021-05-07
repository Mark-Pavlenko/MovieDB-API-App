import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

let routes = [
  {
    path: '/',
    name: 'home',
    components: {
      'list-router-view': require('./components/Home.vue')
    }
  },
  {
    name: 'home-category',
    path: '/movies/:category',
    components: {
      'list-router-view': require('./components/MoviesList.vue')
    }
  },
  {
    name: 'search',
    path: '/search/:query',
    components: {
      'search-router-view': require('./components/MoviesList.vue')
    }
  },
  {
    name: 'movie',
    path: '/movie/:id',
    components: {
      'page-router-view': require('./components/MoviePage.vue')
    }
  },
  {
    path: "/register",
    name: "register",
    components: {
      'page-router-view': require('./views/register.vue')
    }
  },
  {
    name: 'login',
    path: '/login',
    components: {
      'search-router-view': require('./views/login.vue')
    }
  },
  {
    name: 'profile',
    path: '/profile',
    components: {
      'search-router-view': require('./views/profile.vue')
    }
  }
];

const router =  new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'is-active'
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/profile"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
