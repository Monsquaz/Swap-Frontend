<template>
  <div>
    <hero
      title="Create event"
      subtitle="Make it good"></hero>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <div v-if="!currentUser">Login required</div>
        <div v-if="currentUser"></div>
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
    }),
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
</style>
