<template>
  <ApolloQuery
    class="events"
    :query="require('../graphql/events.gql')"
    :variables="variables"
    @result="onResult">
    <template slot-scope="{ query, result: { data, loading } }">
      <template v-if="data && !loading">
        <div>
          <hero
            :title="`Event: ${data.events[0].name}`"
            :subtitle="`Hosted by ${data.events[0].host.username}`"></hero>
          <div class="columns is-mobile is-centered">
            <section class="content-box column is-three-quarters">
              <div class="columns">
                <div class="column is-half event-details">
                  <div class="card-title">Event details</div>
                  <table class="table">
                    <tr><th>Status</th><td>{{ data.events[0].status }}</td></tr>
                    <tr><th>Number of participants</th><td>{{ data.events[0].numParticipants }}</td></tr>
                    <tr v-if="data.events[0].numRounds">
                      <th>Number of rounds</th>
                      <td>{{ data.events[0].numRounds }}</td>
                    </tr>
                    <tr v-if="data.events[0].currentRound">
                      <th>Current round</th>
                      <td>{{ data.events[0].currentRound.index + 1 }}</td>
                    </tr>
                    <tr><th>Public event</th><td>{{ data.events[0].isPublic ? 'Yes': 'No' }}</td></tr>
                    <tr><th>Public schedule</th><td>{{ data.events[0].isScheduleVisible ? 'Yes': 'No' }}</td></tr>
                    <tr><th>Public changes</th><td>{{ data.events[0].areChangesVisible ? 'Yes': 'No' }}</td></tr>
                    <tr v-if="data.events[0].initialFile">
                      <th>Initial file</th>
                      <td>
                        <a @click.prevent="downloadWithAuth(
                          `${apiUrl}${data.events[0].initialFile.downloadUrl}`,
                          data.events[0].initialFile.filename)">
                          {{ data.events[0].initialFile.filename }}
                      </a></td>
                    </tr>
                  </table>
                </div>
                <div class="event-participants column is-half">
                  <div class="card-title">Participants</div>
                  <template v-if="data.events[0].numParticipants == 0">
                    None, yet
                  </template>
                  <template v-else>
                    <paginator
                    :resource="'users'"
                    :query="usersQuery"
                    :headers="[
                      {field: 'id', title: 'Id'},
                      {field: 'username', title: 'Username'},
                      {field: 'gravatar', title: 'Image', f: img}
                    ]"
                    :linker="linker"
                    :sort="'id'"
                    :descending="false"
                    :filters="{ id: data.events[0].participants.map( ({id}) => id ) }"
                    ></paginator>
                  </template>
                </div>
              </div>
                <div class="columns">
                  <div
                    :class="{
                      'event-current-roundsubmission': true,
                      'column': true,
                      'is-full': data.events[0].isParticipant &&
                                 !data.events[0].isAdministrator,
                      'is-half': data.events[0].isParticipant &&
                                 data.events[0].isAdministrator
                    }">
                    <div class="card-title">Participation</div>
                    <div v-if="data.events[0].isParticipant">
                      <template v-if="data.events[0].status == 'Planned'">
                        You're signed up as an ordinary participant.
                      </template>
                      <template v-else-if="data.events[0].status == 'Started'">
                        <table class="table">
                          <tr><th>Round</th><td>{{ data.events[0].currentRound.index + 1 }}</td></tr>
                          <tr><th>Status</th><td>{{ data.events[0].currentRoundsubmission.status }}</td></tr>
                        </table>
                        <div class="roundsubmission-actions">
                          <a class="button is-info"
                            v-if="data.events[0].currentRoundsubmission &&
                                  data.events[0].currentRoundsubmission.fileSeeded"
                            @click.prevent="downloadWithAuth(
                              `${apiUrl}${data.events[0].currentRoundsubmission.fileSeeded.downloadUrl}`,
                              data.events[0].currentRoundsubmission.fileSeeded.filename
                            )"
                            v-tooltip="'Download the file that has been assigned to you for this round'">
                              Download your file
                            </a>
                            <div
                              class="file button is-info"
                              v-if="currentUser &&
                              data.events[0].currentRoundsubmission.status == 'Started'"
                              v-tooltip="'Submit your file. Note: You may re-upload until the round has ended.'">
                              <label class="file-label" style="margin-top: -5px;">
                                <form enctype="multipart/form-data" novalidate>
                                  <input
                                    class="file-input"
                                    type="file"
                                    name="initial"
                                    @change="submitChanges(
                                      data.events[0].currentRoundsubmission.id,
                                      $event.target.name,
                                      $event.target.files,
                                      query
                                    )" />
                                </form>
                                <span class="file-cta" style="margin-top: -1px;">
                                  <span class="file-label">
                                    Submit your changes
                                  </span>
                                </span>
                              </label>
                            </div>
                            <ApolloMutation
                                v-if="currentUser &&
                                data.events[0].currentRoundsubmission.status == 'Started'"
                                :mutation="require('../graphql/skipRound.gql')"
                                :variables="{
                                  roundsubmissionId: data.events[0].currentRoundsubmission.id,
                                  userId: currentUser.id
                                }"
                                :refetchQueries="refetchOnJoin">
                              <template slot-scope="{ mutate, loading, error, gqlError }">
                                <a
                                  href="#"
                                  v-tooltip="'Mark the round as skipped so a fill-in participant can take your place for this round'"
                                  @click.prevent="skipRound(data.events[0], mutate)"
                                  class="button is-warning">Skip this round</a>
                              </template>
                            </ApolloMutation>
                        </div>
                      </template>
                      <template v-else-if="data.events[0].status == 'Complete'">
                        The event has ended. Thank you for taking part!
                      </template>
                    </div>
                    <div
                      class="participation-join"
                      v-else-if="['Planned','Started'].includes(data.events[0].status)">
                      <p v-if="data.events[0].status == 'Planned'">
                        Sign up as an ordinary participant.<br />You'll be assigned one file per round.
                      </p>
                      <p v-else>
                        Sign up as a fill in participant.<br />You may be assigned a file if an ordinary participant skips a round.
                      </p>
                      <ApolloMutation
                          v-if="currentUser"
                          :mutation="require('../graphql/joinEvent.gql')"
                          :variables="{ id: data.events[0].id }"
                          :refetchQueries="refetchOnJoin">
                        <template slot-scope="{ mutate, loading, error, gqlError }">
                          <a
                            href="#"
                            @click.prevent="joinEvent(data.events[0], mutate)"
                            class="join-button button is-primary">Join</a>
                        </template>
                      </ApolloMutation>
                    </div>
                  </div>
                  <div
                    v-if="data.events[0].isAdministrator && data.events[0].status != 'Completed'"
                    :class="{
                      'event-current-roundsubmission': true,
                      'column': true,
                      'is-full': !data.events[0].isParticipant &&
                                 data.events[0].isAdministrator,
                      'is-half': data.events[0].isParticipant &&
                                 data.events[0].isAdministrator
                    }">
                    <div class="card-title">Administration</div>
                    <div>
                      <table class="table" v-if="data.events[0].status == 'Started'">
                        <tr><th>Round</th><td>1</td></tr>
                        <tr>
                          <th>Status</th>
                          <td>
                            <template v-for="(quantity, status) in submissionStatuses(data.events[0])">
                              <router-link
                                :to="`/events/${data.events[0].id}/roundsubmissions?status=${status}`">
                                  {{ status }}
                                </router-link>
                                ({{ quantity }})
                            </template>
                          </td>
                        </tr>
                      </table>
                      <div class="roundsubmission-actions">
                        <a class="button is-primary"
                          v-if="data.events[0].status == 'Started'"
                          v-tooltip="'End this round and start the next one with files getting passed on.'">End round</a>
                        <a class="button is-warning"
                          v-if="data.events[0].status == 'Started'"
                          v-tooltip="'Mark all unsubmitted roundsubmissions as skips and assign fill-ins where possible.'">Request fill-ins</a>
                        <a class="button is-info"
                        v-if="['Planned','Started'].includes(data.events[0].status)"
                        v-tooltip="'Invite participants'">Invite</a>
                        <template v-if="data.events[0].status == 'Planned'">
                          <div
                            class="file button is-info"
                            v-tooltip="'This sets the file that the participants have to start with initially.'">
                            <label class="file-label" style="margin-top: -5px;">
                              <form enctype="multipart/form-data" novalidate>
                                <input
                                  class="file-input"
                                  type="file"
                                  name="initial"
                                  @change="changeInitial(
                                    data.events[0].id,
                                    $event.target.name,
                                    $event.target.files,
                                    query
                                  )" />
                              </form>
                              <span class="file-cta" style="margin-top: -1px;">
                                <span class="file-label">
                                  {{ data.events[0].initialFile ? 'Change' : 'Upload' }} initial file
                                </span>
                              </span>
                            </label>
                          </div>
                          <ApolloMutation
                              :mutation="require('../graphql/startEvent.gql')"
                              :variables="{ id: data.events[0].id }"
                              :refetchQueries="refetchOnJoin">
                            <template slot-scope="{ mutate, loading, error, gqlError }">
                                <a class="button is-primary"
                                @click.prevent="startEvent(data.events[0], mutate)"
                                v-if="data.events[0].status == 'Planned'"
                                v-tooltip="'This starts the event and generates the swap schedule. There\'s no turning back from when this is done.'">
                                  Start first round</a>
                            </template>
                          </ApolloMutation>
                        </template>
                      </div>
                    </div>
                  </div>
              </div>
              <div
                v-if="data.events[0].roundsubmissions.length > 0"
                class="event-schedule">
                <div class="card-title">Schedule</div>
                <swap-schedule :schedule="getSchedule(data.events[0])" :colorguide="true" />
              </div>
              <div class="event-description">
                <div class="card-title">Description</div>
                <div class="" v-html="formatText(data.events[0].description)" />
              </div>
            </section>
          </div>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import axios from 'axios';
  import config from '../../config';
  let uploader = function(urlFormatter, swalParams) {
    return function(urlParam, fieldName, fileList, query) {
      let self = this;
      const formData = new FormData();
      if (!fileList.length) return;
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name);
        });
      const authToken = localStorage.getItem('authToken');
      let url = urlFormatter(urlParam);
      console.warn('URL!', url);
      axios.post(
        url, formData, {
          headers: {
            authorization: authToken ? `Bearer ${authToken}` : ""
          }
        }
      ).then(function(){
        if (swalParams) self.$swal(...swalParams);
        if (query) query.refetch();
      });
    }
  };
  module.exports = {
    name: 'event-page',
    props: {},
    data: () => ({
      usersQuery: require('../graphql/users.gql'),
      apiUrl: 'http://monsquaz.org:4000'
    }),
    computed: {
      variables: function() {
        return {
          details: true,
          slug: this.$route.params.slug
        };
      }
    },
    apollo: {
      currentUser: {
        query: require('../graphql/currentUser.gql')
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
            link.download = filename;
            link.click()
          }
        }
        xhr.onerror = function(e) {
          console.warn('error', e);
        }
        xhr.send();
      },
      submitChanges: uploader(
        (param) => {
          return `http://monsquaz.org:4000/roundsubmissions/${param}/file`
        },
        [
          'Uploaded!',
          'You\'ve submitted a file for this round',
          'success'
        ]
      ),
      changeInitial: uploader(
        param => `http://monsquaz.org:4000/events/${param}/file`,
        [
          'Uploaded!',
          'Initial file was uploaded!',
          'success'
        ]
      ),
      img: function(d){
        return `<img src="${d}" />`;
      },
      linker: function() {
        return 'temp'
      },
      formatText: function(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
      },
      onResult: function(res) {
        // TODO: Possibly redirect
      },
      refetchOnJoin: function() {
        return ['Events'];
      },
      joinEvent: function(event, mutate) {
        this.$swal({
          title: 'You are about to join an event.',
          html: `You are about to join the event <b>${event.name}</b>.
          This means that you\'re expected to contribute on every file that you\'re assigned.
          Are you absolutely sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I\'m up for it!'
        }).then((res) => {
          if (res.value) mutate();
        })
      },
      skipRound: function(event, mutate) {
        this.$swal({
          title: 'You are about to skip your round.',
          html: `You are about to skip round <b>${event.currentRound.index + 1}</b> of <b>${event.name}</b><br />.
          This means that someone else will get to fill in for you, or possibly,
          that no contribution will be made for this round.<br />
          Are you absolutely sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, sorry!'
        }).then((res) => {console.warn('COCK', res);
          if (res.value) mutate();
        })
      },
      startEvent: function(event, mutate) {
        this.$swal({
          title: 'You are about to start the event.',
          html: `You are about to start the event <b>${event.name}</b>.
          This means that the swap schedule will be generated based on currently signed up participants,
          and the first round will immediately start.
          Are you absolutely sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I\'m up for it!'
        }).then((res) => {
          if (res.value) mutate();
        })
      },
      submissionStatuses: function(event) {
        if (!event.currentRound) return {};
        if (!('submissions' in event.currentRound)) return {};
        return event.currentRound.submissions.reduce((ack, rs) => {
          if (rs.status in ack) ack[rs.status]++;
          else ack[rs.status] = 1;
          return ack;
        }, {});
      },
      getSchedule: function(event) { // TODO: Make computed or watched so it doesn't fire 4 times
        let square = new Array(event.numRounds).fill(null).map(() => new Array(event.numRounds).fill({
          title: '?'
        }));
        let songs = {};
        let songIdx = 0;
        let t = event.roundsubmissions.reduce((ack, rs) => {
          if (!(rs.song.id in songs)) songs[rs.song.id] = songIdx++;
          ack[rs.round.index][songs[rs.song.id]] = {
            id: rs.id,
            class: rs.status.toLowerCase(),
            title: rs.participant.username
          };
          return ack;
        }, square);
        return t;
      }
    },
    metaInfo: () => ({
      title: () => 'Event', // TODO: Event:Monsquaz Swap 9
      meta: [{
        name: 'description',
        content: 'Event details' // TODO: Event description
      }]
    })
  };
</script>

<style lang="sass" scoped>
  .participation-join {
    text-align: center;
    padding: 15px;
  }
  .join-button {
    margin-top: 15px;
  }
  .card-title {
    font-weight: bold;
    border-bottom: 1px solid #c0c0c0;
  }
  .event-description {
    margin-top: 15px;
  }
  .roundsubmission-actions {
    text-align: center;
    overflow: auto;
    .file {
      display: block;
      float: left;
    }
    .button {margin-right: 5px;
      float: left;
      margin-top: 5px;
    }
  }
  .participant {
    padding: 5px;
    padding-bottom: 0px;
    overflow: auto;
    .participant-username {
      display: inline;
      float: left;
      margin-top: 10px;
      margin-right: 10px;
    }
  }
</style>
