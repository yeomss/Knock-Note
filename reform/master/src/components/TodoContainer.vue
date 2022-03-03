<template>
	<div class="todo-wrapper">
		<div class="todoToggle">todoToggle</div>

		<div class="todoContainer">
			<div class="todoTitle">할 일을 마무리 해볼까요 ✨</div>

			<!-- toooInput -->
			<div class="todoInputBox shadow">
				<input type="text" v-model="text" @keypress.enter="addTodo" />
				<span class="todoAddBtnContainer">
					<span class="material-icons todoAddBtn" @click="addTodo"> add </span>
				</span>
			</div>

			<!-- todoList -->
			<div>
				<transition-group name="list" tag="ul">
					<li v-for="(todo, key) in this.$store.state.todos" :key="key" class="shadow">
						<span
							class="material-icons todoCheck"
							:class="{ todoCheckCompleted: todo.completed }"
							@click="toggleTodo(key)"
						>
							check
						</span>

						<span
							class="todoText"
							:class="{ textCompleted: todo.completed }"
							@click="toggleTodo(key)"
						>
							{{ todo.text }}
						</span>

						<span @click="deleteTodo(key)">
							<span class="material-icons todoDelete"> delete </span>
						</span>
					</li>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			text: "",
		};
	},

	methods: {
		// todo 추가
		addTodo() {
			this.$store.commit("addTodo", this.text);
			this.$store.commit("getTodos");
			this.text = "";
		},

		// todo 삭제
		deleteTodo(key) {
			this.$store.commit("deleteTodo", key);
			this.$store.commit("getTodos");
		},

		// todo 체크
		toggleTodo(key) {
			this.$store.commit("toggleTodo", key);
			this.$store.commit("getTodos");
		},
	},
};
</script>

<style lang="scss" scoped>
.todo-wrapper {
	width: 500px;
	// background-color: #654b52;
	height: 100%;
}

.todoContainer {
	margin: 10px;
}

.todoTitle {
	font-size: 0.9rem;
	margin: 5px;
	color: #8a7c80;
}

.todoInputBox {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	width: 100%;
	background: white;
	height: 40px;
	line-height: 40px;
	border-radius: 5px;
	margin-bottom: 15px;
}
.todoInputBox input {
	border-style: none;
	font-size: 0.9rem;
	width: 100%;
	margin: 10px;
	// background-color: aqua;

	&:focus {
		outline: none;
	}
}

.todoAddBtnContainer {
	text-align: center;
	background: linear-gradient(to right, #f4cccc, #eb9f9f);
	display: block;
	width: 3rem;
	border-radius: 0 5px 5px 0;
	cursor: pointer;

	.todoAddBtn {
		color: #654b52;
		vertical-align: middle;
	}
}

ul {
	list-style-type: none;
	padding-left: 0px;
	margin-top: 0;
}

li {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	// justify-content: space-between;
	align-items: center;

	margin: 0.5rem 0.1rem 0 0.1rem;
	padding: 0 0.2rem;
	background: white;
	border-radius: 5px;

	.todoCheck {
		color: #62acde;
		margin: 5px;
		// margin-right: 5px;
		cursor: pointer;
	}
	.todoCheckCompleted {
		color: #b3adad;
	}
	.todoText {
		flex-grow: 1;
		cursor: pointer;
	}
	.textCompleted {
		text-decoration: line-through;
		color: #b3adad;
	}
	.todoDelete {
		flex-grow: 1;
		margin: 5px;
		// text-align: right;
		margin-left: auto;
		color: #654b52;
		cursor: pointer;
	}
}

/* 리스트 트랜지션 */
.list-enter-active,
.list-leave-active {
	transition: all 0.35s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
	opacity: 0;
	transform: translateY(30px) scale(1.1);
}
</style>
