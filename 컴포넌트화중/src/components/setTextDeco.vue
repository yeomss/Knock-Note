<template>
  <span v-if="note.category != 'To-do List'">
    <span class="textform-B" @click="setBold(index)">B</span>
    <span class="textform-U" @click="setUnderbar(index)">U</span>
    <span class="textform-I" @click="setInclination(index)">I</span>
  </span>
</template>

<script>
export default {
  props: ["index", "note"],
  methods: {
    setBold(index) {
      this.$store.dispatch("CLICK_BOLD", index);
    },
    setUnderbar(index) {
      this.$store.dispatch("CLICK_UNDER", index);
    },
    setInclination(index) {
      this.$store.dispatch("CLICK_INCLI", index);
    },
  },
};
</script>

<style></style>
