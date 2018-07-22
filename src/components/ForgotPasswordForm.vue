<template>
  <div>
    <hero
      title="Forgot password"
      subtitle="Don't do it again" />
    <div class="columns is-centered">
      <section class="login-form content-box column is-one-quarter">
        <ApolloMutation
          :mutation="require('../graphql/forgotPassword.gql')"
          :variables="{ usernameOrEmail }"
          @done="onDone">
          <template slot-scope="{ mutate, loading, error, gqlError }">
            <form>
              <div class="field">
                <label class="label">Username or email</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    class="input"
                    type="text"
                    tabindex="1"
                    autocomplete="username"
                    placeholder="Username or email" />
                  <span class="icon is-small is-left">
                    <icon name="user" scale="1"></icon>
                  </span>
                </div>
              </div>
              <a class="button" @click="mutate()">Procceed</a>
              <p v-if="gqlError" class="error">{{ gqlError.message }}</p>
            </form>
          </template>
        </ApolloMutation>
      </section>
    </div>
  </div>
</template>

<script>
  import 'vue-awesome/icons/user';
  module.exports = {
    name: 'forgot-password-form',
    data: () => ({
      usernameOrEmail: '',
    }),
    methods: {
      onDone: (result) => {
        // TODO: Save auth token etc
        console.warn('RESULT', result);
      }
    },
    metaInfo: () => ({
      title: () => 'Forgot password',
      meta: [{
        name: 'description',
        content: 'Forgot password form.'
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .forgot-password-form {
    min-width: 400px;
  }
</style>
