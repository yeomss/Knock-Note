<template>
  <div>
    <!-- 카테고리 수정 버튼 -->
    <button
      class="category-edit"
      @click="modalCategory"
      @click.prevent="categoryMain = true"
    >
      카테고리 수정
    </button>

    <!-- 카테고리 필터의 리스트 -->
    <div v-show="this.$store.state.isCategoryModalShow">
      <div>
        <div class="category-modal-content">
          <div
            v-for="(list, index) in this.$store.state.categorys"
            :key="`list-${index}`"
            class="category"
          >
            {{ list }}
            <!-- 새로 생긴 카테고리의 캔슬 아이콘 -->
            <span v-if="index > 1" @click.prevent="deleteCategory(index)">
              <i class="fas fa-times"></i>
            </span>
          </div>

          <!-- 카테고리 추가 버튼 -->
          <category-add :main="categoryMain"></category-add>
        </div>

        <!-- 카테고리 모달 배경 쉐도우 -->
        <div class="category-modal-layer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryAdd from "../components/CategoryAdd.vue";

export default {
  data() {
    return {
      categoryMain: this.$store.state.categoryMain,
    };
  },

  methods: {
    // 카테고리 모달 띄우기
    modalCategory() {
      this.$store.dispatch("CLICK_CATEGORY_MODAL");
    },
    // 카테고리 삭제하기
    deleteCategory(index) {
      this.$store.dispatch("CLICK_DELETE_CATEGORY", index);
    },
    // 카테고리 추가하기
    addCategory(category) {
      this.$store.dispatch("CLICK_ADD_CATEGORY", category);
    },
  },
  components: {
    CategoryAdd,
  },
};
</script>

<style></style>
