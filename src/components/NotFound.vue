<template>
  <div>
    <div class="columns is-mobile is-centered">
    <section class="hero content-box column is-two-thirds">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Not Found</h1>
          <h2 class="subtitle">:-(</h2>
        </div>
      </div>
    </section>
  </div>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <p><strong>Total bummer.</strong></p>
        <p>If we've linked you here incorrectly, then you should report this to info@monsquaz.org so we can fix it</p>
        <p>If you spelled the URL wrong, then you should spell it correctly.</p>
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
