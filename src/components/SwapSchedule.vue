 <template>
   <div>
     <table class="table schedule">
       <tr>
         <td></td>
         <th v-for="(_, index) in schedule">Song {{ index + 1 }}</th>
       </tr>
       <tr v-for="(round, index) in schedule">
         <th>Round {{ index + 1 }}</th>
         <td :class="submission.class" v-for="submission in round">
           <router-link v-if="'id' in submission" :to="`/roundsubmissions/${submission.id}`">
             {{ submission.title }}
           </router-link>
           <template v-else>
             {{ submission.title }}
           </template>
         </td>
       </tr>
     </table>
     <table class="colorguide" v-if="colorguide">
       <tr>
         <th v-for="color in colors">{{ color }}</th>
       </tr>
       <tr>
         <td v-for="color in colors" :class="color.toLowerCase()">
         </td>
       </tr>
     </table>
   </div>
</template>

<script>
  module.exports = {
    name: 'swap-schedule',
    props: ["schedule","colorguide"],
    data: () => ({
      colors: [
        'Planned',
        'Started',
        'FillInRequested',
        'FillinAquired',
        'Submitted',
        'Completed',
        'Skipped'
      ]
    }),
  };
</script>

<style lang="sass" scoped>
  .planned          { a { color: #000000; } background-color: #ffffff; }
  .started          { a { color: #ffffff; } background-color: #3399cc; }
  .fillinrequested  { a { color: #ffffff; } background-color: #996633; }
  .fillinaquired    { a { color: #000000; } background-color: #999966; }
  .submitted        { a { color: #ffffff; } background-color: #336666; }
  .completed        { a { color: #ffffff; } background-color: #339933; }
  .skipped          { a { color: #ffffff; } background-color: #993333; }
  .schedule, .colorguide {
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    width: 100%;
    max-width: 700px;
  }
  .colorguide {
    margin-top: 25px;
    th, td {
      padding: 5px;
      height: 20px;
    }
  }
  th {
    white-space: nowrap;
  }
  @media screen and (max-width: 850px) {
    .table {
      td, th { padding: 5px; }
    }
  }
  @media screen and (max-width: 500px) {
    .table {
      td, th { padding: 1px; }
    }
  }
</style>
