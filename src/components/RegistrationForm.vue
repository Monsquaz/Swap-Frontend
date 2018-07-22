<template>
  <div>
    <hero
      title="User registration"
      subtitle="So you can actually use the service" />
      <div class="columns is-mobile is-centered">
        <section class="content-box column is-two-thirds">
          <div v-if="wasRegistered">
            <h3>User registered successfully</h3>
            <p>You will receive an email shortly with a confirmation link</p>
          </div>
          <ApolloMutation
            v-if="!wasRegistered"
            :mutation="require('../graphql/registerUser.gql')"
            :variables="{
              email, username, password, firstname, lastname, captchaResponse
            }"
            @done="onDone">
            <template slot-scope="{ mutate, loading, error, gqlError }">
              <form
                @submit.prevent="validateBeforeSubmit"
                v-bind:class="{ disabled: loading }">
                <div class="field">
                  <label class="label">Email</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      :class="{
                        'input': true,
                        'is-danger': errors.has('email')
                      }"
                      type="text"
                      name="email"
                      v-model="email"
                      v-validate="'required|email'"
                      tabindex="1"
                      autocomplete="email"
                      placeholder="Email" />
                    <span class="icon is-small is-left">
                      <icon name="envelope" scale="1"></icon>
                    </span>
                    <span v-show="errors.has('email')" class="help is-danger">
                      {{ errors.first('email') }}
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Username</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      :class="{
                        'input': true,
                        'is-danger': errors.has('username')
                      }"
                      type="text"
                      name="username"
                      v-model="username"
                      v-validate="{ alpha: true, min: 3 }"
                      tabindex="2"
                      autocomplete="username"
                      placeholder="Username" />
                    <span class="icon is-small is-left">
                      <icon name="user" scale="1"></icon>
                    </span>
                    <span v-show="errors.has('username')" class="help is-danger">
                      {{ errors.first('username') }}
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <p class="control has-icons-left">
                    <input
                      :class="{
                        'input': true,
                        'is-danger': errors.has('password')
                      }"
                      name="password"
                      type="password"
                      v-model="password"
                      v-validate="'required|confirmed:password-verify'"
                      autocomplete="new-password"
                      tabindex="3"
                      placeholder="Password" />
                    <span class="icon is-small is-left">
                      <icon name="lock" scale="1"></icon>
                    </span>
                    <span v-show="errors.has('password')" class="help is-danger">
                      {{ errors.first('password') }}
                    </span>
                  </p>
                </div>
                <div class="field">
                  <label class="label">Password again</label>
                  <p class="control has-icons-left">
                    <input
                      :class="{
                        'input': true
                      }"
                      name="password-verify"
                      ref="password-verify"
                      v-validate="'required'"
                      type="password"
                      autocomplete="new-password"
                      tabindex="4"
                      placeholder="Password confirmation" />
                    <span class="icon is-small is-left">
                      <icon name="lock" scale="1"></icon>
                    </span>
                  </p>
                </div>
                <div class="field">
                  <label class="label">Firstname</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      :class="{
                        'input': true,
                        'is-danger': errors.has('firstname')
                      }"
                      name="firstname"
                      type="text"
                      tabindex="5"
                      v-model="firstname"
                      autocomplete="given-name"
                      placeholder="Firstname" />
                    <span class="icon is-small is-left">
                      <icon name="user" scale="1"></icon>
                    </span>
                    <span v-show="errors.has('firstname')" class="help is-danger">
                      {{ errors.first('firstname') }}
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Lastname</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      :class="{
                        'input': true,
                        'is-danger': errors.has('lastname')
                      }"
                      name="lastname"
                      type="text"
                      tabindex="6"
                      v-model="lastname"
                      autocomplete="family-name"
                      placeholder="Lastname" />
                    <span class="icon is-small is-left">
                      <icon name="user" scale="1"></icon>
                    </span>
                    <span v-show="errors.has('lastname')" class="help is-danger">
                      {{ errors.first('lastname') }}
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Anti-spam</label>
                  <div class="control has-icons-left has-icons-right">
                    <vue-recaptcha
                      @verify="onRecaptchaVerify"
                      v-bind:sitekey="siteKey" />
                  </div>
                </div>
               <a class="button" @click="mutate()">Register</a>
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
  import 'vue-awesome/icons/envelope';
  import 'vue-awesome/icons/lock';
  import { reCaptcha } from '../../config';
  const { siteKey } = reCaptcha;
  import VueRecaptcha from 'vue-recaptcha';
  module.exports = {
    name: 'registration-form',
    data: () => ({
      siteKey,
      email: '',
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      captchaResponse: '',
      wasRegistered: false
    }),
    methods: {
      onRecaptchaVerify: function(res) {
        this.captchaResponse = res;
      },
      onDone: function(result) {
        this.wasRegistered = true;
      }
    },
    components: { VueRecaptcha },
    metaInfo: () => ({
      title: () => 'Registration',
      meta: [{
        name: 'description',
        content: 'User registration form.'
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .error {
    color: #ff0000;
  }
  .disabled {
    opacity: 0.8;
    pointer-events: none;
  }
</style>
