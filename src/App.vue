<template>
  <v-app>
    <v-app-bar v-if="loggedIn"
      app
      color="primary"
      dark
    >      
      <v-toolbar-title>User data manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="col-md-3">
        <v-select hide-details v-model="currentService" v-if="services && services.length > 1" @change="load(currentService)"
          :items="services"
          label="Services" outlined item-text="name" item-value="serviceId"></v-select>
      </div>
        <v-toolbar-title v-if="services && services.length == 1">{{services[0].name}}</v-toolbar-title>

      <div class="col-md-1"></div>
      <span>{{user.profile.name}}</span>
      <v-btn icon  @click="signout()" class="ml-2">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content >
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
import auth from './auth'
import data from './data'
import router from './router/index'

export default {
  name: 'App',
  router,
  components: {
  },

  data: () => ({
    drawer: false,
    loggedIn: false,
    user: null,
    services: null,
    currentService: null
  }),
  created() {
    router.afterEach((to) => {
      if (to.params.serviceId) {
        this.currentService = to.params.serviceId;
      }
    })
    auth.loggedIn().then(res => {
      this.loggedIn = res;
      if (res) {
        data.getServices().then(res => {
          var services = res || [];
          if (services.length == 0) {
            // TODO
          } else if (services.length == 1) {
            this.currentService = services[0].serviceId;
            this.load(this.currentService);
          // } else {
          //   services = [services[0]];
          //   this.currentService = services[0].serviceId;
          //   this.load(this.currentService.serviceId);
          }
          this.services = services;
        })
      }
    });
    auth.getUser().then(user => this.user = user);
  },
  methods: {
    signout() {
      auth.signout();
    },
    load(serviceId) {
      this.$router.push(`/users/${serviceId}`).catch(() => {})
    }
  }
};
</script>
