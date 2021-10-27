<template>
  <div v-show="notes[index].imgPath" class="note-image-wrap">
    <img
      class="note-image"
      :src="notes[index].imgPath"
      v-on:mouseover="imageCommentModalIn(index)"
      v-on:mouseout="imageCommentModalOut(index)"
    />
    <div v-show="notes[index].imgComment" class="imageCommentModal">
      {{ note.predicted }}
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

export default {
  props: ["index", "notes", "model"],
  methods: {
    async predict(index) {
      let noteImage = new Image();
      noteImage.src = this.notes[index].imgPath;

      // let img = noteImage;
      let tmp = await this.props.model.detect(noteImage);
      this.notes[index].predictedImage = tmp[0].class;
      this.notes[index].imgComment = this.notes[index].predicted;
    },
    imageCommentModalIn(index) {
      this.predict(index);
      this.notes[index].imgComment = true;
    },
    imageCommentModalOut(index) {
      this.notes[index].imgComment = false;
    },
  },
};
</script>

<style></style>
