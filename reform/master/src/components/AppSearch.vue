<template>
	<div class="searchContainer">
		<input
			type="text"
			placeholder="Search"
			v-model="searchTxt"
			@keyup.enter="searchNote"
		/>
		<span @click.prevent="searchNote">검색 버튼</span>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchTxt: "",
		};
	},

	methods: {
		searchNote() {
			this.$emit("searchNote", this.searchTxt);
			this.searchTxt = "";
		},
	},
};
</script>

<style lang="scss" scoped>
.searchContainer {
	// width: 50%;
	background-color: tomato;
}
</style>
