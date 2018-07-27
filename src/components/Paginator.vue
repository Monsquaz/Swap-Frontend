 <template>
   <ApolloQuery
     class="resource"
     :query="query"
     :variables="variables"
     @result="onResult">
     <template slot-scope="{ result: { data, loading } }">
       <template v-if="data && !loading">
         <table class="table">
           <tr v-if="showHeaders">
             <th v-for="header in headers">{{ header.title }}</th>
           </tr>
           <tr @click="goto(linker(item))" class="single-item" v-for="item in data[resource]">
             <td v-for="header in headers">
               <div v-if="typeof header.field === 'function'"
               v-html="header.field(item)" />
               <template v-else-if="typeof item[header.field] == 'boolean'">
                 <input type="checkbox" :checked="!!item[header.field] ? 'checked' : false" disabled />
               </template>
               <template v-else>
                 {{ item[header.field] }}
               </template>
             </td>
           </tr>
         </table>
       </template>
     </template>
   </ApolloQuery>
</template>

<script>
  module.exports = {
    name: 'paginator',
    props: {
      resource: String,
      query: Object,
      showHeaders: {
        type: Boolean,
        default: true
      },
      headers: Array,
      linker: Function,
      sort: String,
      descending: Boolean,
      filters: Object
    },
    computed: {
      variables: function() {
        return {
          offset: this.offset,
          limit: this.limit,
          sort: this.sort,
          descending: this.descending,
          filters: this.filters
        };
      }
    },
    data: () => ({
      offset: 0,
      limit: 100
    }),
    methods: {
      goto: function(path) {
        this.$router.push({ path });
      },
      onResult: function(res) {

      }
    },
    apollo: {}
  };
</script>

<style lang="sass" scoped>
.single-item {
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
