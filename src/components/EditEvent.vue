<template>
  <div>
    <hero
      title="Edit event"
      subtitle="Make it better"></hero>
    <div class="columns is-centered">
      <section class="content-box column is-three-quarters">
        <div class="notification is-info" v-if="message">
          {{ message }}
        </div>
        <div class="notification is-danger" v-if="error">
          {{ error }}
        </div>
        <div v-if="!currentUser">Login required</div>
        <ApolloQuery
          class="events"
          v-if="currentUser"
          :query="eventsQuery"
          :variables="{
            filters: {
              slug: $route.params.slug
            }
          }"
          @result="onResult"
          @error="onError">
          <template slot-scope="{ query, result: { data, loading } }">
            <template v-if="data && !loading">
              <ApolloMutation
                  :mutation="require('../graphql/updateEvent.gql')"
                  :variables="{
                    id, name, description, areChangesVisible, isScheduleVisible, isPublic
                  }"
                  :refetchQueries="onRefetch"
                  @done="onDone">
                  <template slot-scope="{ mutate, loading, error, gqlError }">
                    <form
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
                                tabindex="1" />
                              <span v-show="errors.has('areChangesVisible')" class="help is-danger">
                                {{ errors.first('areChangesVisible') }}
                              </span>
                            </div>
                            <p>If checked, will make it possible for others to fully see all submitted roundsubmissions while the event is progressing.</p>
                          </div>
                        </div>
                      </div>
                       <a class="button" @click="saveEvent(mutate, query)">
                         <b>Save changes</b>
                       </a>
                       <p v-if="gqlError" class="error">{{ gqlError.message }}</p>
                    </form>
                  </template>
              </ApolloMutation>
            </template>
          </template>
        </ApolloQuery>
      </section>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'edit-event',
    props: {},
    data: function() {
      return {
        eventsQuery: require('../graphql/events.gql'),
        event: null,
        error: null,
        id: null,
        slug: this.$route.params.slug,
        name: '',
        description: '',
        areChangesVisible: false,
        isScheduleVisible: false,
        isPublic: true,
        message: null
      };
    },
    methods: {
      saveEvent: function(mutate, query) {
        mutate().then(() => {
          query.refetch();
        });
      },
      onResult: function({ data }) {
        this.event = data.events[0];
        let self = this;
        ['id', 'slug','name','description','areChangesVisible','isScheduleVisible','isPublic']
        .forEach(f => { self[f] = self.event[f]; });
      },
      onError: function (err) {
        this.error = err;
      },
      onDone: function({ data }) {
        console.warn(data);
        this.message = data.updateEvent.message;
        let self = this;
        setTimeout(() => {
          location.href = '/events';
        }, 2000);
      },
      onRefetch: function() {
        return ['Events']
      }
    },
    metaInfo: () => ({
      title: () => 'Edit event',
      meta: [{
        name: 'description',
        content: 'Edit event'
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
