<template>
  <div>
    <textarea
      v-if="note.isBold"
      style="font-weight: bold;"
      class="note-textarea"
      rows="9"
      v-model="note.text"
      placeholder="Take a note..."
    ></textarea>
    <textarea
      v-else-if="note.isUnder"
      style="text-decoration: underline;"
      class="note-textarea"
      rows="9"
      v-model="note.text"
      placeholder="Take a note..."
    ></textarea>
    <textarea
      v-else-if="note.isIncli"
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
  props: ["note"],
};
</script>

<style></style>
