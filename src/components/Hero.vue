 <template>
  <div class="columns is-centered">
    <section class="hero content-box column is-three-quarters">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{ title }}</h1>
          <h2 class="subtitle">{{ subtitle }}</h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  module.exports = {
    name: 'hero',
    props: ["title", "subtitle"],
    data: () => ({}),
    apollo: {}
  };
</script>

<style lang="sass" scoped>
  .container {
    width: 100%;
  }
</style>
