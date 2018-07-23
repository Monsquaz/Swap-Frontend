<template>
  <ApolloQuery
    class="events"
    :query="require('../graphql/events.gql')"
    :variables="variables">
    <template slot-scope="{ result: { data, loading } }">
      <template v-if="data && !loading">
        <div class="event" v-for="event in data.events">
          <div class="event-top">
            <div class="event-name">{{ event.name }}</div>
            <div class="event-host">
              <router-link :to="pathToUser(event.host.slug)">
                {{ event.host.username }}
              </router-link>
            </div>
          </div>
          <div class="event-description" v-html="formatText(event.description)"></div>
          <div class="tags">
            <span v-if="event.isAdministrator" class="tag">Administrator</span>
            <span v-if="event.isParticipant" class="tag">Participant</span>
            <span class="tag">{{ event.status }}</span>
          </div>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  module.exports = {
    name: 'events-list',
    props: {
      isParticipating: Boolean,
      status: String,
      limit: Number,
      hostUserId: Number,
      maxDescription: Number
    },
    computed: {
      variables: function() {
        return {
          isParticipating: this.isParticipating,
          status: this.status,
          limit: this.limit,
          hostUserId: this.hostUserId,
          maxDescription: this.maxDescription
        };
      }
    },
    methods: {
      pathToUser: function(slug) {
        return `/users/${slug}`;
      },
      formatText: function(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
      }
    },
    data: () => ({}),
    apollo: {
      currentUser: {
        query: require('../graphql/currentUser.gql')
      }
    }
  };
</script>

<style lang="sass" scoped>
  .events {
    margin-top: 15px;
  }
    .event {
      padding: 15px;
      background-color: #ffffff;
      border: 1px solid #c0c0c0;
    }
    .event-top {
      div {
        display: inline;
        float: left;
      }
      clear: both;
    }
      .event-description {
        clear: both;
      }
  .event-host::before {
    content: '--';
  }
</style>
