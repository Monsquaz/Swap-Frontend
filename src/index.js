import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { gql } from 'apollo-boost';
import { split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from "apollo-link-batch-http";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo'
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import VeeValidate from 'vee-validate';
import routes from './routes';
import Icon from 'vue-awesome/components/Icon.vue'
import config from '../config';

Vue.use(Meta);
Vue.use(VeeValidate);

Vue.component('icon', Icon);

Vue.component('green-arrows', () => import(
  /* webpackChunkName: "green-arrows" */ './components/GreenArrows.vue'
));
Vue.component('monsquaz-footer', () => import(
  /* webpackChunkName: "green-arrows" */ './components/MonsquazFooter.vue'
));
Vue.component('hero', () => import(
  /* webpackChunkName: "hero" */ './components/Hero.vue'
));

const httpLink = new BatchHttpLink({ uri: config.apiUri });

const wsLink = new WebSocketLink({
  uri: `ws://monsquaz.org:4000`,
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink, httpLink,
);

const authLink = setContext((_, { headers }) => {
  const authToken = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: authToken ? `Bearer ${authToken}` : "",
    }
  }
});

const apolloClient = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
  batchInterval: 10
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  router : router,
  provide: apolloProvider.provide(),
  render: h => h(App)
})
