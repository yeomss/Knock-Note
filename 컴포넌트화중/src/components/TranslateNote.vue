<template>
  <i @click="translateNote(index)" class="fas fa-language translate-note"></i>
</template>

<script>
export default {
  props: ["index"],

  methods: {
    translateNote(index) {
      this.$store.dispatch("CLICK_PAPAGO", index);
    },
  },
};
</script>

<style></style>
