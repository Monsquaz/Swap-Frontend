<template>
  <div>
    <hero
      title="Forgot password"
      subtitle="Don't do it again" />
    <div class="columns is-centered">
      <section class="login-form content-box column is-one-quarter">
        <div class="notification is-danger" v-if="error">{{ error }}</div>
        <div class="notification is-info" v-if="message">{{ message }}</div>
        <template v-if="$route.query.code">
          <ApolloQuery
            class="users"
            :query="usersQuery"
            :variables="{
              filters: {
                passwordResetCode: $route.query.code
              }
            }"
            @result="onResult"
            @error="onError">
            <template slot-scope="{ query, result: { data, loading } }">
              <template v-if="data && !loading">
                <ApolloMutation
                  v-if="!complete"
                  :mutation="require('../graphql/updateUserPassword.gql')"
                  @done="userPasswordUpdated">
                  <template slot-scope="{ mutate, loading, error, gqlError }">
                    <div v-if="gqlError" class="notification is-danger">
                      {{ gqlError.message }}
                    </div>
                    <form>
                      <div class="field">
                        <label class="label">New password</label>
                        <div class="control has-icons-left has-icons-right">
                          <input
                            class="input"
                            type="password"
                            tabindex="1"
                            v-model="password"
                            @keyup.enter="setPassword(mutate)"
                            autocomplete="password_new"
                            placeholder="New password" />
                          <span class="icon is-small is-left">
                            <icon name="user" scale="1"></icon>
                          </span>
                        </div>
                      </div>
                      <div class="field">
                        <p class="control">
                          <a class="button" @click="setPassword(mutate)">
                            Set password
                          </a>
                        </p>
                      </div>
                    </form>
                  </template>
                </ApolloMutation>
              </template>
            </template>
          </ApolloQuery>
        </template>
        <template v-else>
          <ApolloMutation
            :mutation="requestPasswordResetMutation"
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
                      v-model="usernameOrEmail"
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
        </template>
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
      usersQuery: require('../graphql/users.gql'),
      requestPasswordResetMutation: require('../graphql/requestPasswordReset.gql'),
      user: null,
      error: null,
      message: null,
      password: '',
      complete: false
    }),
    computed: {
      variables: function() {
        return {
          code: this.$route.query.code,
          userId: this.user.id,
          password: this.password
        }
      }
    },
    methods: {
      setPassword: function(mutate) {
        let self = this;
        mutate({
          variables: this.variables
        })
      },
      onError: function(err) {
        this.error = err.message;
        this.message = null;
      },
      onDone: function ({ data })  {
        this.error = null;
        this.message = data[Object.keys(data)[0]].message;
      },
      userPasswordUpdated: function(res) {
        let self = this;
        self.onDone(res);
        self.complete = true;
        setTimeout(() => {
          self.$router.push({ path: '/' });
        }, 3000);
      },
      onResult: function ({ data }) {
        console.warn('data', data);
        switch (data.users.length) {
          default:
          case 0:
            this.message = null;
            this.error = 'Incorrect password reset code';
            break;
          case 1:
            this.user = data.users[0];
            break;
        }

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
