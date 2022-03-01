<template>
	<Transition name="modal">
		<div class="modal-mask" v-if="showModal">
			<div class="modal-wrapper">
				<div class="modal-container">
					<span>
						<i
							@click="closeModal"
							class="fas fa-times closeBtn"
						></i>
					</span>

					<!-- modal header -->
					<div class="modal-header">
						<slot name="header"> default header </slot>
					</div>

					<!-- modal body -->
					<div class="modal-body">
						<slot name="body"> default body </slot>
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

<style lang="scss">
.modal-mask {
	position: fixed;
	z-index: 200;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
	color: #654b52;
}

.modal-wrapper {
	display: table-cell;
	vertical-align: middle;
}

.modal-container {
	width: 300px;
	margin: 0px auto;
	padding: 20px 30px;
	background-color: #f4cccc;
	opacity: 0.95;
	border-radius: 2px;
	border: none;
	// box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	box-shadow: 0 2px 8px rgba(146, 107, 107, 0.4);
	transition: all 0.3s ease;
	font-family: "Jua", "SUIT Variable", "Apple SD Gothic", "Open Sans",
		sans-serif;
}

.modal-header h3 {
	margin-top: 0;
	color: #654b52;
	text-align: center;
}

.modal-body {
	margin: 20px 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	transition: all 0.3s ease;

	ul {
		list-style-type: none;
		padding-left: 0px;
		margin: 0.3rem;
		// margin-top: 0.5rem;

		li {
			width: 100%;
			font-size: 1rem;
			// margin-left: 0.5rem;
			display: flex;
			align-items: center;
		}
	}
}
.closeBtn {
	z-index: 101;
	margin-left: 15rem;
	color: #654b52;
	cursor: pointer;
}

.modal-default-button {
	float: right;
}

.modal-enter {
	opacity: 0;
}
.modal-leave-active {
	opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
</style>
