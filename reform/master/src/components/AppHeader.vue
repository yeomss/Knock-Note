<template>
	<!-- 헤더 -->
	<div class="header">
		<img src="../assets/logo.png" />
		<p class="text-shadow">
			<a href="javascript:location.reload()">Knock Note</a>
		</p>
		<span class="material-icons add-btn" @click.prevent="openEditor">
			note_add
		</span>
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

	cursor: default;

	a {
		color: #fff;
		text-decoration: none; // 밑줄 없애기
	}
	p {
		font-size: 35px;
		margin: 15px 20px;
	}
	img {
		margin-left: 20px;
		height: 50px;
	}
}
.add-btn {
	background-color: transparent;
	font-size: 2.5rem;
	cursor: pointer;
	opacity: 1;
	transition: all 0.3s ease;

	&:hover {
		opacity: 0.8;
		transform: scale(1.1);
	}
}
// note editor open btn
// .add-btn {
// 	padding: 5px 10px;
// 	margin: 20px;
// 	border: none;
// 	color: #000;
// 	outline: none;
// 	font-size: 10px;
// 	cursor: pointer;
// }
</style>
