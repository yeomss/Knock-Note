<template>
  <span
    v-if="note.category != 'To-do List'"
    class="speech-to-text"
    @click="voiceToText(index)"
  >
    <i class="fas fa-microphone"></i>
  </span>
</template>

<script>
export default {
  props: ["index", "note"],
  methods: {
    voiceToText(index) {
      this.$store.dispatch("CLICK_VOICE_TO_TEXT", index);
    },
  },
};
</script>

<style></style>
