<template>
  <ApolloQuery
    class="events"
    :query="require('../graphql/roundsubmissions.gql')"
    :variables="variables"
    @result="onResult">
    <template slot-scope="{ query, result: { data, loading } }">
      <template v-if="data && !loading">
        <hero
          :title="`Event: ${data.events[0].name}`"
          :subtitle="`Hosted by ${data.events[0].host.username}`"></hero>
        <div class="columns is-mobile is-centered">
          <section class="content-box column is-two-thirds">
          </section>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  module.exports = {
    name: 'roundsubmission',
    props: {},
    data: () => ({}),
    computed: {
      variables: () => {
        return {};
      }
    },
    methods: {
      onResult: function(res) {
        // TODO
      }
    },
    metaInfo: () => ({
      title: () => 'Roundsubmission', // TODO: "RAMPKORV's submission on Round 4 of Monsquaz Swap 9"
      meta: [{
        name: 'description',
        content: 'Roundsubmission details' // TODO
      }]
    })
  };
</script>

<style lang="sass" scoped>
</style>
