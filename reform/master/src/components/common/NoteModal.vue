<template>
	<Transition name="note-modal">
		<div class="note-modal-mask" v-if="showModal">
			<div class="note-modal-wrapper">
				<div class="note-modal-container">
					<span @click="closeModal">
						<i class="fas fa-times closeBtn"></i>
					</span>
					<!-- modal header -->
					<div class="note-modal-header">
						<slot name="header"> default header </slot>
					</div>

					<!-- modal body -->
					<div class="note-modal-body">
						<slot name="body"> none </slot>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
export default {
	props: ["showModal"],

	methods: {
		closeModal() {
			this.$emit("closeModal");
		},
	},
};
</script>

<style lang="scss" scoped>
.note-modal-mask {
	position: absolute;
	z-index: 100;
	width: 50%;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	cursor: default;
	transition: opacity 0.3s ease;
}

.note-modal-wrapper {
	// display: table-cell;
	// vertical-align: middle;
}

.note-modal-container {
	padding: 20px 15px;
	margin: 0px auto;
	background-color: #654b52;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(146, 107, 107, 0.4);
	transition: all 0.3s ease;
	opacity: 0.95;

	&:hover {
		transform: scale(1.04);
		// opacity: 1;
	}
}

.note-modal-header {
	font-size: 0.9rem;
	color: #fff;
	margin: 3px;
}
.note-modal-body {
	font-size: 1.3rem;
	color: #fff;
}

.closeBtn {
	position: absolute;
	top: 2px;
	right: 5px;
	color: #eb9f9f;
	cursor: pointer;
}

// 트랜지션
.note-modal-enter {
	opacity: 0;
}
.note-modal-leave-active {
	opacity: 0;
}
.note-modal-enter .note-modal-container,
.note-modal-leave-active .note-modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
</style>
