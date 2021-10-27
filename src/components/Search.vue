<template>
 <div class="search-filter">
    <form>
      <input v-model="search" placeholder="Search">
      <button @click.prevent=SearchNote>검색</button>
    </form>
  </div>
</template>

<script>
export default {
    data: function() {
        return {
            search:'',
            is_search:false,
        }
    },
    methods: {        
        SearchNote() {
            this.$emit('noteSearched',this.search, this.is_search);
            this.search='';
            this.is_search=false;
        },
    },
}
</script>
