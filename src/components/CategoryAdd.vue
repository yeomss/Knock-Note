<template>
  <div class="categoryAdd" style="text-align:center;">
    <input class="category-modal-input" type="text" v-model="category" placeholder="category" />
    <button
      class="category-modal-add"
      @click.prevent="addCategory"
    >
      추가
    </button>
    <button
      class="category-modal-cancle"
      v-if="main"
      @click.prevent="categoryCancle"
    >
      취소
    </button>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      category: "",
    };
  },
  props: ["main"],
  methods: {
    addCategory() {
      this.$emit("categoryAdd", this.category);
      this.category = "";
    },
    deleteCategory(index) {
      this.$emit("categoryDeleted", index);
    },
    categoryCancle() {
      this.$emit("categoryCancle");
    },
  },
};
</script>
