<template>
	<div class="add-category">
		<input type="text" v-model="newCategory" placeholder="카테고리 입력" />
		<span @click="addCategory"> 추가 </span>
		<span @click="cancleCategory"> 취소 </span>
	</div>
</template>

<script>
// import { push, ref } from "firebase/database";

export default {
	props: ["db", "user"],

	data() {
		return {
			newCategory: "",
		};
	},

	methods: {
		addCategory() {
			console.log("add Category");
			this.newCategory = "";

			// 데이터 저장
			// let uid = this.user.uid;
			// push(ref(this.db, "categorys/" + uid), this.newCategory);
		},

		deleteCategory() {},

		cancleCategory() {
			// this.$emit("cacleCategory");
			console.log("cancle");
		},
	},
};
</script>

<style></style>
