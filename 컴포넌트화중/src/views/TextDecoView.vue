<template>
  <div>
    <textarea
      v-if="this.$store.state.notes[index].isBold"
      style="font-weight: bold;"
      class="note-textarea"
      rows="9"
      v-model="note.text"
      placeholder="Take a note..."
    ></textarea>
    <textarea
      v-else-if="this.$store.state.notes[index].isUnder"
      style="text-decoration: underline;"
      class="note-textarea"
      rows="9"
      v-model="note.text"
      placeholder="Take a note..."
    ></textarea>
    <textarea
      v-else-if="this.$store.state.notes[index].isIncli"
      style="fontstyle: italic;"
      class="note-textarea"
      rows="9"
      v-model="note.text"
      placeholder="Take a note..."
    ></textarea>
    <textarea
      v-else
      class="note-textarea"
      rows="9"
      v-model="note.text"
      placeholder="Take a note..."
    ></textarea>
  </div>
</template>

<script>
export default {
  props: ["index", "note"],
};
</script>

<style></style>
