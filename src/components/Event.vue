<template>
  <div>Event</div>
</template>

<script>
  module.exports = {
    name: 'event',
    data: () => ({}),
    metaInfo: () => ({
      title: () => 'Event', // TODO: event.name!
      meta: [{
        name: 'description',
        content: 'Event info.' // TODO: event.description
      }]
    })
  };
</script>

<style lang="sass" scoped>
</style>
