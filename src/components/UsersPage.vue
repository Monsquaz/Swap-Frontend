<template>
  <div>
    <hero
      title="Users"
      subtitle="Members of the site"></hero>
    <div class="columns is-centered">
      <section class="content-box column is-three-quarters">
        <paginator
        :resource="'users'"
        :query="query"
        :headers="[
          {field: 'id', title: 'Id', sortable: true },
          {field: 'username', title: 'Username', sortable: true }
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
      img: function (user) {
        return `<img src="${user.gravatar}" />`
      },
      linker: function (user) {
        return `/users/${user.slug}`;
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
