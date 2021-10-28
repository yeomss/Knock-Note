<template>
  <span class="delete" @click.prevent="deleteNote(index)">
    <i class="fas fa-times"></i>
  </span>
</template>

<script>
export default {
  props: ["index"],

  methods: {
    deleteNote(index) {
      this.$store.dispatch("CLICK_DELETE_NOTE", index);
    },
  },
};
</script>

<style></style>
