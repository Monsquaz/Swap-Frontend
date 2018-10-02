<template>
  <div>
    <hero
      title="Events"
      subtitle="Find an event to take part in"></hero>
    <div class="columns is-centered">
      <section class="content-box column is-three-quarters">
        <div class="notification is-info" v-if="dirty">
          Updates have occured. <a @click.prevent="reload()">Refresh</a> page to see changes.
        </div>
        <div>
          <router-link v-if="currentUser" class="button" :to="{path: '/create-event'}">
            <span class="icon">
              <icon :name="'plus'" scale="1" style="margin-right: 10px;"></icon>
            </span>
            New event
          </router-link>
        </div>
        <div v-for="section in sections" class="events-paginator">
          <div class="section-title">{{ section.title }}</div>
            <paginator
            :ref="section.ref"
            :resource="'events'"
            :query="eventsQuery"
            :show-headers="true"
            :headers="[
              {
                field: 'name',
                title: 'Name',
                sortable: true
              },
              {
                field: 'status',
                title: 'Status',
                sortable: true
              },
              {
                field: host,
                title: 'Host',
                sortable: true,
                sortField: 'hostUserId',
                tooltip: `The username of the user hosting the event`,
              },
              {
                field: 'numParticipants',
                title: 'Participants',
                sortable: true,
                tooltip: 'The number of currently signed up participants'
              },
              {
                field: rounds,
                title: 'Rounds',
                sortable: true,
                tooltip: 'Number of rounds in the event and (possibly) the current round'
              },
              {
                field: 'isPublic',
                title: 'Public',
                sortable: true,
                tooltip: 'Whether the event is available for everyone'
              },
              {
                field: 'isScheduleVisible',
                title: 'Visible schedule',
                sortable: true,
                tooltip: 'Whether the swap schedule is visible for everyone who can see the event'
              },
              {
                field: 'areChangesVisible',
                title: 'Visible changes',
                sortable: true,
                tooltip: 'Whether uploaded files should be public everyone who can see the event'
              }
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
  import 'vue-awesome/icons/plus';
  module.exports = {
    name: 'events-page',
    props: {},
    data: () => ({
      dirty: false,
      eventsQuery: require('../graphql/events.gql'),
      sections: [
        {
          ref: 'participating',
          title: 'Participating',
          filters: {
            isParticipating: true,
            NOT: { status: 'Cancelled' }
          }
        },
        {
          ref: 'other',
          title: 'Other',
          filters: {
            isParticipating: false,
            NOT: { status: 'Cancelled' }
          },
        },
      ]
    }),
    methods: {
      reload: function() {
        window.location.reload();
      },
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
        content: 'Find an event to join or a previous event to revisit.'
      }]
    }),
    apollo: {
      currentUser: {
        query: require('../graphql/currentUser.gql')
      },
      $subscribe: {
        eventsChanged: {
          query: require('../graphql/eventsChanged.gql'),
          result(data) {
            this.dirty = true;
          },
        },
      },

    }
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
