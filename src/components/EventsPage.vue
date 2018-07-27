<template>
  <div>
    <hero
      title="Events"
      subtitle="Find an event to take part in"></hero>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-three-quarters">
        <div>
          <router-link v-if="currentUser" class="button" :to="{path: '/create-event'}">
            New event
          </router-link>
        </div>
        <div v-for="section in sections" class="events-paginator">
          <div class="section-title">{{ section.title }}</div>
            <paginator
            :resource="'events'"
            :query="eventsQuery"
            :show-headers="true"
            :headers="[
              {field: 'name', title: 'Name'},
              {field: 'status', title: 'Status'},
              {field: host, title: 'Host'},
              {field: 'numParticipants', title: 'Participants'},
              {field: rounds, title: 'Rounds'},
              {field: 'isPublic', title: 'Public'},
              {field: 'isScheduleVisible', title: 'Visible schedule'},
              {field: 'areChangesVisible', title: 'Visible changes'}
            ]"
            :linker="linker"
            :sort="'status'"
            :descending="false"
            :filters="section.filters" />
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
    data: () => ({
      eventsQuery: require('../graphql/events.gql'),
      sections: [
        {
          title: 'Participating',
          filters: {
            isParticipating: true,
          }
        },
        {
          title: 'Other',
          filters: {
            isParticipating: false,
          }
        },
      ]
    }),
    methods: {
      rounds: function(event) {
        if (event.currentRound) {
          return `${event.currentRound.index + 1} / ${event.numRounds}`
        } else {
          return event.numRounds;
        }
      },
      host: function (event) {
        return event.host.username;
      },
      linker: function(event) {
        return `/events/${event.slug}`;
      }
    },
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
  .events-paginator {
    margin-top: 25px;
  }
    .section-title {
      font-weight: bold;
      border-bottom: 1px solid #c0c0c0;
      margin-bottom: 5px;
    }
</style>
