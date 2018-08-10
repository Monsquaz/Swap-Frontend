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
            <div v-if="gqlError" class="notification is-danger">
              {{ gqlError.message }}
            </div>
            <form>
              <div class="field">
                <label class="label">Username</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    class="input"
                    ref="username"
                    type="text"
                    tabindex="1"
                    v-model="username"
                    @keyup.enter="mutate()"
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
                    v-model="password"
                    @keyup.enter="mutate()"
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
                  <a class="button" @click="mutate()">
                    Login
                  </a>
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
    mounted: function() {
      this.$nextTick(() => this.$refs.username.focus());
    },
    methods: {
      onDone: function({ data: { loginUser: { authToken } }}) {
        localStorage.setItem('authToken', authToken);
        this.$router.push({ path: '/' }, () => { location.reload(); });
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
