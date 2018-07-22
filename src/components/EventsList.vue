<template>
  <div>
    <hero
      title="Events"
      subtitle="Find an event to take part in"></hero>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <ApolloQuery :query="require('../graphql/events.gql')" :variables="{}">
          <template slot-scope="{ result: { data, loading } }">
            <table class="table" v-if="data && data.events.length > 0">
              <tr><thead></thead></tr>
              <tr></tr>
            </table>
            <div v-if="data && data.events.length == 0">No events found</div>
          </template>
        </ApolloQuery>
      </section>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'events-list',
    props: {},
    data: () => ({}),
    metaInfo: () => ({
      title: () => 'List of events',
      meta: [{
        name: 'description',
        content: 'List of events.'
      }]
    })
  };
</script>

<style lang="sass" scoped>
</style>
