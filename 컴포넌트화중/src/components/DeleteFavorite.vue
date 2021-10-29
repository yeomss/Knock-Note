<template>
  <!-- 즐겨찾기 해제 -->
  <span class="favorites">
    <i class="fas fa-star" @click="deleteFavorite(index)"></i>
  </span>
</template>

<script>
export default {
  props: ["index"],

  watch: {
    notes: {
      handler() {
        var newNotes = this.notes;
        localStorage.setItem("notes", JSON.stringify(newNotes));
      },
      deep: true,
    },
    categorys: {
      handler() {
        var addCategorys = this.categorys;
        localStorage.setItem("categorys", JSON.stringify(addCategorys));
      },
    },
  },

  methods: {
    deleteFavorite(index) {
      this.$store.dispatch("CLICK_DELETE_FAVORITE", index);
    },
  },
};
</script>

<style scoped></style>
