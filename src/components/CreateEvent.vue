<template>
  <div>
    <hero
      title="Create event"
      subtitle="Make it good"></hero>
    <div class="columns is-mobile is-centered">
      <section class="content-box column is-two-thirds">
        <div v-if="!currentUser">Login required</div>
        <ApolloMutation
            v-if="currentUser"
            :mutation="require('../graphql/createEvent.gql')"
            :variables="{
              name, description, areChangesVisible, isScheduleVisible, isPublic, captchaResponse
            }"
            :refetchQueries="onRefetch"
            @done="onDone">
            <template slot-scope="{ mutate, loading, error, gqlError }">
              <form
                @submit.prevent="validateBeforeSubmit"
                v-bind:class="{ disabled: loading }">
                <div class="field">
                  <label class="label">Name</label>
                  <div class="control">
                    <input
                      :class="{
                        'input': true,
                        'is-danger': errors.has('name')
                      }"
                      type="text"
                      name="name"
                      v-model="name"
                      v-validate="'required'"
                      tabindex="1"
                      placeholder="Name of the event" />
                    <span v-show="errors.has('name')" class="help is-danger">
                      {{ errors.first('name') }}
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Description</label>
                  <div class="control">
                    <textarea
                      :class="{
                        'description': true,
                        'input': true,
                        'is-danger': errors.has('description')
                      }"
                      type="text"
                      name="description"
                      v-model="description"
                      v-validate="'required'"
                      tabindex="1"
                      placeholder="Description of the event" /></textarea>
                    <span v-show="errors.has('description')" class="help is-danger">
                      {{ errors.first('description') }}
                    </span>
                  </div>
                </div>
                <div class="columns checkbox-fields">
                  <div class="column is-one-third">
                    <div class="field">
                      <label class="label">Should the event be public?</label>
                      <div class="control has-icons-left has-icons-right">
                        <input
                          :class="{
                            'is-danger': errors.has('isPublic')
                          }"
                          type="checkbox"
                          name="isPublic"
                          v-model="isPublic"
                          v-validate="'required'"
                          tabindex="1" />
                        <span v-show="errors.has('isPublic')" class="help is-danger">
                          {{ errors.first('isPublic') }}
                        </span>
                      </div>
                    </div>
                    <p>If checked, the event will appear in the list of events for everyone. Anyone is able to join the event.</p>
                  </div>
                  <div class="column is-one-third">
                    <div class="field">
                      <label class="label">Should the schedule be visible during the event?</label>
                      <div class="control has-icons-left has-icons-right">
                        <input
                          :class="{
                            'is-danger': errors.has('isScheduleVisible')
                          }"
                          type="checkbox"
                          name="isScheduleVisible"
                          v-model="isScheduleVisible"
                          v-validate="'required'"
                          tabindex="1" />
                        <span v-show="errors.has('isScheduleVisible')" class="help is-danger">
                          {{ errors.first('isScheduleVisible') }}
                        </span>
                      </div>
                    </div>
                    <p>If checked, the swapping schedule will be public during the event.
                    <br /><br /><b>Note</b>: swapping schedule would otherwise be revealed once the event is completed.</p>
                  </div>
                  <div class="column is-one-third">
                    <div class="field">
                      <label class="label">Should changes be visible during the event?</label>
                      <div class="control has-icons-left has-icons-right">
                        <input
                          :class="{
                            'is-danger': errors.has('areChangesVisible')
                          }"
                          type="checkbox"
                          name="areChangesVisible"
                          v-model="areChangesVisible"
                          v-validate="'required'"
                          tabindex="1" />
                        <span v-show="errors.has('areChangesVisible')" class="help is-danger">
                          {{ errors.first('areChangesVisible') }}
                        </span>
                      </div>
                      <p>If checked, will make it possible for others to fully see all submitted roundsubmissions while the event is progressing.</p>
                    </div>
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
                 <a class="button" @click="mutate()">
                   <b>Create event</b>
                 </a>
                 <p v-if="gqlError" class="error">{{ gqlError.message }}</p>
              </form>
            </template>
        </ApolloMutation>
      </section>
    </div>
  </div>
</template>

<script>
  import { reCaptcha } from '../../config';
  const { siteKey } = reCaptcha;
  import VueRecaptcha from 'vue-recaptcha';
  module.exports = {
    name: 'create-event',
    props: {},
    data: () => ({
      siteKey,
      name: '',
      description: '',
      areChangesVisible: false,
      isScheduleVisible: false,
      isPublic: true,
      captchaResponse: ''
    }),
    components: { VueRecaptcha },
    methods: {
      onDone: function(res) {
        console.warn('RES', res);
      },
      onRecaptchaVerify: function(res) {
        this.captchaResponse = res;
      },
      onRefetch: function() {
        return ['Events']
      }
    },
    metaInfo: () => ({
      title: () => 'Create event',
      meta: [{
        name: 'description',
        content: 'Create event'
      }]
    }),
    apollo: {
      currentUser: {
        query: require('../graphql/currentUser.gql')
      }
    }
  };
</script>

<style lang="sass" scoped>
  .description {
    height: 200px;
    resize: vertical;
  }
    .checkbox-fields {
      margin-top: 15px;
      >div:not(:first-child) {
        border-left: 1px solid #c0c0c0;
      }
    }
</style>
