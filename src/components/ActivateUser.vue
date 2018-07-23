<template>
  <div>
    <hero
      title="User activation"
      subtitle="Final registration step" />
    <div class="columns is-centered">
      <section class="login-form content-box column is-two-thirds">
        <div
          :class="{
            notification: true,
            'is-danger': !success,
            'is-success': success
          }"
          v-if="done">
          {{ message }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
let verifyUser = require('../graphql/verifyUser.gql');
module.exports = {
  name: 'activate-user',
  data: () => ({
    done: false,
    success: true,
    message: null
  }),
  mounted: function () {
    let self = this;
    let { id, code } = this.$route.params;
      this.$apollo.mutate({
        mutation: verifyUser,
        variables: { id, code },
      }).then(data => {
        self.done = true;
        self.success = true;
        self.message = 'User activated successfully';
      }).catch(({ message }) => {
        self.done = true;
        self.success = false;
        self.message = message;
      })
  },
  metaInfo: () => ({
    title: () => 'User activation',
    meta: [{
      name: 'description',
      content: 'User activation.'
    }]
  })
};
</script>

<style lang="sass" scoped>
</style>
