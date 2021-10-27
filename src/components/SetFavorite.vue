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
    deleteFavorite: function (index) {
      this.notes[index].favorite = false;
    },
  },
};
</script>

<style scoped></style>
