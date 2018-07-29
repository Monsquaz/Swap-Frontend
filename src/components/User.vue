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
      error: ''
    }),
    computed: {
    },
    methods: {
      onError: function (err) {
        this.error = err;
      },
      onResult: function({ data }) {
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
