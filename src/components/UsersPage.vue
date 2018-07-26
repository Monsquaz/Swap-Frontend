<template>
  <div>
    <div class="columns is-mobile is-centered">
    <section class="hero content-box column is-two-thirds">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Users</h1>
          <h2 class="subtitle">Members of the site</h2>
        </div>
      </div>
    </section>
  </div>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <paginator
        :resource="'users'"
        :query="query"
        :headers="[
          {field: 'id', title: 'Id'},
          {field: 'username', title: 'Username'},
          {field: 'gravatar', title: 'Image', f: img}
        ]"
        :linker="linker"
        :sort="'id'"
        :descending="false"
        ></paginator>
      </section>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'users-page',
    data: () => ({
      query: require('../graphql/users.gql')
    }),
    methods: {
      linker: function (user) {
        return `/users/${user.slug}`;
      },
      img: function(data) {
        return `<img src="${data}" />`;
      }
    },
    metaInfo: {
      title: 'Users',
      meta: [{
        name: 'description',
        content: 'List of users.'
      }]
    }
  };
</script>

<style lang="sass" scoped>
  .hero {
    margin-top: 40px;
  }
</style>


// Hur fältet visas i tabellen, underliggande fält, sorteringsordning
// Ordning på fält
// Länkningsfunktion
