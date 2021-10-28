<template>
  <div v-show="note.imgPath" class="note-image-wrap">
    <img
      class="note-image"
      :src="note.imgPath"
      v-on:mouseover="imageCommentModalIn(index)"
      v-on:mouseout="imageCommentModalOut(index)"
    />
    <div v-show="note.imgComment" class="imageCommentModal">
      {{ note.predictedImage }}
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import * as cocoSSD from "@tensorflow-models/coco-ssd";

export default {
  props: ["index", "note"],

  data() {
    return {
      model: "",
    };
  },

  async created() {
    this.model = await cocoSSD.load();
  },

  methods: {
    async predict(index) {
      this.$store.dispatch("PREDICT_IMAGE", index, this.model);
    },
    imageCommentModalIn(index) {
      this.predict(index);
      this.$store.dispatch("OVER_IN_NOTE_PREDICT_IMAGE_MODAL", index);
    },
    imageCommentModalOut(index) {
      this.predict(index);
      this.$store.dispatch("OVER_OUT_NOTE_PREDICT_IMAGE_MODAL", index);
    },
  },
};
</script>

<style></style>
