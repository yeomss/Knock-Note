<template>
	<!-- 헤더 -->
	<div class="header">
		<img src="../assets/logo.png" />
		<p class="text-shadow">Knock Note</p>
		<button class="add-btn" @click.prevent="openEditor">
			<i class="fas fa-plus"></i>
		</button>
	</div>
</template>

<script>
export default {
	methods: {
		openEditor: function () {
			this.$emit("openEditor");
		},
	},
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	display: flex;
	align-items: center;
	width: 100%;
	z-index: 100; // 제일 높게
	top: 0;
	background: #f4cccc;
	color: #fff;
	& p {
		font-size: 35px;
		margin: 15px 20px;
	}
	& img {
		margin-left: 20px;
		height: 50px;
	}
}
</style>
