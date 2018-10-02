import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { BatchHttpLink } from "apollo-link-batch-http";

import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import Vue from 'vue';
import App from './App.vue';
import VueApollo from 'vue-apollo'
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import VeeValidate from 'vee-validate';
import VTooltip from 'v-tooltip';
import VueSweetalert2 from 'vue-sweetalert2';
import VueDisqus from 'vue-disqus'

import routes from './routes';
import Icon from 'vue-awesome/components/Icon.vue'
import config from '../config';
import introspectionQueryResultData from '../fragmentTypes.json';

Vue.use(Meta);
Vue.use(VeeValidate);
Vue.use(VTooltip);
Vue.use(VueSweetalert2);
Vue.use(VueDisqus)

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
Vue.component('swap-schedule', () => import(
  /* webpackChunkName: "swap-schedule" */ './components/SwapSchedule.vue'
));
Vue.component('paginator', () => import(
  /* webpackChunkName: "paginator" */ './components/Paginator.vue'
));

const httpLink = new BatchHttpLink({ uri: config.apiUri });


const wsLink = new WebSocketLink({
  uri: `wss://swap.monsquaz.org:4000`,
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink, httpLink
);

const authLink = setContext((_, { headers }) => {
  const authToken = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      'X-GraphQL-Deduplicate': true,
      authorization: authToken ? `Bearer ${authToken}` : "",
    }
  }
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const apolloClient = new ApolloClient({
  link: authLink.concat(splitLink),
  //link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    fragmentMatcher
  }),
  batchInterval: 10
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

new Vue({
  el: '#app',
  router : router,
  provide: apolloProvider.provide(),
  render: h => h(App)
})
