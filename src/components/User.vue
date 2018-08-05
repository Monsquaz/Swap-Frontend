<template>
  <ApolloQuery
    class="roundsubmissions"
    :query="usersQuery"
    :variables="{
      filters: {
        slug: $route.params.slug
      }
    }"
    @result="onResult">
    <template slot-scope="{ query, result: { data, loading } }">
      <template v-if="data && !loading">
        <hero
          :title="`User: ${data.users[0].username}`"></hero>
        <div class="columns is-centered">
          <section class="content-box column is-two-thirds">
            <table class="table">
              <tr><th>Id</th><td>{{ data.users[0].id }}</td></tr>
              <tr><th>Username</th><td>{{ data.users[0].username }}</td></tr>
              <tr><th>Gravatar</th><td><img :src="data.users[0].gravatar" /></td></tr>
              <tr v-if="data.users[0].firstname"><th>Firstname</th><td>{{ data.users[0].firstname }}</td></tr>
              <tr v-if="data.users[0].lastname"><th>Lastname</th><td>{{ data.users[0].lastname }}</td></tr>
              <tr v-if="data.users[0].email"><th>Email</th><td>{{ data.users[0].email }}</td></tr>
            </table>

            <div class="columns">
              <div class="column is-half">
                <div class="section-title">
                  Events participated
                </div>
                <paginator
                  :resource="'events'"
                  :query="eventsQuery"
                  :show-headers="false"
                  :headers="[
                    { field: 'name', title: 'Name' }
                  ]"
                  :linker="eventsLinker"
                  :sort="'id'"
                  :descending="true"
                  :filters="{
                    participantUserId: user.id,
                    NOT: {
                      status: 'Cancelled'
                    }
                  }" />
              </div>
              <div class="column is-half">
                <div class="section-title">
                  Events hosted
                </div>
                <paginator
                  :resource="'events'"
                  :query="eventsQuery"
                  :show-headers="false"
                  :headers="[
                    { field: 'name', title: 'Name' }
                  ]"
                  :linker="eventsLinker"
                  :sort="'id'"
                  :descending="true"
                  :filters="{
                    hostUserId: user.id,
                    NOT: {
                      status: 'Cancelled'
                    }
                  }" />
              </div>
            </div>

          </section>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  module.exports = {
    name: 'user',
    props: {},
    data: () => ({
      usersQuery: require('../graphql/users.gql'),
      eventsQuery: require('../graphql/events.gql'),
      user: null,
      error: ''
    }),
    computed: {
    },
    methods: {
      eventsLinker: function (event) {
        return `/events/${event.slug}`;
      },
      onError: function (err) {
        this.error = err;
      },
      onResult: function({ data }) {
        this.user = data.users[0];
      }
    },
    metaInfo: () => ({
      title: () => 'User',
      meta: [{
        name: 'description',
        content: 'User details'
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .section-title {
    font-weight: bold;
    border-bottom: 1px solid #c0c0c0;
  }
</style>
