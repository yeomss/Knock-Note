<template>
	<div id="app">
		<!-- 헤더 -->
		<AppHeader @openEditor="editorOpen = !editorOpen" />

		<!-- 노트 에디터 생성-->
		<NoteEditor
			:editorOpen="editorOpen"
			:app="app"
			:user="user"
			:db="db"
			:storage="storage"
			:categorys="categorys"
			@noteAdded="newNote"
			@noteDeleted="deleteNote"
			@editorClose="editorClose"
		></NoteEditor>

		<!-- 노트 부가적인 서비스 -->
		<div class="subContainer">
			<AppCategory
				:app="app"
				:db="db"
				:user="user"
				:categorys="categorys"
				@changeCategory="changeCategory"
			/>
			<AppSearch @searchNote="searchNote" />
		</div>

		<div class="contentsContainer" v-if="notes">
			<!-- 노트 todoList -->
			<TodoContainer :db="db" :user="user" :todos="todos" />
			<hr />
			<!-- 노트 목록 -->
			<NoteContainer
				:notes="notes"
				:selectedCategory="category"
				:searchTxt="searchTxt"
				:user="user"
				:db="db"
				:storage="storage"
				:model="model"
				@deleteNote="deleteNote"
			/>
		</div>
		<Loading v-else></Loading>
	</div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import "@tensorflow/tfjs";
import * as cocoSSD from "@tensorflow-models/coco-ssd";

import AppHeader from "./components/AppHeader.vue";
import NoteEditor from "./components/NoteEditor.vue";
import AppCategory from "./components/AppCategory.vue";
import AppSearch from "./components/AppSearch.vue";
import TodoContainer from "./components/TodoContainer.vue";
import NoteContainer from "./components/NoteContainer.vue";
import Loading from "./components/common/Loading.vue";

export default {
	name: "App",

	// 컴포넌트
	components: {
		AppHeader,
		NoteEditor,
		AppCategory,
		AppSearch,
		NoteContainer,
		TodoContainer,
		Loading,
	},

	// 데이터
	data: function () {
		return {
			// firebase 정보
			app: null, // firebase app
			db: null, // firebase db
			store: null, // firebase store
			storage: null, // firebase storage
			user: null, // 현재 익명 사용자 정보

			// db 에서 가져온 데이터
			notes: null, // db 에서 가져온 notes
			categorys: null, // db 에서 가져온 categorys
			todos: null,

			// 데이터
			editorOpen: false, // note editor toggle
			category: null, // 설정한 카테고리
			searchTxt: "", // 검색하려는 키워드

			// 객체 탐지
			model: null,
		};
	},

	// 함수
	methods: {
		// 새로운 노트 생성
		newNote(note) {
			this.notes.push(note);
		},

		// 노트 삭제
		deleteNote(key) {
			// this.notes.splice(index, 1);

			let uid = this.user.uid;
			if (!confirm("노트를 삭제하시겠습니까?")) {
				return;
			} else {
				// storage에서 삭제
				if (this.notes[key].img.isUpload) {
					const imgType = this.notes[key].img.type;
					let path = `images/${uid}/${key}/noteImage.${imgType}`;
					const imgRef = storageRef(this.storage, path);

					deleteObject(imgRef)
						.then(() => {
							console.log("파일 삭제 완료!");
						})
						.catch((error) => {
							console.log(error);
						});
				}

				// db에서 삭제
				const noteRef = ref(this.db, "notes/" + uid + "/" + key);
				remove(noteRef);
				delete this.notes[key];
			}
		},

		// 노트 에디터 닫기
		editorClose() {
			this.editorOpen = false;
		},

		// 노트 키워드 검색
		searchNote(text) {
			this.searchTxt = text;
			console.log(this.searchTxt);
		},

		// 노트 검색 카테고리 설정
		changeCategory(selected) {
			this.category = selected;
		},

		// db에서 노트 가져오기
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
			// 	// this.notes = data;
			// 	// console.log(data);
			// 	// let
			// 	// for (var d in data.val()) {
			// 	// 	console.log(d.text, d.title);
			// 	// }
			// 	// // console.log(data.val());
			// 	// this.notes.push(data.val());
			// });
		},

		// db에서 카테고리 가져오기
		getCategorys(db, uid) {
			const categoryRef = ref(db, "categorys/" + uid);

			onValue(
				categoryRef,
				(data) => {
					this.categorys = data.val();
				},
				{ onlyOnce: true }
			);
		},

		// db 에서 to do list 가져오기
		getTodos(db, uid) {
			const todoRef = ref(db, "todos/" + uid);

			onValue(
				todoRef,
				(data) => {
					this.todos = data.val();
				},
				{ onlyOnce: true }
			);
		},

		setHrTag() {
			let browserHeight = window.innerHeight - 200;
			let hrTag = document.querySelector(".contentsContainer hr");
			let hrStyle = hrTag.style;
			hrStyle.height = browserHeight + "px";
		},
	},

	// Vue Life cycle
	async mounted() {
		// if (localStorage.getItem("notes"))
		// 	this.notes = JSON.parse(localStorage.getItem("notes"));
		// 객체 탐지 모델 로드
		// let img = new Image();
		// let url = "https://newsimg.sedaily.com/2021/12/09/22V85NTJGY_1.jpg";
		// img.crossOrigin = "Anonymous";
		// img.src = "./assets/dog.jpg";
		// img.width = 100;
		// img.height = 100;

		this.model = await cocoSSD.load();

		// let img = document.querySelector(".hihi");
		// img.onload = async () => {
		// 	console.log(img);
		// 	this.model = await cocoSSD.load();
		// 	let tmp = await this.model.detect(img);
		// 	console.log(tmp);
		// };
	},

	async created() {
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

		// store 가져오기
		const store = getFirestore();
		this.store = store;

		// storage 가져오기
		const storage = getStorage();
		this.storage = storage;

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
					// categorys 읽어오기
					this.getCategorys(db, user.uid);
					// todos 읽어오기
					this.getTodos(db, user.uid);
				});
			})
			.catch((error) => {
				console.log(error);
			});
	},

	// vue watch
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

		categorys: function () {
			let uid = this.user.uid;
			if (uid) {
				// 노트 가져오기
				const categoryRef = ref(this.db, "categorys/" + this.user.uid);

				// 노트 화면에 반영하기
				onValue(
					categoryRef,
					(snapshot) => {
						this.categorys = snapshot.val();
					},
					{ onlyOnce: true }
				);
			}
		},

		todos: function () {
			let uid = this.user.uid;
			if (uid) {
				// 노트 가져오기
				const todoRef = ref(this.db, "todos/" + this.user.uid);

				// 노트 화면에 반영하기
				onValue(
					todoRef,
					(snapshot) => {
						this.todos = snapshot.val();
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
@import "/styles/mobile.scss";
@import "/styles/pad.scss";
</style>
