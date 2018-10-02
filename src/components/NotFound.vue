<template>
  <div>
    <hero
      title="Not found"
      subtitle=":-("></hero>
    <div class="columns is-centered">
      <section class="content-box column is-three-quarters">
        <p><strong>Total bummer.</strong></p>
        <p>If we've linked you here incorrectly, then you should report this to info@monsquaz.org so we can fix it</p>
        <p>If you spelled the URL wrong, then you should spell it correctly.</p>
      </section>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'not-found',
    data: () => ({}),
    metaInfo: {
      title: 'Not found',
      meta: [{
        name: 'description',
        content: 'Total bummer.'
      }]
    }
  };
</script>

<style lang="sass" scoped>
  .hero {
    margin-top: 40px;
  }
</style>
