<template>
  <!-- 즐겨찾기 해제 -->
  <span class="favorites">
    <i class="far fa-star" @click="addFavorite(index)"></i>
  </span>
</template>

<script>
export default {
  props: ["index"],

  methods: {
    addFavorite(index) {
      this.$store.dispatch("CLICK_ADD_FAVORITE", index);
    },
  },
};
</script>

<style scoped></style>
