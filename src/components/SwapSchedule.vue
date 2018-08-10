 <template>
   <div>
     <div class="table-wrapper">
       <table class="table schedule">
         <tr>
           <td></td>
           <th v-for="(_, index) in schedule">Song {{ index + 1 }}</th>
         </tr>
         <tr v-for="(round, index) in schedule">
           <th>Round {{ index + 1 }}</th>
           <td v-for="submission in round">
             <div :class="submission.class">
               <router-link v-if="'id' in submission" :to="`/roundsubmissions/${submission.id}`">
                 &nbsp;{{ submission.title }}
               </router-link>
               <template v-else>
                 &nbsp;{{ submission.title }}
               </template>
             </div>
           </td>
         </tr>
       </table>
     </div>
     <div class="colorguide" v-if="colorguide">
       <div class="color" v-for="[ status, tooltip ] in presentColors">
         <div v-tooltip="tooltip" :class="status.toLowerCase()">{{ status }}</div>
       </div>
     </div>
   </div>
</template>

<script>
  module.exports = {
    name: 'swap-schedule',
    props: ["schedule","colorguide"],
    data: () => ({
      colors: [
        ['Planned','The event is scheduled to take place in the future'],
        ['Started','The event is active right now'],
        ['FillInRequested','The participant has been marked as skipping'],
        ['FillinAquired','A participant has been selected to fill in for a skipping participant'],
        ['Submitted','A file has been submitted. This means that the event will be completed'],
        ['Refuted','The administrator has refuted the submission'],
        ['Completed','The event was successfully completed'],
        ['Skipped','Nobody contributed']
      ]
    }),
    computed: {
      presentColors: function(){
        let self = this;
        let ret = self.colors.reduce((ack, e) => {
          let c = e[0].toLowerCase();
          if (self.schedule.find(
            r => r.find(rs => rs.class === c)
          )) { ack.push(e); }
          return ack;
        }, []);
        return ret;
      }
    }
  };
</script>

<style lang="sass" scoped>
  .planned          { color: #000000; a { color: #000000; } background-color: #ffffff; }
  .started          { color: #ffffff; a { color: #ffffff; } background-color: #3399cc; }
  .fillinrequested  { color: #ffffff; a { color: #ffffff; } background-color: #996633; }
  .fillinaquired    { color: #000000; a { color: #000000; } background-color: #999966; }
  .submitted        { color: #ffffff; a { color: #ffffff; } background-color: #336666; }
  .refuted          { color: #ffffff; a { color: #ffffff; } background-color: #990066; }
  .completed        { color: #ffffff; a { color: #ffffff; } background-color: #339933; }
  .skipped          { color: #ffffff; a { color: #ffffff; } background-color: #993333; }
  .table-wrapper {
    overflow-x: auto;
  }
  .schedule, .colorguide {
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
  .colorguide {
    margin-top: 25px;
    overflow: auto;
    text-align: center;
    div {
      display: inline-block;
      padding:5px;
      border-radius: 5px;
      div {
        border: 1px solid #c0c0c0;
      }
    }
  }
  th {
    white-space: nowrap;
  }
  .table {
    td, th { padding: 1px; }
  }
  @media screen and (max-width: 850px) {
    .table {
      td, th { padding: 5px; }
    }
  }
  @media screen and (max-width: 500px) {
    .table {
      td, th { padding: 0px; }
    }
  }
</style>
