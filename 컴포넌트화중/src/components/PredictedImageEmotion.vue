<template>
  <div class="emotion-btn">
    <span class="note-face">
      <i class="far fa-smile-wink" @click="predictImageEmotion(index)"></i>
    </span>
    <span class="emotionModal">I FEEL LIKE #{{ note.emotion }}</span>
  </div>
</template>

<script>
export default {
  props: ["index", "note"],
  methods: {
    predictImageEmotion(index) {
      this.$store.dispatch("CLICK_PREDICT_IMAGE", index);
    },
  },
};
</script>

<style></style>
