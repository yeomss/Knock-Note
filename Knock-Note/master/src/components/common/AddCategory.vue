<template>
	<div class="add-category">
		<input
			type="text"
			v-model="newCategory"
			placeholder="New Category"
			@keypress.enter="addCategory"
		/>

		<div class="btns">
			<span @click="addCategory" class="material-icons"> add_box </span>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			newCategory: "",
		};
	},

	methods: {
		addCategory() {
			this.$store.commit("addCategory", this.newCategory);
			this.$store.commit("getCategorys");
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
		border: #654b52 1px solid;
		transition: all 0.3s ease;
		&:focus {
			outline: none;
			opacity: 1;
		}
	}

	.btns {
		margin-top: 0.36rem;
		cursor: pointer;
	}
}
</style>
