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
        <hero
          :title="`Roundsubmission: ${others(data.roundsubmissions[0])}`"
          :subtitle="`Part of ${data.roundsubmissions[0].event.name}`"></hero>
        <div class="columns is-centered">
          <section class="content-box column is-two-thirds">
            <table class="table">
              <tr><th>Id</th><td>{{ data.roundsubmissions[0].id }}</td></tr>
              <tr><th>Event</th>
                <td>
                  <router-link :to="`/events/${data.roundsubmissions[0].event.slug}`">
                    {{ data.roundsubmissions[0].event.name }}
                  </router-link>
                </td>
              </tr>
              <tr><th>Status</th><td>{{ data.roundsubmissions[0].status }}</td></tr>
              <tr><tr><th>Song</th><td>{{ data.roundsubmissions[0].song.index + 1 }}</td></tr>
              <tr><th>Round</th><td>{{ data.roundsubmissions[0].round.index + 1 }}</td></tr>
              <tr><th>
                Participant
                <template
                  v-if="data.roundsubmissions[0].participant.id !=
                        data.roundsubmissions[0].originalParticipant.id">
                        (original)
                </template>
              </th><td>
                <router-link
                  :to="`/users/${data.roundsubmissions[0].originalParticipant.slug}`">
                {{ data.roundsubmissions[0].originalParticipant.username }}
              </router-link></td></tr>
              <tr
                v-if="data.roundsubmissions[0].participant.id !=
                      data.roundsubmissions[0].originalParticipant.id">
                <th>Fill in participant</th>
                <td>{{ data.roundsubmissions[0].participant.username }}</td>
              </tr>
              <tr v-if="data.roundsubmissions[0].fileSeeded">
                  <th>Seeded file</th><td>
                    <a @click.prevent="downloadWithAuth(
                      `${apiUrl}${data.roundsubmissions[0].fileSeeded.downloadUrl}`,
                      data.roundsubmissions[0].fileSeeded.filename
                      )">
                      {{ data.roundsubmissions[0].fileSeeded.filename }}
                    </a>
                </td>
              </tr>
              <tr v-if="data.roundsubmissions[0].fileSubmitted">
                  <th>Submitted file</th><td>
                    <a @click.prevent="downloadWithAuth(
                      `${apiUrl}${data.roundsubmissions[0].fileSubmitted.downloadUrl}`,
                      data.roundsubmissions[0].fileSubmitted.filename
                      )">
                      {{ data.roundsubmissions[0].fileSubmitted.filename }}
                    </a>
                </td>
              </tr>
            </table>
            <div v-if="data.roundsubmissions[0].event.isAdministrator" class="columns">
              <div class="column is-full">
                <div class="section-title">Administration</div>
                <div class="roundsubmission-actions">
                  <ApolloMutation
                      v-if="['Planned','Started','FillInAquired','Refuted']
                      .includes(data.roundsubmissions[0].status)"
                      :mutation="require('../graphql/skipRound.gql')"
                      :variables="{
                        roundsubmissionId: data.roundsubmissions[0].id,
                        userId: data.roundsubmissions[0].participant.id
                      }"
                      :refetchQueries="refetch"
                      @error="onError">
                    <template slot-scope="{ mutate, loading, error, gqlError }">
                      <a
                        class="button is-warning"
                        @click.prevent="skipRound(data.roundsubmissions[0], mutate)"
                        v-tooltip="'Mark current participant as skipping. Will attempt to find a fill in.'">
                        Skip participant
                      </a>
                    </template>
                  </ApolloMutation>
                  <ApolloMutation
                      v-if="data.roundsubmissions[0].status == 'Submitted'"
                      :mutation="require('../graphql/refuteRoundsubmission.gql')"
                      :variables="{
                        id: data.roundsubmissions[0].id,
                        userId: data.roundsubmissions[0].participant.id
                      }"
                      :refetchQueries="refetch"
                      @error="onError">
                    <template slot-scope="{ mutate, loading, error, gqlError }">
                      <a
                        class="button is-danger"
                        @click.prevent="refuteSubmission(data.roundsubmissions[0], mutate)"
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
              v-if="data.roundsubmissions[0].event.isPublic &&
                    data.roundsubmissions[0].event.status == 'Completed' ||
                    data.roundsubmissions[0].event.isAdministrator ||
                    data.roundsubmissions[0].event.isScheduleVisible">
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
                    songId: data.roundsubmissions[0].song.id,
                    NOT: { id: data.roundsubmissions[0].id }
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
                    roundId: data.roundsubmissions[0].round.id,
                    NOT: { id: data.roundsubmissions[0].id }
                  }" />
              </div>
            </div>
            <div
              v-if="data.roundsubmissions[0].event.status == 'Completed' ||
                    data.roundsubmissions[0].event.areChangesVisible"
              class="comments">
              <div class="section-title">Comments</div>
              <vue-disqus
                shortname="monsquaz-swap"
                :identifier="`roundsubmission-${data.roundsubmissions[0].id}`"
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
      roundsubmission: null,
      error: '',
      apiUrl: 'http://monsquaz.org:4000'
    }),
    computed: {
      variables: () => {
        return {};
      }
    },
    methods: {
      downloadWithAuth: function(url, filename) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true);
        const authToken = localStorage.getItem('authToken');
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
          }
        }
        xhr.onerror = function(e) {
          console.warn('error', e);
        }
        xhr.send();
      },
      skipRound: function(roundsubmission, mutate) {
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
