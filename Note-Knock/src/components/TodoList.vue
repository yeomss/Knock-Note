<template>
  <span id="checkbox">
    <input type="checkbox" id="todo" value="todo" v-model="checked" disabled>
    <label for="todo">
      <input class="todolist-edit" type="text" v-model="todo" placeholder="할 일"/>
    </label>
    <button v-if="confirm" class="check" @click.prevent="createList" @click="confirm=false">확인</button>
  </span>
</template>

<script>
export default {
  data: function() {
    return {
      todo:'',
      checked:false,
      confirm: true,
    };
  },
  methods: {
    createList() {
      this.$emit('listAdd',this.todo, this.checked); 
      
    },
  },
};
</script>
