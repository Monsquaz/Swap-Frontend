<template>
  <div>
    <hero
      title="Login"
      subtitle="So you can do anything" />
    <div class="columns is-centered">
      <section class="login-form content-box column is-one-quarter">
        <ApolloMutation
          :mutation="require('../graphql/loginUser.gql')"
          :variables="{ username, password }"
          @done="onDone">
          <template slot-scope="{ mutate, loading, error, gqlError }">
            <form>
              <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    class="input"
                    type="text"
                    tabindex="1"
                    v-bind:value="username"
                    autocomplete="username"
                    placeholder="Username" />
                  <span class="icon is-small is-left">
                    <icon name="user" scale="1"></icon>
                  </span>
                </div>
              </div>
              <div class="field">
                <div class="forgot-password">
                  (<router-link to="/forgot-password">Forgot password?</router-link>)
                </div>
                <label class="label">Password</label>
                <p class="control has-icons-left">
                  <input
                    class="input"
                    type="password"
                    v-bind:value="password"
                    autocomplete="current-password"
                    tabindex="2"
                    placeholder="Password" />
                  <span class="icon is-small is-left">
                    <icon name="lock" scale="1"></icon>
                  </span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <button class="button">
                    Login
                  </button>
                </p>
              </div>
            </form>
          </template>
        </ApolloMutation>
      </section>
    </div>
  </div>
</template>

<script>
  import 'vue-awesome/icons/user';
  import 'vue-awesome/icons/lock';
  module.exports = {
    name: 'login-form',
    data: () => ({
      username: '',
      password: ''
    }),
    methods: {
      onDone: (result) => {
        // TODO: Save auth token etc
        console.warn('RESULT', result);
      }
    },
    metaInfo: () => ({
      title: () => 'Login',
      meta: [{
        name: 'description',
        content: 'User login form.'
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .login-form {
    min-width: 400px;
  }
  .forgot-password {
    float: right;
    margin-top: 5px;
  }
</style>
