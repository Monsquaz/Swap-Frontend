import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { gql } from 'apollo-boost';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from "apollo-link-batch-http";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import Vue from 'vue';
import App from './App.vue';
//import VueRouter from 'vue-router';

const httpLink = new BatchHttpLink({
  uri: 'http://monsquaz.org:4000'
});

const wsLink = new WebSocketLink({
  uri: `ws://monsquaz.org:4000`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink, httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  batchInterval: 10
});

/*
Vue.use(VueRouter);
const router = new VueRouter({
  routes : routes,
  mode : 'history'
})
*/

new Vue({
  el: '#app',
  //router : router,
  render: h => h(App)
})
