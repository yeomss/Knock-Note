<template>
	<!-- 헤더 -->
	<div class="header">
		<div class="header-sub">
			<img src="../assets/logo.png" />
			<p class="text-shadow">
				<a href="javascript:location.reload()">Knock Note</a>
			</p>
			<span class="material-icons add-btn text-shadow" @click.prevent="openEditor">
				note_add
			</span>
		</div>

		<a href="#app">
			<span class="material-icons top-btn"> expand_less </span>
		</a>
	</div>
</template>

<script>
export default {
	methods: {
		openEditor() {
			this.$store.commit("openEditor");
		},
	},
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	align-items: center;
	width: 100%;
	z-index: 100; // 제일 높게
	top: 0;
	opacity: 0.9;
	background: #f4cccc;

	cursor: default;
}
.header-sub {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	a {
		color: #fff;
		text-decoration: none; // 밑줄 없애기
	}
	p {
		font-size: 35px;
		margin: 0.7rem 1rem;
	}
	img {
		margin-right: -0.5rem;
		padding-bottom: 2px;
		height: 40px;
	}
}
.add-btn {
	margin-left: 0.5rem;
	font-size: 2.5rem;
	cursor: pointer;
	opacity: 0.8;
	transition: all 0.3s ease;
	color: #fff;

	&:hover {
		opacity: 1;
		transform: scale(1.1);
		color: #654b52;
	}
}
.top-btn {
	position: fixed;
	z-index: 10;
	bottom: 1.2rem;
	right: 1.2rem;
	background-color: #654b52;
	color: #fff;
	border-radius: 100%;
	font-size: 3rem;
	opacity: 0.7;
	transition: all 0.3s ease;
	cursor: pointer;

	&:hover {
		opacity: 1;
	}
}
</style>
