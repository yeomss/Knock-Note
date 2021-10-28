<template>
  <!-- 즐겨찾기 해제 -->
  <span class="favorites">
    <i class="fas fa-star" @click="deleteFavorite(index)"></i>
  </span>
</template>

<script>
export default {
  props: ["index"],

  methods: {
    deleteFavorite(index) {
      this.$store.dispatch("CLICK_DELETE_FAVORITE", index);
    },
  },
};
</script>

<style scoped></style>
