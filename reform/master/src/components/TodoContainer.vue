<template>
	<div class="todoContainer">
		<div>To Do List</div>

		<!-- toooInput -->
		<div>
			<input type="text" v-model="text" @keyup.enter="addTodo" />
			<span @click="addTodo">input btn</span>
		</div>

		<!-- todoList -->
		<div>
			<ul v-for="(todo, key) in todos" :key="key">
				<li>
					<span
						:class="{ todoCheck: todo.completed }"
						@click="toggleTodo(todo, key)"
					>
						<span class="material-icons"> check </span>
					</span>

					{{ todo.text }}
					<span @click="deleteTodo(key)">
						<span class="material-icons"> delete </span>
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { push, ref, remove, set } from "firebase/database";

export default {
	props: ["db", "user", "todos"],

	data() {
		return {
			text: "",
		};
	},

	methods: {
		// todo 추가
		addTodo() {
			let newTodo = {
				completed: false,
				text: this.text,
			};

			console.log(newTodo);
			console.log("addTOdo");

			// 데이터 저장
			let uid = this.user.uid;
			push(ref(this.db, "todos/" + uid), newTodo);
			this.text = "";

			// this.$emit("editorClose");
			// this.initEditor();
		},

		// todo 삭제
		deleteTodo(key) {
			let uid = this.user.uid;
			remove(ref(this.db, "todos/" + uid + "/" + key));
			delete this.todos[key];
		},

		// todo 체크
		toggleTodo(todo, key) {
			let uid = this.user.uid;
			let todoRef = ref(this.db, "todos/" + uid + "/" + key);
			let updateTodo = { completed: !todo.completed, text: todo.text };
			set(todoRef, updateTodo);
		},
	},
};
</script>

<style lang="scss" scoped>
.todoContainer {
	background-color: #fff;
	// width: 100%;
	margin: 15px;
	// flex-basis: 20rem;
	min-width: 23rem;
}

.todoCheck {
	background-color: tomato;
}
</style>
