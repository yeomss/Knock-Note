<template>
	<div class="categoryContainer">
		<span>category</span>

		<!-- 선택 박스 -->
		<select v-model="selectedCategory" @change="changeCategory">
			<option value="">전체</option>
			<option v-for="category in categorys" :key="category">
				{{ category }}
			</option>
		</select>

		<!-- 카테고리 수정 버튼 -->
		<span @click="categoryModalOpen = true"> 카테고리 수정 </span>

		<!-- 버튼 누르면 뜨는 카테고리 수정 창-->
		<CategoryModal :showModal="categoryModalOpen">
			<template #header>
				<h3>
					✏️ 카테고리 수정
					<i
						class="fa-solid fa-xmark closeModalBtn"
						@click="categoryModalOpen = false"
					>
					</i>
				</h3>
			</template>
			<template #body>
				<ul v-for="category in categorys" :key="category">
					<li>{{ category }}</li>
				</ul>
			</template>

			<AddCategory :db="db" :user="user"></AddCategory>
		</CategoryModal>
	</div>
</template>

<script>
import CategoryModal from "./common/Modal.vue";
import AddCategory from "./common/AddCategory.vue";

export default {
	props: ["app", "db", "user", "categorys"],

	components: { CategoryModal, AddCategory },

	data() {
		return {
			selectedCategory: "",
			categoryModalOpen: false,
		};
	},

	methods: {
		changeCategory() {
			this.$emit("changeCategory", this.selectedCategory);
		},
	},

	watch: {
		category: function () {
			console.log(this.category);
		},
	},
};
</script>

<style lang="scss" scoped>
.categoryContainer {
	// width: 50%;
	background-color: teal;
}
</style>
