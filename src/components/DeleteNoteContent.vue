<template>
  <span
    v-if="note.category != 'To-do List'"
    class="deleteContent"
    @click.prevent="deleteNoteContents(index)"
  >
    <i
      v-on:mouseover="deleteContentModalIn(index)"
      v-on:mouseout="deleteContentModalOut(index)"
      class="fas fa-trash-alt"
    ></i>
  </span>
</template>

<script>
export default {
  props: ["index", "note"],
  methods: {
    deleteNoteContents(index) {
      this.$store.dispatch("CLICK_DELETE_NOTE_CONTENT", index);
    },
    deleteContentModalIn(index) {
      this.$store.dispatch("OVER_IN_NOTE_CONTENT_MODAL", index);
    },
    deleteContentModalOut(index) {
      this.$store.dispatch("OVER_OUT_NOTE_CONTENT_MODAL", index);
    },
  },
};
</script>

<style></style>
