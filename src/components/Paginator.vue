 <template>
   <ApolloQuery
     class="resource"
     :query="query"
     :variables="variables"
     @result="onResult">
     <template slot-scope="{ result: { data, loading } }">
       <template v-if="data && !loading">
         <div class="paginator">
           <table class="table">
             <tr v-if="showHeaders && data[resource].length > 0">
               <th
                 @click="sortBy(header)"
                 :class="{
                  sortable: header.sortable
                 }"
                 v-for="header in headers"
                 v-tooltip="header.tooltip">
                 {{ header.title }}
                 <icon
                   v-if="sortActual == header.sortField ||
                         sortActual == header.field"
                   :name="descendingActual ? 'angle-down' : 'angle-up'"
                   scale="1"></icon>
               </th>
             </tr>
             <tr v-if="data[resource].length == 0">
               <td :colspan="headers.length" style="border: none;">
                 <i>- None -</i>
               </td>
             </tr>
             <tr v-else @click="goto(linker(item))" class="single-item" v-for="item in data[resource]">
               <td v-for="header in headers">
                 <div v-if="typeof header.field === 'function'"
                 v-html="header.field(item)" />
                 <template v-else-if="typeof item[header.field] == 'boolean'">
                   {{ !!item[header.field] ? 'Yes' : 'No' }}
                 </template>
                 <template v-else>
                   {{ item[header.field] }}
                 </template>
               </td>
             </tr>
           </table>
         </div>
       </template>
     </template>
   </ApolloQuery>
</template>

<script>
  import 'vue-awesome/icons/angle-down';
  import 'vue-awesome/icons/angle-up';
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
    data: () => ({
      sortOverride: null,
      descendingOverride: null,
      offset: 0,
      limit: 100
    }),
    computed: {
      sortActual: function() {
        return this.sortOverride !== null ? this.sortOverride : this.sort;
      },
      descendingActual: function() {
        return this.descendingOverride !== null ? this.descendingOverride : this.descending;
      },
      variables: function() {
        return {
          offset: this.offset,
          limit: this.limit,
          sort: this.sortActual,
          descending: this.descendingActual,
          filters: this.filters
        };
      }
    },
    methods: {
      goto: function(path) {
        this.$router.push({ path });
      },
      onResult: function(res) {

      },
      sortBy: function(header) {
        if (!header.sortable) return null;
        if (this.sortActual == header.sortField ||
            this.sortActual == header.field)
          this.descendingOverride = !this.descendingActual;
        else {
          this.sortOverride = header.sortField || header.field;
          this.descendingOverride = false;
        }
      }
    },
    apollo: {}
  };
</script>

<style lang="sass" scoped>
.paginator {
  overflow: auto;
}
.single-item {
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
}
.sortable {
  cursor: pointer;
}
</style>
