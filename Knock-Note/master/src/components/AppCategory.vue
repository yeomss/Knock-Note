<template>
	<div class="categoryContainer">
		<!-- 선택 박스 -->
		<select v-model="selected" @change="changeCategory">
			<option value="">전체</option>
			<option v-for="category in categorys" :key="category">
				{{ category }}
			</option>
		</select>

		<!-- 카테고리 수정 버튼 -->
		<span class="editBtn" @click="showModal = true">
			<span class="material-icons"> edit_note </span>
		</span>

		<!-- 버튼 누르면 뜨는 카테고리 수정 창-->
		<CategoryModal :showModal="showModal" @closeModal="showModal = false">
			<template #header>
				<h3>Category</h3>
			</template>

			<template #body>
				<ul v-for="(category, key) in categorys" :key="key">
					<li v-if="category === '기본'">{{ category }}</li>
					<li v-else>
						{{ category }}
						<span class="material-icons deleteBtn" @click="deleteCategory(key)">
							backspace
						</span>
					</li>
				</ul>

				<AddCategory />
			</template>
		</CategoryModal>
	</div>
</template>

<script>
import CategoryModal from "./common/Modal.vue";
import AddCategory from "./common/AddCategory.vue";

export default {
	props: ["categorys"],
	components: { CategoryModal, AddCategory },

	data() {
		return {
			selected: "",
			showModal: false,
		};
	},

	methods: {
		// 필터링 카테고리 변경
		changeCategory() {
			this.$emit("changeCategory", this.selected);
			this.$store.commit("getCategorys");
		},

		// 카테고리 설정란에서 카테고리 삭제
		deleteCategory(key) {
			this.$store.commit("deleteCategory", key);
			this.$store.commit("getCategorys");
		},
	},

	created() {
		this.$store.commit("getCategorys");
	},
};
</script>

<style lang="scss" scoped>
.categoryContainer {
	display: flex;
	align-items: center;
	margin: 0 0.6rem;
	transition: all 0.3s ease;

	select {
		margin-right: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		opacity: 1;
		border-bottom: 1px solid #654b527e;
	}

	.editBtn {
		padding-top: 0.3rem;
		font-size: 1.2rem;
		// width: 4rem;
		cursor: pointer;
	}
	.deleteBtn {
		margin-left: 0.3rem;
		font-size: 1rem;
		color: #eb9f9f;
		cursor: pointer;
	}
}
/* 리스트 트랜지션 */
.list-enter-active,
.list-leave-active {
	transition: all 0.35s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
	opacity: 0;
	transform: translateY(30px) scale(1.1);
}
</style>
