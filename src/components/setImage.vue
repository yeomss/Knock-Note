<template>
  <div>
    <form>
      <input
        class="imageInput"
        type="file"
        accept="image/*"
        v-on:change="setImageFile($event)"
      />
    </form>

    <button class="imageInputBtn" v-on:click="setFileExploer(index)">
      이미지 업로드
    </button>
  </div>
</template>

<script>
export default {
  props: ["index"],
  methods: {
    setFileExploer(index) {
      this.$store.dispatch("CLICK_IMAGE_FILE", index);
    },
    setImageFile(event) {
      this.$store.dispatch("SET_IMAGE_FILE", event);
    },
  },
};
</script>

<style></style>
