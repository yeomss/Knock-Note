<template>
	<div id="app">
		<!-- 헤더 -->
		<AppHeader @openEditor="editorOpen = !editorOpen" />

		<!-- 노트 에디터 생성-->
		<NoteEditor
			:editorOpen="editorOpen"
			:app="app"
			@noteAdded="newNote"
			@noteDeleted="deleteNote"
			@editorClose="editorClose"
		/>

		<!-- 노트 목록 -->
		<div class="noteContainer">
			<div
				v-for="(note, key) in notes"
				:key="`note-${key}`"
				class="note"
				:style="{ 'background-color': note.theme }"
			>
				<div>
					<span class="delete" @click.prevent="deleteNote(key)"
						><i class="fas fa-times"></i
					></span>
					<span>{{ note.title }}</span>
					<p class="note-text">{{ note.text }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";

import NoteEditor from "./components/NoteEditor.vue";
import AppHeader from "./components/AppHeader.vue";

export default {
	name: "App",

	// 컴포넌트
	components: {
		AppHeader,
		NoteEditor,
	},

	// 데이터
	data: function () {
		return {
			// firebase 정보
			app: null, // firebase app
			db: null, // firebase db
			user: null, // 현재 익명 사용자 정보

			editorOpen: false, // note editor toggle
			notes: null, // db 에서 가져온 notes
		};
	},

	// 함수
	methods: {
		newNote(note) {
			this.notes.push(note);
		},

		deleteNote(key) {
			// this.notes.splice(index, 1);
			if (!confirm("노트를 삭제하시겠습니까?")) {
				return;
			} else {
				const noteRef = ref(
					this.db,
					"notes/" + this.user.uid + "/" + key
				);
				remove(noteRef);
				delete this.notes[key];
			}
		},

		editorClose() {
			this.editorOpen = false;
		},

		getNotes(db, uid) {
			// 노트 가져오기
			const noteRef = ref(db, "notes/" + uid);

			// 노트 화면에 반영하기
			onValue(
				noteRef,
				(snapshot) => {
					const data = snapshot.val();
					this.notes = data;

					// let keys = Object.keys(data);
				},
				{ onlyOnce: true }
			);

			// 목록 수신 트리거
			// iterator 형식으로 목록을 읽어온다.
			// onChildAdded(noteRef, (data) => {
			// 	console.log(data.val());
			// 	this.notes = data;
			// 	console.log(data);
			// 	// let
			// 	// for (var d in data.val()) {
			// 	// 	console.log(d.text, d.title);
			// 	// }
			// 	// // console.log(data.val());
			// 	// this.notes.push(data.val());
			// });
		},
	},

	// Vue Life cycle
	mounted() {
		if (localStorage.getItem("notes"))
			this.notes = JSON.parse(localStorage.getItem("notes"));
	},

	created() {
		// firebase
		const firebaseConfig = {
			apiKey: "AIzaSyB-0Q3f-GlcQcNeGVbpso4o-JAo-BcVosc",
			authDomain: "osp20-25073.firebaseapp.com",
			databaseURL: "https://osp20-25073.firebaseio.com",
			projectId: "osp20-25073",
			storageBucket: "osp20-25073.appspot.com",
			messagingSenderId: "359171034506",
			appId: "1:359171034506:web:d857e168477488b322cc73",
		};

		// firebase app 초기화
		const app = initializeApp(firebaseConfig);
		this.app = app;

		// db 가져오기
		const db = getDatabase(app);
		this.db = db;

		// 익명 인증
		const auth = getAuth();

		// 익명 로그인
		signInAnonymously(auth)
			.then(() => {
				// 로그인 상태 변화 관찰
				onAuthStateChanged(auth, (user) => {
					this.user = user;
					console.log(user.uid);

					// notes 읽어오기
					this.getNotes(db, user.uid);
				});
			})
			.catch((error) => {
				console.log(error);
			});
	},

	watch: {
		notes: function () {
			let uid = this.user.uid;
			if (uid) {
				// 노트 가져오기
				const noteRef = ref(this.db, "notes/" + this.user.uid);

				// 노트 화면에 반영하기
				onValue(
					noteRef,
					(snapshot) => {
						const data = snapshot.val();
						this.notes = data;
					},
					{ onlyOnce: true }
				);
			}
		},
	},
};
</script>

<style lang="scss">
@import "/styles/global.scss";
</style>
