<template>
  <div class="app green">
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link class="navbar-item home" to="/">
          <img src="/images/favicon-32x32.png" class="logo" /> &nbsp;
          Monsquaz Swap
        </router-link>
        <div class="navbar-burger burger" v-on:click="isActive = !isActive">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu" v-bind:class="{'is-active': isActive}">
        <div class="navbar-start">
          <div class="navbar-item">
            <router-link class="navbar-link" to="/">Start</router-link>
          </div>
          <div class="navbar-item">
            <router-link class="navbar-link" to="/events">Events</router-link>
          </div>
          <div class="navbar-item">
            <router-link class="navbar-link" to="/related-links">Related links</router-link>
          </div>
        </div>
        <ApolloQuery :query="require('./graphql/currentUser.gql')">
          <template slot-scope="{ query, result: { data, loading } }">
            <div class="navbar-end" v-if="data && !loading">
              <template v-if="!data.currentUser">
                <router-link class="navbar-item" to="/login">Login</router-link>
                <router-link class="navbar-item" to="/register">Register</router-link>
              </template>
              <template v-else>
                <img
                  v-bind:alt="data.currentUser.username"
                  v-bind:src="data.currentUser.smallGravatar" />
                <a class="navbar-item" v-on:click.stop="logout(query)">Logout</a>
              </template>
            </div>
          </template>
        </ApolloQuery>
      </div>
    </nav>
    <router-view id="view"></router-view>
    <green-arrows></green-arrows>
    <monsquaz-footer></monsquaz-footer>
    <cookie-law
      theme="blood-orange--rounded"
      transitionName="fade"
      position="bottom" />
  </div>
</template>

<script>
import { ApolloQuery } from 'vue-apollo';
import CookieLaw from 'vue-cookie-law'
module.exports = {
  name: 'app',
  data: () => ({
    isActive: false
  }),
  computed: {},
  methods: {
    logout: function(query) {
      localStorage.removeItem('authToken');
      query.refetch();
    }
  },
  metaInfo: {
    titleTemplate: '%s | Monsquaz Swap',
    meta: [
      {'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'}
    ]
  },
  components: { CookieLaw }
};
</script>

<style lang="sass">
  @import 'scss/all';
  #view {
    min-height: calc(100vh - 361px);
  }
  .navbar-end {
    padding: 7px;
  }
  .app {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(
      to bottom,
      #bbffdd 0.00%,  #bbffdd 1.35%,
      #aaffd5 1.35%,  #aaffd5 5.93%,
      #99ffcc 5.93%,  #99ffcc 9.70%,
      #88ffc4 9.70%,  #88ffc4 13.75%,
      #77ffbb 13.75%, #77ffbb 17.52%,
      #66ffb3 17.52%, #66ffb3 22.10%,
      #55ffaa 22.10%, #55ffaa 26.15%,
      #44ffa2 26.15%, #44ffa2 29.92%,
      #33ff99 29.92%, #33ff99 33.96%,
      #22ff91 33.96%, #22ff91 38.54%,
      #11ff88 38.54%, #11ff88 42.59%,
      #00ff80 42.59%, #00ff80 46.36%,
      #00ee77 46.36%, #00ee77 50.40%,
      #00dd6f 50.40%, #00dd6f 54.18%,
      #00cc66 54.18%, #00cc66 58.76%,
      #00bb5e 58.76%, #00bb5e 62.80%,
      #00aa55 62.80%, #00aa55 66.58%,
      #00994d 66.58%, #00994d 70.62%,
      #008844 70.62%, #008844 75.20%,
      #00773c 75.20%, #00773c 78.98%,
      #006633 78.98%, #006633 83.02%,
      #00552b 83.02%, #00552b 87.06%,
      #004422 87.06%, #004422 91.64%,
      #00331a 91.64%, #00331a 95.42%,
      #002211 95.42%, #002211 99.46%,
      #001109 99.46%, #001109 100.00%
    ) no-repeat center center fixed;
    background-size: cover;
  }
  .navbar {
    width: calc(100vw - 16px);
    border-bottom: 1px solid black;
  }
  .menu {
    background-color: #ffffff;

  }
  .footer {
    margin-top: 45px;
    width: 100vw;
    border-top: 1px solid black;
    background: linear-gradient(to bottom,  #a8fdd1 0%,#2efd94 25%,#003214 100%) no-repeat center center fixed;
    background-size: cover;
    color: #ffffff;
    opacity: 0.95;
    /* position: absolute; bottom: 0; */
  }
</style>
