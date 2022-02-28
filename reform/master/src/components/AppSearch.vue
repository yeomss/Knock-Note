<template>
	<div class="searchContainer">
		<input
			type="text"
			placeholder="Search"
			v-model="searchTxt"
			@keyup.enter="searchNote"
		/>
		<span @click="searchNote">
			<span class="material-icons searchBtn"> search </span>
		</span>
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
		},
	},
};
</script>

<style lang="scss" scoped>
.searchContainer {
	width: 12rem;
	display: flex;
	justify-content: space-evenly;
	align-items: center;

	input {
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
}

.searchBtn {
	color: #654b52;
	font-size: 1.2rem;
	text-align: center;
	padding-top: 5px;
	cursor: pointer;
}
</style>
