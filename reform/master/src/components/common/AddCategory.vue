<template>
	<div class="add-category">
		<input
			type="text"
			v-model="newCategory"
			placeholder="New Category"
			@keyup.enter="addCategory"
		/>

		<div class="btns">
			<span @click="addCategory" class="material-icons"> add_box </span>
		</div>
	</div>
</template>

<script>
import { push, ref } from "firebase/database";

export default {
	props: ["db", "user", "categorys"],

	data() {
		return {
			newCategory: "",
		};
	},

	methods: {
		addCategory() {
			// 중복 처리
			let uid = this.user.uid;
			let flag = false; // 중복된 카테고리가 없을 시

			if (this.newCategory != "") {
				for (let i in this.categorys) {
					if (this.categorys[i] === this.newCategory) {
						alert("중복된 카테고리가 있습니다.");
						flag = true;
						break;
					}
				}

				if (!flag) {
					// 카테고리 저장
					push(ref(this.db, "categorys/" + uid), this.newCategory);
				}
			}

			this.newCategory = "";
		},
	},
};
</script>

<style lang="scss" scoped>
.add-category {
	margin-top: 1rem;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;

	input {
		width: 100%;
		color: #654b52;
		border: none;
		opacity: 0.5;
		border-bottom: #654b52 1px solid;
		transition: all 0.3s ease;
		&:focus {
			outline: none;
			opacity: 1;
		}
	}

	.btns {
		margin-top: 0.3rem;
		cursor: pointer;
	}
}

</style>
