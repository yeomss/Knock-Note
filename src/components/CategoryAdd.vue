<template>
  <div class="categoryAdd" style="text-align: center;">
    <input
      class="category-modal-input"
      type="text"
      v-model="category"
      placeholder="category"
    />
    <button class="category-modal-add" @click.prevent="addCategory(category)">
      추가
    </button>
    <button
      class="category-modal-cancle"
      v-if="main"
      @click.prevent="modalCategory"
    >
      취소
    </button>
  </div>
</template>

<script>
export default {
  props: ["main"],

  data: function () {
    return {
      category: "",
    };
  },

  methods: {
    deleteCategory(index) {
      this.$store.dispatch("CLICK_DELETE_CATEGORY", index);
    },
    addCategory(category) {
      this.$store.dispatch("CLICK_ADD_CATEGORY", category);
    },
    modalCategory() {
      this.$store.dispatch("CLICK_CATEGORY_MODAL");
    },
  },
};
</script>
