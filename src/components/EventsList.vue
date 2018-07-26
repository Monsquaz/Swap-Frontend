<template>
  <ApolloQuery
    class="events"
    :query="require('../graphql/events.gql')"
    :variables="variables">
    <template slot-scope="{ result: { data, loading } }">
      <template v-if="data && !loading">
        <div v-if="data.events.length == 0">None found</div>
        <div class="event" v-if="data.events.length > 0" v-for="event in data.events">
          <div class="event-top">
            <div class="event-name">{{ event.name }}</div>
            <div class="event-host">
              admin: <router-link :to="pathToUser(event.host.slug)">
                {{ event.host.username }}
              </router-link>
              <img :src="event.host.gravatar" />
            </div>
            <div class="event-num-participants" v-if="event.numParticipants > 0">
              <strong>{{ event.numParticipants }}</strong>
              {{ event.numParticipants > 1 ? 'participants' : 'participant' }}
            </div>
            <div class="event-rounds" v-if="event.status == 'Started' && event.currentRound">
              Round
              <strong>{{ event.currentRound.index }}</strong> of
              <strong>{{ event.numRounds }}</strong>
            </div>
          </div>
          <div class="event-description" v-html="formatText(event.description)"></div>
          <div class="event-actions">
            <div class="event-action button is-info" @click="readMore(event)">
              Read more
            </div>
            <div
              v-if="!event.isParticipant && event.status != 'Complete'"
              class="event-action button is-link"
              @click="join(event)">
              Join
            </div>
          </div>
          <div class="event-tags">
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
      name: String,
      isParticipating: Boolean,
      status: [Array, String],
      limit: Number,
      hostUserId: Number,
      maxDescription: Number
    },
    computed: {
      variables: function() {
        return {
          details: false,
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
      },
      readMore: function(event) {
        this.$router.push({ path: `/events/${event.slug}` })
      },
      join: function(event) {
        console.warn('TODO');
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
  .events-list-name {
    border-bottom: 1px solid #c0c0c0;
    font-weight: bold;
  }
  .events {
    margin-top: 15px;
  }
  .event {
    font-size: 0.9em;
    padding: 5px;
    background-color: #ffffff;
    border: 1px solid #c0c0c0;
    margin: 5px;
    padding: 5px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.75);
    >div {
      padding-top: 5px;
        padding-bottom: 5px;
    }
  }
  .event-top {
    overflow: auto;
    clear: both;
  }
  .event-name {
    font-weight: bold;
    float: left;
  }
  .event-host {
    text-align: right;
  }
  .event-num-participants {
    text-align: right;
  }
  .event-rounds {
    text-align: right;
  }
  .event-description {
    clear: both;
  }
  .event-actions {
    text-align: center;
    clear: both;
    overflow: auto;
    padding-top: 7px;
    padding-bottom: 7px;
  }
  .event-action {
    display: inline;
    &:not(:first-child) {
      margin-left: 15px;
    }
  }
</style>
