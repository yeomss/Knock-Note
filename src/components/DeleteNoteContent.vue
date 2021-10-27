<template>
  <span
    v-if="notes.category != 'To-do List'"
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
  props: ["index", "notes"],
  methods: {
    deleteNoteContents(index) {
      this.notes[index].text = "";
      this.notes[index].imgPath = null;
      this.notes[index].emotion = "NoteKnock";
      console.log(this.notes[index]);
    },
    deleteContentModalIn(index) {
      this.notes[index].contentModal = true;
    },
    deleteContentModalOut(index) {
      this.notes[index].contentModal = false;
    },
  },
};
</script>

<style></style>
