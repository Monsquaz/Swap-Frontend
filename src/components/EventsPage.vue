<template>
  <div>
    <hero
      title="Events"
      subtitle="Find an event to take part in"></hero>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <div>
          <router-link v-if="currentUser" class="button" :to="{path: '/create-event'}">
            New event
          </router-link>
        </div>
        <div class="events-list column">
          <div class="events-list-name">Discover</div>
          <events-list
            :max-description="100"
            :is-participating="false"
            :status="['Planned','Started']" />
        </div>
        <div class="events-list column">
          <div class="events-list-name">Participating</div>
          <events-list
            :max-description="100"
            :is-participating="true"
            :status="['Planned','Started']" />
        </div>
        <div class="events-list column">
          <div class="events-list-name">Archive</div>
          <events-list
            :max-description="100"
            :is-participating="false"
            :status="'Completed'" />
        </div>
        <div class="events-list column">
          <div class="events-list-name">Participated</div>
          <events-list
            :max-description="100"
            :is-participating="true"
            :status="['Completed']" />
        </div>
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
    .events-list-name {
      font-weight: bold;
      border-bottom: 1px solid #c0c0c0;
    }
  .events-list {
    padding: 5px; margin: 5px;
    float: left;
    overflow: auto;
    width: calc(50% - 10px);
  }
</style>
