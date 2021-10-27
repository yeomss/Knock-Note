<template>
  <span class="delete" @click.prevent="deleteNote(index)">
    <i class="fas fa-times"></i>
  </span>
</template>

<script>
export default {
  props: ["index", "notes"],
  methods: {
    deleteNote(index) {
      this.notes.splice(index, 1);
    },
  },
};
</script>

<style></style>
