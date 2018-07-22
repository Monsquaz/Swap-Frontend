<template>
  <div>
    <div class="columns is-mobile is-centered">
    <section class="hero content-box column is-two-thirds">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Disclaimer</h1>
          <h2 class="subtitle">Because there needs to be one</h2>
        </div>
      </div>
    </section>
  </div>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <div>
          <h3>High ambitions - no guarantees</h3>
          <div class="content">
            <ul>
              <li>We make no profits from this service and do not intend to do so.
                It has been created during free time as a hobby</li>
              <li>We hope that it will work out for ourselves and for everyone else</li>
              <li>Usage of the service is a privilege, not a right</li>
              <li>Files or any other data aggregated by the service may be deleted for any reason whatsoever without explaination</li>
              <li>We have the ambition to keep all data safe - particularly user credentials such as email and password hashes.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'disclaimer',
    data: () => ({}),
    metaInfo: {
      title: 'Disclaimer',
      meta: [{
        name: 'description',
        content: 'Website disclaimer. Basically, use it at your own risk.'
      }]
    }
  };
</script>

<style lang="sass" scoped>
  .hero {
    margin-top: 40px;
  }
</style>
