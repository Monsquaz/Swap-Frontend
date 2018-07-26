 <template>
   <ApolloQuery
     class="resource"
     :query="query"
     :variables="variables"
     @result="onResult">
     <template slot-scope="{ result: { data, loading } }">
       <template v-if="data && !loading">
         <table class="table">
           <tr>
             <th v-for="header in headers">{{ header.title }}</th>
           </tr>
           <tr @click="goto(linker(item))" class="single-item" v-for="item in data[resource]">
             <td
               v-for="header in headers"
               v-html="'f' in header ? header.f(item[header.field]) : item[header.field]">
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
      headers: Array,
      linker: Function,
      sort: String,
      descending: Boolean,
      filters: Object
    },
    computed: {
      variables: function() {
        return {
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
