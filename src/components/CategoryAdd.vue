<template>
  <div class="categoryAdd" style="text-align: center;">
    <input
      class="category-modal-input"
      type="text"
      v-model="category"
      placeholder="category"
    />
    <button class="category-modal-add" @click="addCategory(category)">
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
    modalCategory() {
      this.$store.dispatch("CLICK_CATEGORY_MODAL");
    },
    addCategory(category) {
      this.$store.dispatch("CLICK_ADD_CATEGORY", category);
      this.category = "";
    },
  },
};
</script>
