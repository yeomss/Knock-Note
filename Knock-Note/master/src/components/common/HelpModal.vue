<template>
	<div class="help">
		<div class="help-message shadow">
			{{ message }}
		</div>
		<div class="help-arrow shadow"></div>
	</div>
</template>

<script>
export default {
	props: ["message"],
};
</script>

<style lang="scss" scoped>
.help {
	position: absolute;
	display: flex;
	flex-direction: column;
	bottom: 4.2rem;
	opacity: 0.95;
}
.help-message {
	background-color: #654b52;
	color: #fff;
	padding: 0.3rem 0.5rem;
	border-radius: 2px;
	font-family: "SUIT Variable", "Apple SD Gothic", "Open Sans", sans-serif;
	font-size: 0.6rem;
	font-weight: 400;
	border: none;
}
.help-arrow {
	width: 0;
	height: 0;
	margin-left: 1px;
	border-radius: 1px;
	border-bottom: 0.4rem solid transparent;
	border-top: 0.4rem solid #654b52;
	border-left: 0.4rem solid transparent;
	border-right: 0.4rem solid transparent;
}

// .help-tip {
// 	position: absolute;

// 	top: 18px;

// 	right: 18px;

// 	text-align: center;

// 	background-color: #bcdbea;

// 	border-radius: 50%;

// 	width: 24px;

// 	height: 24px;

// 	font-size: 14px;

// 	line-height: 26px;

// 	cursor: default;
// }

// .help-tip:before {
// 	content: "?";

// 	font-weight: bold;

// 	color: #fff;
// }

// .help-tip:hover p {
// 	display: block;

// 	transform-origin: 100% 0%;

// 	-webkit-animation: fadeIn 0.3s ease-in-out;

// 	animation: fadeIn 0.3s ease-in-out;
// }

// .help-tip p {
// 	display: none;

// 	text-align: left;

// 	background-color: #1e2021;

// 	padding: 20px;

// 	width: 300px;

// 	position: absolute;

// 	border-radius: 3px;

// 	box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);

// 	right: -4px;

// 	color: #fff;

// 	font-size: 13px;

// 	line-height: 1.4;
// }

// .help-tip p:before {
// 	position: absolute;

// 	content: "";

// 	width: 0;

// 	height: 0;

// 	border: 6px solid transparent;

// 	border-bottom-color: #1e2021;

// 	right: 10px;

// 	top: -12px;
// }

// .help-tip p:after {
// 	width: 100%;

// 	height: 40px;

// 	content: "";

// 	position: absolute;

// 	top: -40px;

// 	left: 0;
// }

// @-webkit-keyframes fadeIn {
// 	0% {
// 		opacity: 0;

// 		transform: scale(0.6);
// 	}

// 	100% {
// 		opacity: 100%;

// 		transform: scale(1);
// 	}
// }

// /* @keyframes fadeIn {

// 	0% { opacity:0; }

// 	100% { opacity:100%; } */
</style>
