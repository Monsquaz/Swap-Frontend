<template>
  <ApolloQuery
    class="roundsubmissions"
    :query="roundsubmissionsQuery"
    :variables="{
      filters: {
        id: $route.params.id
      }
    }"
    @result="onResult">
    <template slot-scope="{ query, result: { data, loading } }">
      <template v-if="data && !loading">
        <ApolloSubscribeToMore
          v-if="roundsubmission"
          :document="eventChangedSubscription"
          :variables="{ id: roundsubmission.event.id }"
          :updateQuery="onEventChanged(query)"
        />
        <hero
          :title="`Roundsubmission: ${others(roundsubmission)}`"
          :subtitle="`Part of ${roundsubmission.event.name}`"></hero>
        <div class="columns is-centered">
          <section class="content-box column is-two-thirds">
            <table class="table">
              <tr><th>Id</th><td>{{ roundsubmission.id }}</td></tr>
              <tr><th>Event</th>
                <td>
                  <router-link :to="`/events/${roundsubmission.event.slug}`">
                    {{ roundsubmission.event.name }}
                  </router-link>
                </td>
              </tr>
              <tr><th>Status</th><td>{{ roundsubmission.status }}</td></tr>
              <tr><tr><th>Song</th><td>{{ roundsubmission.song.index + 1 }}</td></tr>
              <tr><th>Round</th><td>{{ roundsubmission.round.index + 1 }}</td></tr>
              <tr><th>
                Participant
                <template
                  v-if="roundsubmission.participant.id !=
                        roundsubmission.originalParticipant.id">
                        (original)
                </template>
              </th><td>
                <router-link
                  :to="`/users/${roundsubmission.originalParticipant.slug}`">
                {{ roundsubmission.originalParticipant.username }}
              </router-link></td></tr>
              <tr
                v-if="roundsubmission.participant.id !=
                      roundsubmission.originalParticipant.id">
                <th>Fill in participant</th>
                <td>
                  <router-link
                    :to="`/users/${roundsubmission.participant.slug}`">
                  {{ roundsubmission.participant.username }}
                </router-link>
                </td>
              </tr>
              <tr v-if="roundsubmission.fileSeeded">
                  <th>Seeded file</th><td>
                    <a @click.prevent="downloadWithAuth(
                      `${apiUrl}${roundsubmission.fileSeeded.downloadUrl}`,
                      roundsubmission.fileSeeded.filename
                      )">
                      {{ roundsubmission.fileSeeded.filename }}
                    </a>
                </td>
              </tr>
              <tr v-if="roundsubmission.fileSubmitted">
                  <th>Submitted file</th><td>
                    <a @click.prevent="downloadWithAuth(
                      `${apiUrl}${roundsubmission.fileSubmitted.downloadUrl}`,
                      roundsubmission.fileSubmitted.filename
                      )">
                      {{ roundsubmission.fileSubmitted.filename }}
                    </a>
                </td>
              </tr>
            </table>
            <div v-if="roundsubmission.event.isAdministrator" class="columns">
              <div class="column is-full">
                <div class="section-title">Administration</div>
                <div class="roundsubmission-actions">
                  <ApolloMutation
                      v-if="['Planned','Started','FillInAquired','Refuted']
                      .includes(roundsubmission.status)"
                      :mutation="require('../graphql/skipRoundsubmission.gql')"
                      :variables="{
                        id: roundsubmission.id
                      }"
                      :refetchQueries="refetch"
                      @error="onError">
                    <template slot-scope="{ mutate, loading, error, gqlError }">
                      <a
                        class="button is-warning"
                        @click.prevent="skipRoundsubmission(roundsubmission, mutate)"
                        v-tooltip="'Mark current participant as skipping. Will attempt to find a fill in.'">
                        Skip participant
                      </a>
                    </template>
                  </ApolloMutation>
                  <ApolloMutation
                      v-if="roundsubmission.status == 'Submitted'"
                      :mutation="require('../graphql/refuteRoundsubmission.gql')"
                      :variables="{
                        id: roundsubmission.id,
                        userId: roundsubmission.participant.id
                      }"
                      :refetchQueries="refetch"
                      @error="onError">
                    <template slot-scope="{ mutate, loading, error, gqlError }">
                      <a
                        class="button is-danger"
                        @click.prevent="refuteSubmission(roundsubmission, mutate)"
                        v-tooltip="'For whatever reason, require that the participant resubmits'">
                        Refute submission
                      </a>
                    </template>
                  </ApolloMutation>
                </div>
              </div>
            </div>
            <div
              class="columns"
              v-if="roundsubmission.event.isPublic &&
                    ['Completed','Published'].includes(roundsubmission.event.status) ||
                    roundsubmission.event.isAdministrator ||
                    roundsubmission.event.isScheduleVisible">
              <div class="column is-half">
                <div class="section-title">
                  Other roundsubmissions for the same song
                </div>
                <paginator
                  :resource="'roundsubmissions'"
                  :query="roundsubmissionsQuery"
                  :show-headers="false"
                  :headers="[
                    { field: others, title: 'Id' },
                  ]"
                  :linker="linker"
                  :sort="'songId'"
                  :descending="false"
                  :filters="{
                    songId: roundsubmission.song.id,
                    NOT: { id: roundsubmission.id }
                  }" />
              </div>
              <div class="column is-half">
                <div class="section-title">
                  Other roundsubmissions during same round
                </div>
                <paginator
                  :resource="'roundsubmissions'"
                  :query="roundsubmissionsQuery"
                  :show-headers="false"
                  :headers="[
                    { field: others, title: 'Id' },
                  ]"
                  :linker="linker"
                  :sort="'roundId'"
                  :descending="false"
                  :filters="{
                    roundId: roundsubmission.round.id,
                    NOT: { id: roundsubmission.id }
                  }" />
              </div>
            </div>
            <div
              v-if="roundsubmission.event.status == 'Published' ||
                    roundsubmission.event.areChangesVisible"
              class="comments">
              <div class="section-title">Comments</div>
              <vue-disqus
                shortname="monsquaz-swap"
                :identifier="`roundsubmission-${roundsubmission.id}`"
                :url="currentUrl" />
            </div>
          </section>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  module.exports = {
    name: 'roundsubmission',
    props: {},
    data: () => ({
      roundsubmissionsQuery: require('../graphql/roundsubmissions.gql'),
      eventChangedSubscription: require('../graphql/eventChanged.gql'),
      roundsubmission: null,
      error: '',
      apiUrl: 'https://swap.monsquaz.org:4000'
    }),
    computed: {
      variables: () => {
        return {};
      }
    },
    methods: {
      onEventChanged: function(query) {
        return function(_, { subscriptionData }) {
          let { data } = subscriptionData;
          let { eventChanged } = data;
          let { message } = eventChanged;
          query.refetch();
          if ('Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('Monsquaz Swap', {
                tag: message.replace(/\s/g, '-').toLowerCase(),
                body: message,
                icon: '/images/favicon-96x96.png'
              } );
            }
          }
        };
      },
      downloadWithAuth: function(url, filename) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true);
        const authToken = localStorage.getItem('authToken');
        /*
        if (!authToken) {
          this.$swal({
            title: `Login required.`,
            html: `You need to login to download roundsubmission files`,
            type: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
          return;
        }*/
        if (authToken) {
          xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
          if (this.status === 200) {
            let blob = new Blob([this.response]);
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.download = filename;
            link.click();
            setTimeout(function() {
              URL.revokeObjectURL(link.href);
            }, 0);
          }
        }
        xhr.onerror = function(e) {
          console.warn('error', e);
        }
        xhr.send();
      },
      skipRoundsubmission: function(roundsubmission, mutate) {
        this.$swal({
          title: `You are about to skip this roundsubmission for ${roundsubmission.participant.username}.`,
          html: `You are about to skip round <b>${roundsubmission.round.index + 1}</b>
          of <b>${roundsubmission.event.name}</b> for <b>${roundsubmission.participant.username}</b><br />.
          This means that someone else will get to fill in for this user, or possibly,
          that no contribution will be made for this round.<br />
          Are you absolutely sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, unfortunately!'
        }).then((res) => {
          if (res.value) mutate();
        })
      },
      refuteSubmission: function(roundsubmission, mutate) {
        this.$swal({
          title: `You are about to refute this roundsubmission.`,
          html: `You are about to refute the submission for <b>${roundsubmission.participant.username}</b><br />.
          This means that he/she will have to submit again or skip the round.
          Are you absolutely sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((res) => {
          if (res.value) mutate();
        })
      },
      refetch: function() {
        return ['Roundsubmissions']
      },
      onError: function (err) {
        this.error = err;
      },
      others: function(roundsubmission) {
        return `Song ${roundsubmission.song.index + 1} Round ${roundsubmission.round.index + 1} (${roundsubmission.participant.username})`
      },
      linker: function(roundsubmission) {
        return `/roundsubmissions/${roundsubmission.id}`
      },
      onResult: function({ data }) {
        this.roundsubmission = data.roundsubmissions[0];
      }
    },
    metaInfo: () => ({
      title: () => 'Roundsubmission', // TODO: "RAMPKORV's submission on Round 4 of Monsquaz Swap 9"
      meta: [{
        name: 'description',
        content: 'Roundsubmission details' // TODO
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .section-title {
    font-weight: bold;
    border-bottom: 1px solid #c0c0c0;
  }
  .roundsubmission-actions {
    text-align: center;
    overflow: auto;
    text-align: center;
    >div {
      display: inline-block;
    }
    .button {
      margin-right: 5px;
      margin-top: 5px;
    }
  }
</style>
