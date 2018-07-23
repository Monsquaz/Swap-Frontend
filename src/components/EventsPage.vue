<template>
  <div>
    <hero
      title="Events"
      subtitle="Find an event to take part in"></hero>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <router-link v-if="currentUser" class="button" :to="{path: '/create-event'}">
          New event
        </router-link>
        <events-list :max-description="100" />
      </section>
    </div>
  </div>
</template>

<script>
  import EventsList from './EventsList.vue';
  module.exports = {
    name: 'events-page',
    props: {},
    data: () => ({}),
    metaInfo: () => ({
      title: () => 'List of events',
      meta: [{
        name: 'description',
        content: 'List of events.'
      }]
    }),
    apollo: {
      currentUser: {
        query: require('../graphql/currentUser.gql')
      }
    },
    components: { EventsList }
  };
</script>

<style lang="sass" scoped>
  .events {
    margin-top: 15px;
  }
</style>
