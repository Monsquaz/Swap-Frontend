<template>
  <ApolloQuery
    class="events"
    :query="eventsQuery"
    :variables="variables"
    @result="onResult"
    @error="onError">
    <template slot-scope="{ query, result: { data, loading } }">
      <template v-if="data && !loading">
        <div>
          <hero
            :title="`Event: ${event.name}`"
            :subtitle="`Hosted by ${event.host.username}`"></hero>
          <div class="columns is-centered">
            <section :class="{
              'content-box': true,
              'column': true,
              'is-two-thirds': !expanded,
              'is-full': expanded
              }">
              <div
                :class="{
                  expander: true,
                  active: expanded
                }"
                @click="sizeToggle">
                <icon :name="expanded ? 'compress' : 'expand'" scale="1"></icon>
              </div>
              <div class="notification is-danger" v-if="error">
                {{ error.message }}
              </div>
              <div class="columns">
                <div class="column is-half event-details">
                  <div class="card-title">Event details</div>
                  <table class="table">
                    <tr><th>Status</th><td>{{ event.status }}</td></tr>
                    <tr><th>Number of participants</th><td>{{ event.numParticipants }}</td></tr>
                    <tr v-if="event.numRounds">
                      <th>Number of rounds</th>
                      <td>{{ event.numRounds }}</td>
                    </tr>
                    <tr v-if="event.currentRound">
                      <th>Current round</th>
                      <td>{{ event.currentRound.index + 1 }}</td>
                    </tr>
                    <tr><th>Public event</th><td>{{ event.isPublic ? 'Yes': 'No' }}</td></tr>
                    <tr><th>Public schedule</th><td>{{ event.isScheduleVisible ? 'Yes': 'No' }}</td></tr>
                    <tr><th>Public changes</th><td>{{ event.areChangesVisible ? 'Yes': 'No' }}</td></tr>
                    <tr v-if="event.initialFile">
                      <th>Initial file</th>
                      <td>
                        <a @click.prevent="downloadWithAuth(
                          `${apiUrl}${event.initialFile.downloadUrl}`,
                          event.initialFile.filename)">
                          {{ event.initialFile.filename }}
                      </a></td>
                    </tr>
                  </table>
                </div>
                <div class="event-participants column is-half">
                  <div class="card-title">Participants</div>
                  <template v-if="event.numParticipants == 0">
                    None, yet
                  </template>
                  <template v-else>
                    <paginator
                    :resource="'users'"
                    :query="usersQuery"
                    :show-headers="false"
                    :headers="[
                      {field: 'username', title: 'Username'}
                    ]"
                    :linker="userLinker"
                    :sort="'id'"
                    :descending="false"
                    :filters="{ id: event.participants.map( ({id}) => id ) }"
                    ></paginator>
                  </template>
                </div>
              </div>
                <div class="columns">
                  <div
                    v-if="event.status != 'Completed'"
                    :class="{
                      'event-current-roundsubmission': true,
                      'column': true,
                      'is-full': !event.isAdministrator,
                      'is-half': event.isAdministrator
                    }">
                    <div class="card-title">Participation</div>
                    <div v-if="!event.currentRoundsubmission && event.isParticipant">
                      Not currently in a round
                    </div>
                    <div v-if="event.currentRoundsubmission && event.isParticipant">
                      <template v-if="event.status == 'Planned'">
                        You're signed up as an ordinary participant.
                      </template>
                      <template v-else-if="event.status == 'Started'">
                        <table class="table">
                          <tr v-if="event.currentRound">
                            <th>Round</th><td>{{ event.currentRound.index + 1 }}</td>
                          </tr>
                          <tr><th>Status</th><td>{{ event.currentRoundsubmission.status }}</td></tr>
                          <tr
                            v-if="event.currentRoundsubmission.fileSubmitted">
                            <th>Submitted file</th>
                            <td>
                              <a @click.prevent="downloadWithAuth(
                                `${apiUrl}${event.currentRoundsubmission.fileSubmitted.downloadUrl}`,
                                event.currentRoundsubmission.fileSubmitted.filename)">
                                {{ event.currentRoundsubmission.fileSubmitted.filename }}
                            </a></td>
                          </tr>
                        </table>
                        <div class="roundsubmission-actions">
                          <a class="button is-info"
                            v-if="event.currentRoundsubmission &&
                                  event.currentRoundsubmission.fileSeeded"
                            @click.prevent="downloadWithAuth(
                              `${apiUrl}${event.currentRoundsubmission.fileSeeded.downloadUrl}`,
                              event.currentRoundsubmission.fileSeeded.filename
                            )"
                            v-tooltip="'Download the file that has been assigned to you for this round'">
                              <span class="icon">
                                <icon :name="'download'" scale="1"></icon>
                              </span>
                              Download your file
                            </a>
                            <div
                              class="file button is-primary"
                              v-if="
                                currentUser &&
                                ['Started','Submitted','FillInAquired','Refuted']
                                .includes(event.currentRoundsubmission.status)"
                              v-tooltip="'Submit your file. Note: You may re-upload until the round has ended.'">
                              <label class="file-label" style="margin-top: -5px;">
                                <form enctype="multipart/form-data" novalidate>
                                  <input
                                    class="file-input"
                                    type="file"
                                    name="initial"
                                    @change="submitChanges(
                                      event.currentRoundsubmission.id,
                                      $event.target.name,
                                      $event.target.files,
                                      query
                                    )" />
                                </form>
                                <span class="file-cta" style="margin-top: -1px;">
                                  <span class="file-label">
                                    <span class="icon">
                                      <icon :name="'paper-plane'" scale="1"></icon>
                                    </span>
                                    {{ event.currentRoundsubmission.status == 'Submitted' ?
                                    'Resubmit' : 'Submit' }} your changes
                                  </span>
                                </span>
                              </label>
                            </div>
                            <ApolloMutation
                                v-if="currentUser &&
                                ['Started','FillInAquired','Refuted']
                                .includes(event.currentRoundsubmission.status)"
                                :mutation="skipRoundsubmissionMutation"
                                :variables="{
                                  id: event.currentRoundsubmission.id,
                                }"
                                :refetchQueries="refetchOnJoin"
                                @error="onError">
                              <template slot-scope="{ mutate, loading, error, gqlError }">
                                <a
                                  href="#"
                                  v-tooltip="'Mark the round as skipped so a fill-in participant can take your place for this round'"
                                  @click.prevent="skipRoundsubmission(event, mutate)"
                                  class="button is-warning">
                                  <span class="icon">
                                    <icon :name="'fast-forward'" scale="1"></icon>
                                  </span>
                                  Skip this round
                                </a>
                              </template>
                            </ApolloMutation>
                            <a
                              v-if="currentUser &&
                              ['Started','FillInAquired','Refuted']
                              .includes(event.currentRoundsubmission.status)"
                              href="#"
                              v-tooltip="'Mark all remaining rounds as skipped so a fill-in participant can take your place for the rest of the event'"
                              @click.prevent="skipRemaining(event, query)"
                              class="button is-danger">
                              <span class="icon">
                                <icon :name="'frown'" scale="1"></icon>
                              </span>
                              Skip remaining rounds
                            </a>
                        </div>
                      </template>
                      <template v-else-if="event.status == 'Complete'">
                        The event has ended. Thank you for taking part!
                      </template>
                    </div>
                    <div class="participation-join"
                      v-if="!event.isParticipant &&
                      ['Planned','Started'].includes(event.status)">
                      <template v-if="currentUser">
                        <p v-if="event.status == 'Planned'">
                          Sign up as an ordinary participant.<br />You'll be assigned one file per round.
                        </p>
                        <p v-else>
                          Sign up as a fill in participant.<br />You may be assigned a file if an ordinary participant skips a round.
                        </p>
                        <ApolloMutation
                            v-if="currentUser"
                            :mutation="require('../graphql/joinEvent.gql')"
                            :variables="{ id: event.id }"
                            :refetchQueries="refetchOnJoin"
                            @error="onError">
                          <template slot-scope="{ mutate, loading, error, gqlError }">
                            <a
                              href="#"
                              @click.prevent="joinEvent(event, mutate)"
                              class="join-button button is-primary">Join</a>
                          </template>
                        </ApolloMutation>
                      </template>
                      <template v-else>
                        Login required to join
                      </template>
                    </div>
                  </div>
                  <div
                    v-if="event.isAdministrator && event.status != 'Completed'"
                    :class="{
                      'event-current-roundsubmission': true,
                      'column': true,
                      'is-half': true
                    }">
                    <div class="card-title">Administration</div>
                    <div>
                      <table class="table" v-if="event.status == 'Started'">
                        <tr v-if="event.currentRound"><th>Round</th><td>{{ event.currentRound.index + 1 }}</td></tr>
                        <tr>
                          <th>Status</th>
                          <td>
                            <template v-for="(quantity, status) in submissionStatuses(event)">
                              {{ status }} ({{ quantity }})
                            </template>
                          </td>
                        </tr>
                      </table>
                      <div class="roundsubmission-actions">
                        <ApolloMutation
                            :mutation="require('../graphql/nextEventRound.gql')"
                            :variables="{ id: data.events[0].id }"
                            :refetchQueries="refetchOnNextRound"
                            @error="onError">
                          <template slot-scope="{ mutate, loading, error, gqlError }">
                              <a class="button is-primary"
                              @click.prevent="nextEventRound(event, mutate)"
                              v-if="event.status == 'Started'"
                              v-tooltip="'End this round and start the next one with files getting passed on.'">
                              <span class="icon">
                                <icon :name="'check'" scale="1"></icon>
                              </span>
                                End round
                             </a>
                          </template>
                        </ApolloMutation>
                        <a class="button is-warning"
                          @click.prevent="requestFillIns(event, query)"
                          v-if="showRequestFillIns(event)"
                          v-tooltip="'Mark all unsubmitted roundsubmissions as skips and assign fill-ins where possible.'">
                            <span class="icon">
                              <icon :name="'exchange-alt'" scale="1"></icon>
                            </span>
                            Request fill-ins
                        </a>
                        <a class="button is-info"
                        v-if="!event.isPublic && ['Planned','Started'].includes(event.status)"
                        v-tooltip="'Invite participants'">Invite</a>
                        <template v-if="event.status == 'Planned'">
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
                                    event.id,
                                    $event.target.name,
                                    $event.target.files,
                                    query
                                  )" />
                              </form>
                              <span class="file-cta" style="margin-top: -1px;">
                                <span class="file-label">
                                  {{ event.initialFile ? 'Change' : 'Upload' }} initial file
                                </span>
                              </span>
                            </label>
                          </div>
                          <ApolloMutation
                              :mutation="require('../graphql/startEvent.gql')"
                              :variables="{ id: event.id }"
                              :refetchQueries="refetchOnJoin"
                              @error="onError">
                            <template slot-scope="{ mutate, loading, error, gqlError }">
                                <a class="button is-primary"
                                @click.prevent="startEvent(event, mutate)"
                                v-if="event.status == 'Planned' &&
                                      event.numParticipants > 0"
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
                v-if="event.roundsubmissions.length > 0"
                class="event-schedule">
                <div class="card-title">Schedule</div>
                <swap-schedule :schedule="schedule" :colorguide="true" />
              </div>
              <div class="event-description">
                <div class="card-title">Description</div>
                <div class="" v-html="formatText(event.description)" />
              </div>
              <div
                v-if="event.status == 'Completed' ||
                      event.areChangesVisible"
                class="comments">
                <div class="card-title">Comments</div>
                <vue-disqus
                  shortname="monsquaz-swap"
                  :identifier="`event-${event.id}`"
                  :url="currentUrl" />
              </div>
            </section>
          </div>
        </div>
      </template>
    </template>
  </ApolloQuery>
</template>

<script>
  import 'vue-awesome/icons/expand';
  import 'vue-awesome/icons/compress';
  import 'vue-awesome/icons/frown';
  import 'vue-awesome/icons/download';
  import 'vue-awesome/icons/paper-plane';
  import 'vue-awesome/icons/check';
  import 'vue-awesome/icons/fast-forward';
  import 'vue-awesome/icons/exchange-alt';
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
      axios.post(
        url, formData, {
          headers: {
            authorization: authToken ? `Bearer ${authToken}` : ""
          }
        }
      ).then(function({ data }) {console.warn('res', );
        let params = [ ...swalParams ];
        if (typeof data != 'object') {
          params = ['Error', data, 'error'];
        }
        else if (data.code != 200) {
          params = ['Error', data.message, 'error'];
        }
        self.$swal(...params);
        if (query) query.refetch();
      });
    }
  };
  module.exports = {
    name: 'event-page',
    props: {},
    data: () => ({
      eventsQuery: require('../graphql/events.gql'),
      usersQuery: require('../graphql/users.gql'),
      apiUrl: 'http://monsquaz.org:4000',
      error: null,
      expanded: false,
      skipRoundsubmissionMutation: require('../graphql/skipRoundsubmission.gql'),
      event: null
    }),
    computed: {
      schedule: function() {
        return this.getSchedule(this.event);
      },
      currentUrl: function() {
        return window.location.href.split('?')[0];
      },
      variables: function() {
        return {
          details: true,
          filters: {
            slug: this.$route.params.slug
          }
        };
      }
    },
    apollo: {
      currentUser: {
        query: require('../graphql/currentUser.gql')
      }
    },
    methods: {
      skipRemaining: function(event, eventsQuery) {
        let self = this;
        this.$swal({
          title: 'You are about to skip all remaining rounds',
          html: `You are about to skip the remaining rounds of <b>${event.name}</b><br />.
          This means that you cannot contribute any further.
          Only do this if you are certain that you can\'t contribute regardless of what song you will receive.<br />
          Are you absolutely sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, goodbye!'
        }).then((res) => {
          event.roundsubmissions
            .filter(
              rs => rs.participant.id == self.currentUser.id && ![
                'Submitted', 'Completed', 'Skipped'
              ].includes(rs.status)
            ).reduce((ack, rs) => {
              return ack.then(_ => self.$apollo.mutate({
                  mutation: self.skipRoundsubmissionMutation,
                  variables: {
                    id: rs.id,
                  }
                })
              )
            }, Promise.all([])).then(_ => {
              eventsQuery.refetch();
            });
        })
      },
      requestFillIns: function(event, eventsQuery) {
        let self = this;
        this.$swal({
          title: `You are about to request fill-ins`,
          html: `You are about to request fill-ins for all
          submissions that aren\'t submitted yet.
          <br /><br />Are you sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, unfortunately!'
        }).then((res) => {
          /* Skip in sequence, where we try to find fill-ins for the most skipped songs first. */
          event.roundsubmissions
            .filter(
              rs => rs.round.index == event.currentRound.index && ![
                'Planned', 'Submitted', 'Completed', 'Skipped'
              ].includes(rs.status)
            )
            .map(rs => ({
              id: rs.id,
              numSkips: event.roundsubmissions.reduce((ack, rs2) => {
                if (rs2.song_id == rs.song_id &&
                    rs2.status == 'Skipped') {
                  ack++;
                }
                return ack;
              }, 0),
              timesFilledIn: event.roundsubmissions.reduce((ack, rs2) => {
                if (rs2.song_id == rs.song_id &&
                    rs2.participant.id != rs2.originalParticipant.id) {
                  ack++;
                }
                return ack;
              }, 0)
            }))
            .sort((a, b) => {
              if (a.numSkips > b.numSkips) return 1;
              if (a.numSkips < b.numSkips) return -1;
              if (a.timesFilledIn > b.timesFilledIn) return -1;
              if (a.timesFilledIn < b.timesFilledIn) return 1;
              return 0;
            })
            .reduce((ack, rs) => {
              return ack.then(_ => self.$apollo.mutate({
                  mutation: self.skipRoundsubmissionMutation,
                  variables: {
                    id: rs.id,
                  }
                })
              )
            }, Promise.all([])).then(_ => {
              eventsQuery.refetch();
            });
        })
      },
      sizeToggle: function() {
        this.expanded = !this.expanded;
      },
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
            setTimeout(() => {
              document.body.removeChild(link);
            },1)
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
      userLinker: function(user) {
        return `/users/${user.slug}`;
      },
      formatText: function(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
      },
      onError: function(err) {
        this.error = err;
      },
      onResult: function({ data }) {
        this.event = data.events[0];
      },
      refetchOnJoin: function() {
        return ['Events'];
      },
      refetchOnNextRound: function() {
        return ['Events'];
      },
      joinEvent: function(event, mutate) {
        let html;
        if (event.status == 'Planned') {
          html = `You are about to join the event <b>${event.name}</b>.
          This means that you\'re expected to contribute on every file that you\'re assigned.<br /><br />
          Are you absolutely sure?`;
        } else {
          html = `You are about to join the event <b>${event.name} as a fill in</b>.
          This means that you\'re expected to contribute to the files you are assigned to.<br /><br />
          Are you absolutely sure?`;
        }
        this.$swal({
          title: 'You are about to join an event.',
          html,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I\'m up for it!'
        }).then((res) => {
          if (res.value) mutate();
        })
      },
      skipRoundsubmission: function(event, mutate) {
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
        }).then((res) => {
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
      nextEventRound: function(event, mutate) {
        this.$swal({
          title: 'You are about to end the current round.',
          html: `You are about to end round <b>${event.currentRound.index + 1}</b> of <b>${event.name}</b>.<br />
          The next round will be started immediately. Songs without contributions will be skipped.<br />
          Are you absolutely sure?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, on to next round!'
        }).then((res) => {
          if (res.value) mutate();
        })
      },
      submissionStatuses: function(event) {
        if (!event.currentRound) return {};
        return event.roundsubmissions
          .filter(rs => rs.round.index == event.currentRound.index)
          .reduce((ack, rs) => {
            if (rs.status in ack) ack[rs.status]++;
            else ack[rs.status] = 1;
            return ack;
          }, {});
      },
      showRequestFillIns: function(event) {
        if (event.status != 'Started') return false;
        if (!event.currentRound) return false;
        return event.roundsubmissions
          .filter(rs => rs.round.index == event.currentRound.index)
          .find(rs => ['Started','Refuted'].includes(rs.status));
      },
      getSchedule: function(event) { // TODO: Make computed or watched so it doesn't fire 4 times
      console.warn('GET SCHEDULE');
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
  .expander {
    float: right;
    position: relative;
    top: -20px;
    right: -15px;
    cursor: pointer;
    &.active {
      top: -20px;
      right: 10px;
    }
  }
  @media screen and (max-width: 768px) {
    .expander {
      display: none;
    }
  }
  .notification {
    padding: 5px;
  }
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
    text-align: center;
    >div {
      display: inline-block;
    }
    .button {
      margin-right: 5px;
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
  .button .icon:first-child:last-child {
    margin-right: auto;
  }
  .comments {
    margin-top: 25px;
  }
</style>
